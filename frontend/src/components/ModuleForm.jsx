import { useState } from 'react';
import { motion } from 'framer-motion';

const ModuleForm = ({ onSubmit, onCancel, initialData = null }) => {
  const isEditMode = Boolean(initialData);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    disasterType: initialData?.disasterType || 'earthquake',
    description: initialData?.description || '',
    estimatedTime: initialData?.estimatedTime || 30,
    difficulty: initialData?.difficulty || 'beginner',
    safetySteps: initialData?.safetySteps || [{ step: 1, description: '', illustration: '' }],
    quiz: initialData?.quiz || [{ question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }]
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const disasterTypes = [
    { value: 'earthquake', label: '🌍 Earthquake', icon: '🌍' },
    { value: 'flood', label: '🌊 Flood', icon: '🌊' },
    { value: 'fire', label: '🔥 Fire', icon: '🔥' },
    { value: 'cyclone', label: '🌪️ Cyclone', icon: '🌪️' }
  ];

  const difficulties = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'estimatedTime' ? parseInt(value) || 0 : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSafetyStepChange = (index, field, value) => {
    const newSteps = [...formData.safetySteps];
    newSteps[index] = {
      ...newSteps[index],
      [field]: field === 'step' ? parseInt(value) || index + 1 : value
    };
    setFormData(prev => ({ ...prev, safetySteps: newSteps }));
  };

  const addSafetyStep = () => {
    setFormData(prev => ({
      ...prev,
      safetySteps: [...prev.safetySteps, { step: prev.safetySteps.length + 1, description: '', illustration: '' }]
    }));
  };

  const removeSafetyStep = (index) => {
    if (formData.safetySteps.length > 1) {
      const newSteps = formData.safetySteps.filter((_, i) => i !== index);
      // Renumber steps
      const renumberedSteps = newSteps.map((step, i) => ({ ...step, step: i + 1 }));
      setFormData(prev => ({ ...prev, safetySteps: renumberedSteps }));
    }
  };

  const handleQuizChange = (index, field, value, optionIndex = null) => {
    const newQuiz = [...formData.quiz];
    if (field === 'options' && optionIndex !== null) {
      newQuiz[index].options[optionIndex] = value;
    } else if (field === 'correctAnswer') {
      newQuiz[index][field] = parseInt(value);
    } else {
      newQuiz[index][field] = value;
    }
    setFormData(prev => ({ ...prev, quiz: newQuiz }));
  };

  const addQuizQuestion = () => {
    setFormData(prev => ({
      ...prev,
      quiz: [...prev.quiz, { question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }]
    }));
  };

  const removeQuizQuestion = (index) => {
    if (formData.quiz.length > 1) {
      setFormData(prev => ({
        ...prev,
        quiz: prev.quiz.filter((_, i) => i !== index)
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.estimatedTime || formData.estimatedTime < 1) {
      newErrors.estimatedTime = 'Estimated time must be at least 1 minute';
    }

    // Validate safety steps
    formData.safetySteps.forEach((step, index) => {
      if (!step.description.trim()) {
        newErrors[`safetyStep_${index}`] = `Safety step ${index + 1} description is required`;
      }
    });

    // Validate quiz questions
    formData.quiz.forEach((question, index) => {
      if (!question.question.trim()) {
        newErrors[`quiz_${index}_question`] = `Question ${index + 1} is required`;
      }
      const filledOptions = question.options.filter(opt => opt.trim()).length;
      if (filledOptions < 2) {
        newErrors[`quiz_${index}_options`] = `Question ${index + 1} needs at least 2 options`;
      }
      if (!question.explanation.trim()) {
        newErrors[`quiz_${index}_explanation`] = `Question ${index + 1} explanation is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
      onSubmit={handleSubmit}
    >
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
        
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Module Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Earthquake Safety Basics"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Disaster Type and Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disaster Type <span className="text-red-500">*</span>
              </label>
              <select
                name="disasterType"
                value={formData.disasterType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {disasterTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty Level
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {difficulties.map(diff => (
                  <option key={diff.value} value={diff.value}>{diff.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Estimated Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Time (minutes) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="estimatedTime"
              value={formData.estimatedTime}
              onChange={handleInputChange}
              min="1"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.estimatedTime ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="30"
            />
            {errors.estimatedTime && <p className="mt-1 text-sm text-red-600">{errors.estimatedTime}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Provide a detailed description of what students will learn..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>
        </div>
      </div>

      {/* Safety Steps */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Safety Steps</h3>
          <button
            type="button"
            onClick={addSafetyStep}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            + Add Step
          </button>
        </div>

        <div className="space-y-4">
          {formData.safetySteps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-gray-700">Step {step.step}</h4>
                {formData.safetySteps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSafetyStep(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={step.description}
                    onChange={(e) => handleSafetyStepChange(index, 'description', e.target.value)}
                    rows="2"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors[`safetyStep_${index}`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe this safety step..."
                  />
                  {errors[`safetyStep_${index}`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`safetyStep_${index}`]}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Illustration URL (optional)
                  </label>
                  <input
                    type="text"
                    value={step.illustration}
                    onChange={(e) => handleSafetyStepChange(index, 'illustration', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quiz Questions */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Quiz Questions</h3>
          <button
            type="button"
            onClick={addQuizQuestion}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            + Add Question
          </button>
        </div>

        <div className="space-y-6">
          {formData.quiz.map((question, qIndex) => (
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-medium text-gray-700">Question {qIndex + 1}</h4>
                {formData.quiz.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuizQuestion(qIndex)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Question Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={question.question}
                    onChange={(e) => handleQuizChange(qIndex, 'question', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors[`quiz_${qIndex}_question`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your question..."
                  />
                  {errors[`quiz_${qIndex}_question`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`quiz_${qIndex}_question`]}</p>
                  )}
                </div>

                {/* Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Answer Options <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct_${qIndex}`}
                          checked={question.correctAnswer === optIndex}
                          onChange={() => handleQuizChange(qIndex, 'correctAnswer', optIndex)}
                          className="text-blue-600"
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleQuizChange(qIndex, 'options', e.target.value, optIndex)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Option ${optIndex + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  {errors[`quiz_${qIndex}_options`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`quiz_${qIndex}_options`]}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Select the correct answer by clicking the radio button</p>
                </div>

                {/* Explanation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Explanation <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={question.explanation}
                    onChange={(e) => handleQuizChange(qIndex, 'explanation', e.target.value)}
                    rows="2"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors[`quiz_${qIndex}_explanation`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Explain why this is the correct answer..."
                  />
                  {errors[`quiz_${qIndex}_explanation`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`quiz_${qIndex}_explanation`]}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Module' : 'Create Module')}
        </button>
      </div>
    </motion.form>
  );
};

export default ModuleForm;
