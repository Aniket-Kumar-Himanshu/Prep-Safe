import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const DisasterSimulation = ({ disasterType, onSubmit }) => {
  const [responses, setResponses] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const scenarios = {
    earthquake: {
      title: 'Earthquake Scenario',
      questions: [
        {
          id: 1,
          question: 'An earthquake suddenly strikes while you are in your classroom. What do you do?',
          options: [
            { text: 'Drop, Cover, and Hold On', correct: true },
            { text: 'Run outside immediately', correct: false },
            { text: 'Use the elevator to get down', correct: false },
            { text: 'Stay at your desk and wait', correct: false },
          ],
          explanation: 'Drop, Cover, and Hold On is the safest response during an earthquake. Get under a sturdy desk or table and protect your head.'
        },
        {
          id: 2,
          question: 'If you are outside during an earthquake, where should you go?',
          options: [
            { text: 'Move to an open area away from buildings', correct: true },
            { text: 'Run back inside to shelter', correct: false },
            { text: 'Stay where you are and cover your head', correct: false },
            { text: 'Look for a bridge to hide under', correct: false },
          ],
          explanation: 'Move to an open area away from buildings, power lines, and trees. This protects you from falling debris.'
        },
        {
          id: 3,
          question: 'After the earthquake stops, what is your next action?',
          options: [
            { text: 'Check for injuries and provide first aid if needed', correct: true },
            { text: 'Run around to find others', correct: false },
            { text: 'Leave the area immediately', correct: false },
            { text: 'Return to normal activities', correct: false },
          ],
          explanation: 'After an earthquake, check for injuries and provide first aid. Listen for emergency alerts before moving.'
        },
      ],
    },
    fire: {
      title: 'Fire Scenario',
      questions: [
        {
          id: 1,
          question: 'You smell smoke in the building and see fire in a nearby room. What do you do?',
          options: [
            { text: 'Alert others and evacuate using stairs', correct: true },
            { text: 'Try to extinguish the fire yourself', correct: false },
            { text: 'Use the elevator', correct: false },
            { text: 'Hide in a cabinet', correct: false },
          ],
          explanation: 'Immediately alert others and evacuate using stairs. Never use elevators during a fire.'
        },
        {
          id: 2,
          question: 'While evacuating, heavy smoke fills the corridor. How should you move?',
          options: [
            { text: 'Crawl low to avoid smoke inhalation', correct: true },
            { text: 'Run as fast as possible', correct: false },
            { text: 'Wait for someone to guide you', correct: false },
            { text: 'Climb onto furniture for air', correct: false },
          ],
          explanation: 'Crawl low under the smoke where visibility and air quality are better. Stay low and move quickly.'
        },
        {
          id: 3,
          question: 'After evacuating the building, where should you go?',
          options: [
            { text: 'Move far away from the building to a safe assembly point', correct: true },
            { text: 'Go to a nearby shop', correct: false },
            { text: 'Wait at the building entrance', correct: false },
            { text: 'Return inside to collect belongings', correct: false },
          ],
          explanation: 'Move to the designated safe assembly point far from the building to avoid re-entry dangers.'
        },
      ],
    },
    flood: {
      title: 'Flood Scenario',
      questions: [
        {
          id: 1,
          question: 'Rainfall is heavy and water levels are rising rapidly in your area. What should you do?',
          options: [
            { text: 'Move to higher ground immediately', correct: true },
            { text: 'Stay at home and wait', correct: false },
            { text: 'Go outside to check water levels', correct: false },
            { text: 'Continue daily activities as normal', correct: false },
          ],
          explanation: 'Move to higher ground immediately. Do not wait for water to reach you. Time is critical during floods.'
        },
        {
          id: 2,
          question: 'You are trapped in a building with floodwater outside. Your action?',
          options: [
            { text: 'Go to the highest floor and signal for help', correct: true },
            { text: 'Try to swim through the water', correct: false },
            { text: 'Jump from a window', correct: false },
            { text: 'Stay in the basement for safety', correct: false },
          ],
          explanation: 'Go to the highest floor and signal for help. Never enter floodwaters. Just 6 inches of moving water can knock you down.'
        },
        {
          id: 3,
          question: 'During evacuation, you encounter a flooded road. What do you do?',
          options: [
            { text: 'Find a different route or wait for rescue', correct: true },
            { text: 'Drive through at high speed', correct: false },
            { text: 'Wade through the water', correct: false },
            { text: 'Ignore the water and proceed', correct: false },
          ],
          explanation: 'Never enter floodwaters. Find an alternative route or wait for rescue. A car can float in less than 2 feet of water.'
        },
      ],
    },
    cyclone: {
      title: 'Cyclone Scenario',
      questions: [
        {
          id: 1,
          question: 'A cyclone warning has been issued. What is your immediate action?',
          options: [
            { text: 'Go to the designated cyclone shelter or safe room', correct: true },
            { text: 'Stay on the rooftop to observe', correct: false },
            { text: 'Continue outdoor activities', correct: false },
            { text: 'Open all windows for ventilation', correct: false },
          ],
          explanation: 'Go to a designated shelter or safe room immediately. Close all windows and doors to keep out wind and water.'
        },
        {
          id: 2,
          question: 'While sheltering, the wind outside is extremely strong. What should you do?',
          options: [
            { text: 'Stay indoors away from windows and doors', correct: true },
            { text: 'Go outside to secure loose items', correct: false },
            { text: 'Look out the window to see the storm', correct: false },
            { text: 'Go to the balcony', correct: false },
          ],
          explanation: 'Stay inside away from windows and doors. Flying debris and strong winds are most dangerous to exposed areas.'
        },
        {
          id: 3,
          question: 'After the cyclone passes, what should you check first?',
          options: [
            { text: 'Check for injuries and structural damage', correct: true },
            { text: 'Go sightseeing', correct: false },
            { text: 'Resume normal activities', correct: false },
            { text: 'Post on social media', correct: false },
          ],
          explanation: 'Check for injuries and structural damage before going outside. The eye may pass and wind can return from another direction.'
        },
      ],
    },
  };

  const scenario = scenarios[disasterType];
  if (!scenario) return null;

  const handleAnswer = (selectedOptionIndex, selectedOptionText) => {
    const currentQ = scenario.questions[currentQuestion];
    const isCorrect = currentQ.options[selectedOptionIndex].correct;
    
    const responseData = {
      question: currentQ.question,
      chosen: selectedOptionText,
      correct: currentQ.options.find(o => o.correct).text,
      isCorrect: isCorrect,
      explanation: currentQ.explanation,
    };

    const newResponses = [...responses, responseData];
    console.log(`Answer: ${isCorrect}, Current Question: ${currentQuestion}, Total: ${scenario.questions.length}`);
    
    if (currentQuestion < scenario.questions.length - 1) {
      setResponses(newResponses);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // On the last question, calculate score and submit
      const correctCount = newResponses.filter(r => r.isCorrect).length;
      const score = (correctCount / scenario.questions.length) * 100;
      console.log('Submitting drill with score:', score, 'Responses:', newResponses);
      onSubmit({ score, responses: newResponses, answeredQuestions: newResponses });
    }
  };

  const question = scenario.questions[currentQuestion];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto"
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
        {scenario.title}
      </h2>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">Question {currentQuestion + 1} of {scenario.questions.length}</p>
          <div className="w-full bg-gray-200 rounded-full h-2 ml-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / scenario.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleAnswer(idx, option.text)}
              className="w-full p-4 text-left bg-gray-100 hover:bg-blue-100 rounded-lg border-2 border-gray-300 hover:border-blue-500 transition"
            >
              {option.text}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="text-center text-sm text-gray-600">
        Progress: {responses.length} / {scenario.questions.length}
      </div>
    </motion.div>
  );
};
