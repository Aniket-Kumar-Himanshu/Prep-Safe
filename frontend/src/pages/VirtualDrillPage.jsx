import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { DisasterSimulation } from '../components/DisasterSimulation';
import { drillAPI } from '../services/api';
import { Card, Badge } from '../components/UI';
import { motion } from 'framer-motion';

export const VirtualDrillPage = () => {
  const { user, token, fetchCurrentUser } = useContext(AuthContext);
  const [selectedDisaster, setSelectedDisaster] = useState(null);
  const [drillResult, setDrillResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const disasters = [
    { type: 'earthquake', name: 'Earthquake Drill', emoji: '🌍', color: 'yellow' },
    { type: 'fire', name: 'Fire Drill', emoji: '🔥', color: 'orange' },
    { type: 'flood', name: 'Flood Drill', emoji: '💧', color: 'blue' },
    { type: 'cyclone', name: 'Cyclone Drill', emoji: '🌪️', color: 'gray' },
  ];

  const handleDrillSubmit = async (result) => {
    console.log('Drill result received:', result);
    setLoading(true);
    try {
      const submitData = {
        drillType: selectedDisaster,
        scenario: 'Virtual Simulation',
        userChoices: result.answeredQuestions || result.responses,
        score: result.score,
        duration: 300,
      };

      console.log('Submitting drill data:', submitData);
      await drillAPI.save(submitData, token);
      console.log('Drill saved successfully');
      // Refetch user data to update preparednessScore
      await fetchCurrentUser();
      setDrillResult(result);
    } catch (error) {
      console.error('Error saving drill result:', error);
      // Still show the result even if saving fails
      setDrillResult(result);
    } finally {
      setLoading(false);
    }
  };

  const resetDrill = () => {
    setSelectedDisaster(null);
    setDrillResult(null);
  };

  return (
    <div className="bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 min-h-screen py-12 relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-40 right-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
        transition={{ duration: 18, repeat: Infinity, delay: 2 }}
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-black bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent mb-3">
            🎮 Virtual Disaster Drills
          </h1>
          <p className="text-lg text-gray-300">Practice your response to different disaster scenarios and earn badges!</p>
        </motion.div>

        {selectedDisaster && !drillResult ? (
          <div className="space-y-6">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedDisaster(null)}
              className="text-blue-300 hover:text-blue-200 font-bold text-lg transition-all"
            >
              ← Back to Drills
            </motion.button>
            
            {!loading ? (
              <DisasterSimulation
                disasterType={selectedDisaster}
                onSubmit={handleDrillSubmit}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 p-16 rounded-2xl text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl mb-4"
                >
                  ⏳
                </motion.div>
                <p className="text-xl text-white font-semibold">Saving your results...</p>
              </motion.div>
            )}
          </div>
        ) : drillResult ? (
          <div className="space-y-6">
            {/* Feedback Section */}
            {drillResult.answeredQuestions && drillResult.answeredQuestions.length > 0 && (
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">📋 Detailed Feedback</h3>
                <div className="space-y-6">
                  {drillResult.answeredQuestions.map((item, idx) => {
                    const showingFeedback = true;
                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="space-y-3"
                      >
                        <div className={`border-l-4 ${item.isCorrect ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'} p-4 rounded`}>
                          <p className="text-white font-semibold mb-2">Q{idx + 1}: {item.question}</p>
                          <p className={`${item.isCorrect ? 'text-green-300' : 'text-red-300'} text-sm mb-2`}>
                            {item.isCorrect ? '✅ Your answer: ' : '❌ Your answer: '} {item.chosen}
                          </p>
                        </div>
                        
                        {!item.isCorrect && (
                          <div className="bg-emerald-500/10 border-l-4 border-emerald-500 p-4 rounded">
                            <p className="text-emerald-300 text-sm font-semibold">✅ Correct answer: {item.correct}</p>
                          </div>
                        )}
                        
                        <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded">
                          <p className="text-blue-300 text-sm"><span className="font-semibold">💡 Explanation:</span> {item.explanation}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Score Card */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 p-12 rounded-3xl text-center hover:border-white/30 transition-all duration-300"
            >
              <motion.div
                className="text-8xl mb-6"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6 }}
              >
                {drillResult.score >= 80 ? '🎉' : drillResult.score >= 60 ? '👍' : '📚'}
              </motion.div>
              <motion.h2
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-7xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-4"
              >
                {Math.round(drillResult.score)}%
              </motion.h2>
              <p className="text-3xl font-bold text-white mb-3">
                {drillResult.score >= 80
                  ? 'Excellent Response! 🏅'
                  : drillResult.score >= 60
                  ? 'Good Job! 🌟'
                  : 'Keep Practicing! 💪'}
              </p>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                {drillResult.score >= 80
                  ? 'You responded excellently to the disaster scenario. Outstanding preparedness and quick thinking!'
                  : drillResult.score >= 60
                  ? 'Good response! Review the learning modules to improve your decision-making in emergencies.'
                  : 'Review the learning modules and safety guidelines before attempting again. Practice makes perfect!'}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetDrill}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-10 py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
              >
                Try Another Drill
              </motion.button>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {disasters.map((disaster, idx) => (
              <motion.div
                key={disaster.type}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-white/30 p-8 rounded-2xl transition-all duration-300 cursor-pointer group"
              >
                <div className="text-7xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">
                  {disaster.emoji}
                </div>
                <h3 className="text-2xl font-bold text-center text-white mb-3">
                  {disaster.name}
                </h3>
                <p className="text-center text-gray-300 mb-8">
                  Practice your response to {disaster.name.toLowerCase()}
                </p>
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDisaster(disaster.type)}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300"
                  >
                    🎯 Start Drill
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
