import DrillResult from '../models/DrillResult.js';
import Drill from '../models/Drill.js';
import User from '../models/User.js';

export const createDrill = async (req, res) => {
  try {
    const { title, disasterType, scheduledDate, time, class: className, description, location } = req.body;

    if (!title || !disasterType || !scheduledDate) {
      return res.status(400).json({ message: 'Title, disaster type, and date are required' });
    }

    // Combine date and time into a single Date object
    let finalDate = new Date(scheduledDate);
    if (time) {
      const [hours, minutes] = time.split(':');
      finalDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    }

    const drill = new Drill({
      title,
      disasterType,
      scheduledDate: finalDate,
      class: className,
      description,
      location,
      createdBy: req.user.userId,
    });

    await drill.save();
    res.status(201).json({ 
      message: 'Drill scheduled successfully', 
      drill 
    });
  } catch (error) {
    console.error('Error creating drill:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllScheduledDrills = async (req, res) => {
  try {
    const drills = await Drill.find()
      .populate('createdBy', 'name email')
      .sort({ scheduledDate: -1 });
    
    res.json(drills);
  } catch (error) {
    console.error('Error fetching drills:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateDrill = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If time is provided, update scheduledDate
    if (updates.time && updates.scheduledDate) {
      let finalDate = new Date(updates.scheduledDate);
      const [hours, minutes] = updates.time.split(':');
      finalDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
      updates.scheduledDate = finalDate;
    }

    const drill = await Drill.findByIdAndUpdate(id, updates, { new: true });
    
    if (!drill) {
      return res.status(404).json({ message: 'Drill not found' });
    }

    res.json({ message: 'Drill updated successfully', drill });
  } catch (error) {
    console.error('Error updating drill:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteDrill = async (req, res) => {
  try {
    const { id } = req.params;
    const drill = await Drill.findByIdAndDelete(id);
    
    if (!drill) {
      return res.status(404).json({ message: 'Drill not found' });
    }

    res.json({ message: 'Drill deleted successfully' });
  } catch (error) {
    console.error('Error deleting drill:', error);
    res.status(500).json({ message: error.message });
  }
};

export const saveDrillResult = async (req, res) => {
  try {
    const { drillType, scenario, userChoices, score, duration } = req.body;

    const drillResult = new DrillResult({
      userId: req.user.userId,
      drillType,
      scenario,
      userChoices,
      score,
      duration,
    });

    await drillResult.save();

    // Update user's preparedness score
    const user = await User.findById(req.user.userId);
    user.preparednessScore += Math.floor(score / 10);

    if (score >= 80 && !user.badges.some(b => b.name === 'Safety Expert')) {
      user.badges.push({ name: 'Safety Expert', earnedAt: new Date() });
    }

    if (score === 100 && !user.badges.some(b => b.name === 'Perfect Response')) {
      user.badges.push({ name: 'Perfect Response', earnedAt: new Date() });
    }

    await user.save();

    res.status(201).json({
      message: 'Drill result saved',
      drillResult,
      feedback: generateFeedback(score),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserDrillResults = async (req, res) => {
  try {
    const results = await DrillResult.find({ userId: req.user.userId })
      .sort({ completedAt: -1 });
    console.log(`[Drills API] User ${req.user.userId} fetched ${results.length} drill results`);
    res.json(results);
  } catch (error) {
    console.error('[Drills API] Error fetching user drill results:', error);
    res.status(500).json({ message: error.message });
  }
};

export const createSampleDrills = async (req, res) => {
  try {
    // Create sample drill results for the current user
    const sampleDrills = [
      {
        userId: req.user.userId,
        drillType: 'earthquake',
        scenario: 'Virtual Simulation',
        userChoices: [
          { question: 'What do you do?', chosen: 'Drop, Cover, Hold', correct: 'Drop, Cover, Hold', isCorrect: true }
        ],
        score: 85,
        maxScore: 100,
        feedback: 'Good response. You handled the situation well.',
        duration: 300,
      },
      {
        userId: req.user.userId,
        drillType: 'fire',
        scenario: 'Virtual Simulation',
        userChoices: [
          { question: 'How do you evacuate?', chosen: 'Crawl low under smoke', correct: 'Crawl low under smoke', isCorrect: true }
        ],
        score: 92,
        maxScore: 100,
        feedback: 'Excellent response! You responded perfectly.',
        duration: 310,
      },
      {
        userId: req.user.userId,
        drillType: 'flood',
        scenario: 'Virtual Simulation',
        userChoices: [
          { question: 'What do you do during a flood?', chosen: 'Go to the highest floor', correct: 'Go to the highest floor', isCorrect: true }
        ],
        score: 88,
        maxScore: 100,
        feedback: 'Good response. You know how to stay safe during a flood.',
        duration: 320,
      },
      {
        userId: req.user.userId,
        drillType: 'cyclone',
        scenario: 'Virtual Simulation',
        userChoices: [
          { question: 'Where should you shelter?', chosen: 'Interior room away from windows', correct: 'Interior room away from windows', isCorrect: true }
        ],
        score: 80,
        maxScore: 100,
        feedback: 'Good response. You understand cyclone safety.',
        duration: 290,
      },
    ];

    const createdDrills = await DrillResult.insertMany(sampleDrills);
    console.log(`[Drills API] Created ${createdDrills.length} sample drills for user ${req.user.userId}`);
    
    res.json({
      message: 'Sample drills created successfully',
      drills: createdDrills,
    });
  } catch (error) {
    console.error('[Drills API] Error creating sample drills:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllDrills = async (req, res) => {
  try {
    // Get all drill results for teachers/admins to view
    const drills = await DrillResult.find()
      .populate('userId', 'name email')
      .sort({ completedAt: -1 })
      .limit(100); // Limit to recent 100 for performance
    
    res.json(drills);
  } catch (error) {
    console.error('[Drills API] Error fetching all drills:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateDrillResult = async (req, res) => {
  try {
    const { id } = req.params;
    const { drillType, scenario, score, duration, feedback, completedAt } = req.body;

    const updateData = {
      drillType,
      scenario,
      score,
      duration,
      feedback,
      completedAt,
    };

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const result = await DrillResult.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      return res.status(404).json({ message: 'Drill result not found' });
    }

    res.json({ message: 'Drill result updated successfully', result });
  } catch (error) {
    console.error('[Drills API] Error updating drill result:', error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteDrillResult = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await DrillResult.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Drill result not found' });
    }

    res.json({ message: 'Drill result deleted successfully' });
  } catch (error) {
    console.error('[Drills API] Error deleting drill result:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getAdminDrillStatistics = async (req, res) => {
  try {
    const totalDrills = await DrillResult.countDocuments();
    const avgScore = await DrillResult.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$score' } } }
    ]);

    const statistics = {
      totalDrills,
      averageScore: avgScore[0]?.avgScore || 0,
    };

    res.json(statistics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateFeedback = (score) => {
  if (score >= 90) {
    return 'Excellent! You responded perfectly to the disaster scenario.';
  } else if (score >= 70) {
    return 'Good! You handled the situation well, but review the steps for improvement.';
  } else if (score >= 50) {
    return 'Fair. Consider reviewing the safety guidelines for this disaster type.';
  } else {
    return 'You need more practice. Review the learning modules before attempting again.';
  }
};
