import LearningModule from '../models/LearningModule.js';
import User from '../models/User.js';

export const createModule = async (req, res) => {
  try {
    const { title, disasterType, description, safetySteps, quiz, estimatedTime, difficulty } = req.body;

    const module = new LearningModule({
      title,
      disasterType,
      description,
      safetySteps,
      quiz,
      estimatedTime,
      difficulty,
      createdBy: req.user.userId,
    });

    await module.save();
    res.status(201).json({ message: 'Module created successfully', module });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getModules = async (req, res) => {
  try {
    const { disasterType } = req.query;
    let query = {};
    if (disasterType) {
      query.disasterType = disasterType;
    }

    const modules = await LearningModule.find(query);
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getModuleById = async (req, res) => {
  try {
    const module = await LearningModule.findById(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.json(module);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const completeModule = async (req, res) => {
  try {
    const { score } = req.body;
    const user = await User.findById(req.user.userId);

    const completed = user.completedModules.find(
      m => m.moduleId.toString() === req.params.id
    );

    if (!completed) {
      user.completedModules.push({
        moduleId: req.params.id,
        completedAt: new Date(),
        score,
      });
      user.preparednessScore += score;

      // Award badges
      if (user.completedModules.length === 1) {
        user.badges.push({ name: 'First Steps', earnedAt: new Date() });
      }
      if (user.preparednessScore >= 100 && !user.badges.some(b => b.name === 'Prepared Mind')) {
        user.badges.push({ name: 'Prepared Mind', earnedAt: new Date() });
      }
    }

    await user.save();
    res.json({ message: 'Module completed', preparednessScore: user.preparednessScore });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateModule = async (req, res) => {
  try {
    const module = await LearningModule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: 'Module updated', module });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteModule = async (req, res) => {
  try {
    await LearningModule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Module deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
