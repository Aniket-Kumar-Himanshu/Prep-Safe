import VirtualDrill from '../models/VirtualDrill.js';

const combineDateAndTime = (scheduledDate, time) => {
  const finalDate = new Date(scheduledDate);

  if (time) {
    const [hours, minutes] = time.split(':');
    finalDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
  }

  return finalDate;
};

const DEFAULT_VIRTUAL_DRILLS = [
  {
    title: 'Earthquake Drill',
    description: 'Practice your response to earthquake drill',
    disasterType: 'earthquake',
    icon: '🌍',
  },
  {
    title: 'Fire Drill',
    description: 'Practice your response to fire drill',
    disasterType: 'fire',
    icon: '🔥',
  },
  {
    title: 'Flood Drill',
    description: 'Practice your response to flood drill',
    disasterType: 'flood',
    icon: '🌊',
  },
  {
    title: 'Cyclone Drill',
    description: 'Practice your response to cyclone drill',
    disasterType: 'cyclone',
    icon: '🌀',
  },
];

export const getVirtualDrills = async (req, res) => {
  try {
    const { activeOnly } = req.query;
    const query = {};

    const existingCount = await VirtualDrill.countDocuments();
    if (existingCount === 0) {
      const now = new Date();
      const seedData = DEFAULT_VIRTUAL_DRILLS.map((drill, index) => {
        const scheduledDate = new Date(now);
        scheduledDate.setDate(now.getDate() + index + 1);
        scheduledDate.setHours(10 + index, 0, 0, 0);

        return {
          ...drill,
          scheduledDate,
          isActive: true,
          createdBy: req.user.userId,
        };
      });

      await VirtualDrill.insertMany(seedData);
    }

    if (activeOnly === 'true' || req.user?.role === 'student') {
      query.isActive = true;
    }

    const virtualDrills = await VirtualDrill.find(query)
      .populate('createdBy', 'name email role')
      .sort({ scheduledDate: 1, createdAt: -1 });

    res.json(virtualDrills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVirtualDrillById = async (req, res) => {
  try {
    const virtualDrill = await VirtualDrill.findById(req.params.id).populate('createdBy', 'name email role');

    if (!virtualDrill) {
      return res.status(404).json({ message: 'Virtual drill not found' });
    }

    res.json(virtualDrill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createVirtualDrill = async (req, res) => {
  try {
    const { title, description, disasterType, icon, scheduledDate, time, isActive } = req.body;

    if (!title || !disasterType || !scheduledDate) {
      return res.status(400).json({ message: 'Title, disaster type, and scheduled date are required' });
    }

    const virtualDrill = new VirtualDrill({
      title,
      description,
      disasterType,
      icon: icon || '🧪',
      scheduledDate: combineDateAndTime(scheduledDate, time),
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user.userId,
    });

    await virtualDrill.save();
    await virtualDrill.populate('createdBy', 'name email role');

    res.status(201).json({
      message: 'Virtual drill created successfully',
      virtualDrill,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVirtualDrill = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, disasterType, icon, scheduledDate, time, isActive } = req.body;

    const updateData = {
      title,
      description,
      disasterType,
      icon,
      isActive,
    };

    if (scheduledDate) {
      updateData.scheduledDate = combineDateAndTime(scheduledDate, time);
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const virtualDrill = await VirtualDrill.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email role');

    if (!virtualDrill) {
      return res.status(404).json({ message: 'Virtual drill not found' });
    }

    res.json({ message: 'Virtual drill updated successfully', virtualDrill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteVirtualDrill = async (req, res) => {
  try {
    const { id } = req.params;
    const virtualDrill = await VirtualDrill.findByIdAndDelete(id);

    if (!virtualDrill) {
      return res.status(404).json({ message: 'Virtual drill not found' });
    }

    res.json({ message: 'Virtual drill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
