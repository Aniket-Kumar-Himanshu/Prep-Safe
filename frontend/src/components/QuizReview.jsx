import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { quizAPI } from '../services/api';

const QuizReview = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReviewData();
  }, [resultId]);

  const fetchReviewData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await quizAPI.getReview(resultId, token);
      setReviewData(response.data);
    } catch (err) {
      console.error('Error fetching review data:', err);
      setError(err.response?.data?.message || 'Failed to load quiz review');
    } finally {
      setLoading(false);
    }
  };

  const getOptionClass = (questionData, optionIndex) => {
    const isUserAnswer = questionData.userAnswer === optionIndex;
    const isCorrectAnswer = questionData.correctAnswer === optionIndex;

    if (isCorrectAnswer) {
      return 'bg-green-100 border-green-500 text-green-800';
    }
    if (isUserAnswer && !isCorrectAnswer) {
      return 'bg-red-100 border-red-500 text-red-800';
    }
    return 'bg-gray-50 border-gray-300 text-gray-700';
  };

  const getOptionIcon = (questionData, optionIndex) => {
    const isUserAnswer = questionData.userAnswer === optionIndex;
    const isCorrectAnswer = questionData.correctAnswer === optionIndex;

    if (isCorrectAnswer) {
      return '✓';
    }
    if (isUserAnswer && !isCorrectAnswer) {
      return '✗';
    }
    return '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading review...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (!reviewData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Quiz Review: {reviewData.quizTitle}
          </h1>
          {reviewData.quizDescription && (
            <p className="text-gray-600 mb-4">{reviewData.quizDescription}</p>
          )}
          
          {/* Score Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">
                {reviewData.percentage.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Score</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">
                {reviewData.questions.filter(q => q.isCorrect).length}/{reviewData.questions.length}
              </p>
              <p className="text-sm text-gray-600">Correct</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">
                {reviewData.score}/{reviewData.totalPoints}
              </p>
              <p className="text-sm text-gray-600">Points</p>
            </div>
            <div className={`p-4 rounded-lg text-center ${
              reviewData.passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <p className={`text-2xl font-bold ${
                reviewData.passed ? 'text-green-600' : 'text-red-600'
              }`}>
                {reviewData.passed ? '✓ PASS' : '✗ FAIL'}
              </p>
              <p className="text-sm text-gray-600">Result</p>
            </div>
          </div>

          {reviewData.timeSpent && (
            <div className="mt-4 text-center text-gray-600">
              <p>
                Time Spent: {Math.floor(reviewData.timeSpent / 60)}m {reviewData.timeSpent % 60}s
              </p>
            </div>
          )}
        </div>

        {/* Questions Review */}
        <div className="space-y-6">
          {reviewData.questions.map((question, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Question {question.questionNumber}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      question.isCorrect
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {question.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {question.question}
                  </h3>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm text-gray-600">
                    {question.earnedPoints}/{question.points} points
                  </p>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-4">
                {question.options.map((option, optionIndex) => {
                  const isUserAnswer = question.userAnswer === optionIndex;
                  const isCorrectAnswer = question.correctAnswer === optionIndex;
                  
                  return (
                    <div
                      key={optionIndex}
                      className={`border-2 rounded-lg p-4 transition-all ${getOptionClass(question, optionIndex)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold">
                            {String.fromCharCode(65 + optionIndex)}.
                          </span>
                          <span>{option}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isUserAnswer && (
                            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">
                              Your Answer
                            </span>
                          )}
                          {isCorrectAnswer && (
                            <span className="text-xl font-bold">
                              {getOptionIcon(question, optionIndex)}
                            </span>
                          )}
                          {isUserAnswer && !isCorrectAnswer && (
                            <span className="text-xl font-bold">
                              {getOptionIcon(question, optionIndex)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {question.explanation && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="font-semibold text-blue-900 mb-2">
                    💡 Explanation:
                  </p>
                  <p className="text-gray-700">{question.explanation}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Return to Dashboard
          </button>
          <button
            onClick={() => window.print()}
            className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold"
          >
            Print Review
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizReview;
