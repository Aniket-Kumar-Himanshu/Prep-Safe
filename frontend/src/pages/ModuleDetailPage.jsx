import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { moduleAPI } from '../services/api';
import { Card, Button } from '../components/UI';
import { motion } from 'framer-motion';

export const ModuleDetailPage = () => {
  const { token, fetchCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [module, setModule] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState({});

  useEffect(() => {
    fetchModule();
  }, [id]);

  const fetchModule = async () => {
    try {
      const res = await moduleAPI.getById(id);
      setModule(res.data);
    } catch (error) {
      console.error('Error fetching module:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizAnswer = (questionIdx, optionIdx) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIdx] = optionIdx;
    setQuizAnswers(newAnswers);
  };

  const submitQuiz = async () => {
    let correctCount = 0;
    const answered = {};
    
    module.quiz.forEach((q, idx) => {
      const isCorrect = quizAnswers[idx] === q.correctAnswer;
      answered[idx] = isCorrect;
      if (isCorrect) {
        correctCount++;
      }
    });

    setAnsweredQuestions(answered);
    const calculatedScore = (correctCount / module.quiz.length) * 100;
    setShowFeedback(true);

    try {
      await moduleAPI.complete(id, calculatedScore, token);
      // Refetch user data to update preparednessScore
      await fetchCurrentUser();
    } catch (error) {
      console.error('Error completing module:', error);
    }
  };

  const handleShowScore = () => {
    // Only show score after user reviews feedback
    const correctCount = Object.values(answeredQuestions).filter(v => v).length;
    const calculatedScore = (correctCount / module.quiz.length) * 100;
    setScore(calculatedScore);
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 min-h-screen flex items-center justify-center relative overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl"
        >
          📚
        </motion.div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🚫</div>
          <p className="text-white text-2xl font-bold">Module not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 min-h-screen py-12 relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
        transition={{ duration: 18, repeat: Infinity, delay: 2 }}
      />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent mb-4">
            {module.title}
          </h1>
          <div className="flex gap-3 flex-wrap">
            <span className="px-4 py-2 rounded-full bg-blue-500/30 border border-blue-400/50 text-blue-300 font-bold">
              {module.disasterType === 'earthquake' && '🌍'} {module.disasterType.charAt(0).toUpperCase() + module.disasterType.slice(1)}
            </span>
            <span className="px-4 py-2 rounded-full bg-green-500/30 border border-green-400/50 text-green-300 font-bold">
              {module.difficulty.charAt(0).toUpperCase() + module.difficulty.slice(1)}
            </span>
            <span className="px-4 py-2 rounded-full bg-purple-500/30 border border-purple-400/50 text-purple-300 font-bold">
              ⏱️ {module.estimatedTime} min
            </span>
          </div>
        </motion.div>

        {score !== null ? (
          // Score Display
          <motion.div
            initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 p-12 rounded-3xl text-center"
          >
            <motion.div
              className="text-8xl mb-6"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6 }}
            >
              {score >= 80 ? '🎉' : score >= 60 ? '👍' : '📚'}
            </motion.div>
            <motion.p
              className="text-6xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              {Math.round(score)}%
            </motion.p>
            <p className="text-3xl font-bold text-white mb-4">
              {score >= 80 ? '🏅 Excellent!' : score >= 60 ? '🌟 Good Job!' : '💪 Keep Learning!'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-10 py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
            >
              ← Back to Dashboard
            </motion.button>
          </motion.div>
        ) : showQuiz ? (
          // Quiz Section
          <div className="space-y-6">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xl font-bold text-white mb-8"
            >
              📝 Let's Test Your Knowledge!
            </motion.h2>
            {module.quiz.map((question, qIdx) => {
              const isCorrect = answeredQuestions[qIdx];
              const userSelectedIdx = quizAnswers[qIdx];
              const showingFeedback = showFeedback;

              return (
                <motion.div
                  key={qIdx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: qIdx * 0.1 }}
                  className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border p-8 rounded-2xl transition-all duration-300 ${
                    showingFeedback
                      ? isCorrect
                        ? 'border-green-400/50'
                        : 'border-red-400/50'
                      : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <h3 className="text-xl font-bold text-white mb-6">
                    <span className="text-blue-400">Question {qIdx + 1}:</span> {question.question}
                  </h3>
                  <div className="space-y-3">
                    {question.options.map((option, oIdx) => {
                      const isUserAnswer = userSelectedIdx === oIdx;
                      const isCorrectAnswer = oIdx === question.correctAnswer;
                      let borderColor = 'border-white/10';
                      let bgColor = 'bg-white/5';

                      if (showingFeedback) {
                        if (isUserAnswer && isCorrect) {
                          borderColor = 'border-green-400/50';
                          bgColor = 'bg-green-500/10';
                        } else if (isUserAnswer && !isCorrect) {
                          borderColor = 'border-red-400/50';
                          bgColor = 'bg-red-500/10';
                        } else if (isCorrectAnswer && !isCorrect) {
                          borderColor = 'border-green-400/50';
                          bgColor = 'bg-green-500/10';
                        }
                      }

                      return (
                        <label
                          key={oIdx}
                          className={`flex items-center gap-4 p-4 ${bgColor} border ${borderColor} rounded-lg cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all`}
                        >
                          <input
                            type="radio"
                            name={`question-${qIdx}`}
                            checked={isUserAnswer}
                            onChange={() => !showingFeedback && handleQuizAnswer(qIdx, oIdx)}
                            disabled={showingFeedback}
                            className="w-5 h-5 accent-blue-500"
                          />
                          <span className="text-white font-medium flex-1">{option}</span>
                          {showingFeedback && isUserAnswer && isCorrect && (
                            <span className="text-green-400 font-bold">✅</span>
                          )}
                          {showingFeedback && isUserAnswer && !isCorrect && (
                            <span className="text-red-400 font-bold">❌</span>
                          )}
                          {showingFeedback && isCorrectAnswer && !isCorrect && (
                            <span className="text-green-400 font-bold">✓ Correct</span>
                          )}
                        </label>
                      );
                    })}
                  </div>

                  {/* Feedback Section */}
                  {showingFeedback && !isCorrect && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 pt-6 border-t border-white/10"
                    >
                      <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4 mb-4">
                        <p className="text-red-300 font-bold mb-2">❌ Wrong Answer</p>
                        <p className="text-red-200">You selected: <span className="font-bold">{question.options[userSelectedIdx]}</span></p>
                      </div>
                      <div className="bg-green-500/20 border border-green-400/50 rounded-lg p-4 mb-4">
                        <p className="text-green-300 font-bold mb-2">✅ Correct Answer</p>
                        <p className="text-green-200"><span className="font-bold">{question.options[question.correctAnswer]}</span></p>
                      </div>
                      <div className="bg-blue-500/20 border border-blue-400/50 rounded-lg p-4">
                        <p className="text-blue-300 font-bold mb-2">📚 Explanation</p>
                        <p className="text-blue-200">{question.explanation}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Correct Answer Message */}
                  {showingFeedback && isCorrect && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 pt-6 border-t border-white/10 bg-green-500/20 border border-green-400/50 rounded-lg p-4"
                    >
                      <p className="text-green-300 font-bold mb-2">✅ Correct!</p>
                      <p className="text-green-200 mb-3">{question.explanation}</p>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}

            {!showFeedback ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={submitQuiz}
                disabled={quizAnswers.length !== module.quiz.length}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 text-lg mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ✅ Submit Quiz
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShowScore}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 text-lg mt-8"
              >
                📊 See Your Score
              </motion.button>
            )}
          </div>
        ) : (
          // Learning Content
          <div className="space-y-6">
            {currentStep < module.safetySteps.length ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl hover:border-white/30 transition-all duration-300"
                >
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-3xl font-bold text-white">
                        Step {currentStep + 1}: {module.safetySteps[currentStep].description}
                      </h2>
                      <span className="text-blue-400 font-bold text-lg">
                        {currentStep + 1} / {module.safetySteps.length}
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-blue-400 to-cyan-400 h-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / module.safetySteps.length) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {module.safetySteps[currentStep].illustration && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-xl p-12 text-center mb-8"
                    >
                      <p className="text-7xl">{module.safetySteps[currentStep].illustration}</p>
                    </motion.div>
                  )}
                </motion.div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </motion.button>
                  {currentStep === module.safetySteps.length - 1 ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowQuiz(true)}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300"
                    >
                      Take Quiz →
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
                    >
                      Next →
                    </motion.button>
                  )}
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
