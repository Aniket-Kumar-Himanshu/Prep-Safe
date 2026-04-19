import Alert from '../models/Alert.js';

export const createAlert = async (req, res) => {
  try {
    const { title, description, disasterType, severity, regions, actionItems } = req.body;

    const alert = new Alert({
      title,
      description,
      disasterType,
      severity,
      regions,
      actionItems,
      createdBy: req.user.userId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await alert.save();
    res.status(201).json({ message: 'Alert created successfully', alert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAlerts = async (req, res) => {
  try {
    const { region } = req.query;
    let query = { expiresAt: { $gt: new Date() } };
    
    if (region) {
      // Find alerts that are either broadcast (empty regions) OR target this region
      query.$or = [
        { regions: { $size: 0 } },  // Broadcast alerts (empty regions array)
        { regions: { $in: [region] } }  // Region-specific alerts
      ];
    }

    const alerts = await Alert.find(query).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: 'Alert updated', alert });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAlert = async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    res.json({ message: 'Alert deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
