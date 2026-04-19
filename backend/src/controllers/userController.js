import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      school: user.school,
      region: user.region,
      preparednessScore: user.preparednessScore,
      badges: user.badges,
      completedModules: user.completedModules,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, school, region } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, school, region },
      { new: true }
    );

    res.json({
      message: 'Profile updated',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        school: user.school,
        region: user.region,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsersStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const studentCount = await User.countDocuments({ role: 'student' });
    const teacherCount = await User.countDocuments({ role: 'teacher' });
    const adminCount = await User.countDocuments({ role: 'admin' });
    const avgPreparednessScore = await User.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$preparednessScore' } } }
    ]);

    res.json({
      totalUsers,
      studentCount,
      teacherCount,
      adminCount,
      averagePreparednessScore: avgPreparednessScore[0]?.avgScore || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, school, region } = req.body;
    
    // Check if email is being changed and if it already exists
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    const user = await User.findByIdAndUpdate(
      id,
      { name, email, school, region },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the user first to check their role
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deletion of admin users
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    // Delete the user
    await User.findByIdAndDelete(id);

    res.json({
      message: 'User deleted successfully',
      deletedUser: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignModuleToStudents = async (req, res) => {
  try {
    const { moduleId, studentIds, dueDate } = req.body;

    if (!moduleId || !studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ message: 'Module ID and student IDs are required' });
    }

    const teacherId = req.user.userId;
    const assignedAt = new Date();

    // Update all selected students
    const updatePromises = studentIds.map(async (studentId) => {
      const user = await User.findById(studentId);
      
      if (!user) {
        return { success: false, studentId, message: 'User not found' };
      }

      // Check if module is already assigned
      const alreadyAssigned = user.assignedModules.some(
        (m) => m.moduleId.toString() === moduleId
      );

      if (alreadyAssigned) {
        return { success: false, studentId, message: 'Module already assigned', name: user.name };
      }

      // Add module to assignedModules
      user.assignedModules.push({
        moduleId,
        assignedAt,
        assignedBy: teacherId,
        dueDate: dueDate || null,
      });

      await user.save();
      return { success: true, studentId, name: user.name };
    });

    const results = await Promise.all(updatePromises);
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    res.json({
      message: `Module assigned to ${successful.length} student(s)`,
      successful,
      failed,
      totalAssigned: successful.length,
    });
  } catch (error) {
    console.error('Error assigning module:', error);
    res.status(500).json({ message: error.message });
  }
};
