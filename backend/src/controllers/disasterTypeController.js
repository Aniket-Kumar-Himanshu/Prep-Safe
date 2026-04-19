import DisasterType from '../models/DisasterType.js';

export const getAllDisasterTypes = async (req, res) => {
  try {
    const { active } = req.query;
    const filter = active === 'true' ? { isActive: true } : {};
    
    const disasterTypes = await DisasterType.find(filter).sort({ displayName: 1 });
    res.json(disasterTypes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDisasterTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const disasterType = await DisasterType.findById(id);
    
    if (!disasterType) {
      return res.status(404).json({ message: 'Disaster type not found' });
    }
    
    res.json(disasterType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDisasterType = async (req, res) => {
  try {
    const disasterTypeData = {
      ...req.body,
      createdBy: req.user.userId,
    };
    
    const disasterType = new DisasterType(disasterTypeData);
    await disasterType.save();
    
    res.status(201).json({
      message: 'Disaster type created successfully',
      disasterType,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Disaster type with this name already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateDisasterType = async (req, res) => {
  try {
    const { id } = req.params;
    
    const disasterType = await DisasterType.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!disasterType) {
      return res.status(404).json({ message: 'Disaster type not found' });
    }
    
    res.json({
      message: 'Disaster type updated successfully',
      disasterType,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDisasterType = async (req, res) => {
  try {
    const { id } = req.params;
    
    const disasterType = await DisasterType.findByIdAndDelete(id);
    
    if (!disasterType) {
      return res.status(404).json({ message: 'Disaster type not found' });
    }
    
    res.json({
      message: 'Disaster type deleted successfully',
      disasterType,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDisasterStatistics = async (req, res) => {
  try {
    const totalDisasterTypes = await DisasterType.countDocuments();
    const activeDisasterTypes = await DisasterType.countDocuments({ isActive: true });
    const criticalDisasters = await DisasterType.countDocuments({ severity: 'critical' });
    
    res.json({
      totalDisasterTypes,
      activeDisasterTypes,
      criticalDisasters,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
