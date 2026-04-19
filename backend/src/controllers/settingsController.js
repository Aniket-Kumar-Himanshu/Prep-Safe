import AdminSetting from '../models/AdminSetting.js';

const DEFAULT_SETTINGS = {
  defaultAlertRegion: 'All',
  defaultAlertSeverity: 'medium',
  notificationsEnabled: true,
};

export const getAdminSettings = async (req, res) => {
  try {
    const adminId = req.user.userId;

    let settings = await AdminSetting.findOne({ adminId });

    if (!settings) {
      settings = await AdminSetting.create({
        adminId,
        ...DEFAULT_SETTINGS,
      });
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAdminSettings = async (req, res) => {
  try {
    const adminId = req.user.userId;
    const {
      defaultAlertRegion,
      defaultAlertSeverity,
      notificationsEnabled,
    } = req.body;

    const updateData = {
      defaultAlertRegion,
      defaultAlertSeverity,
      notificationsEnabled,
    };

    const settings = await AdminSetting.findOneAndUpdate(
      { adminId },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
