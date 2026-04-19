import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { quizAPI } from '../services/api';
import { motion } from 'framer-motion';

export const QuizTakingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [result, setResult] = useState(null);
  const [resultId, setResultId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizStarted, timeLeft, quizCompleted]);

  const fetchQuiz = async () => {
    try {
      const response = await quizAPI.getById(id, token);
      setQuiz(response.data);
      setTimeLeft((response.data.timeLimit || 30) * 60); // Convert minutes to seconds
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      alert('Failed to load quiz');
      navigate('/dashboard');
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    // Save the answer
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      questionIndex: currentQuestion,
      selectedAnswer: selectedAnswer,
    };
    setAnswers(newAnswers);

    // Move to next question or finish
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(newAnswers[currentQuestion + 1]?.selectedAnswer ?? null);
    } else {
      handleSubmitQuiz(newAnswers);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      // Save current answer first
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = {
        questionIndex: currentQuestion,
        selectedAnswer: selectedAnswer,
      };
      setAnswers(newAnswers);
      
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(newAnswers[currentQuestion - 1]?.selectedAnswer ?? null);
    }
  };

  const handleSubmitQuiz = async (finalAnswers = answers) => {
    try {
      const timeSpent = ((quiz.timeLimit * 60) - timeLeft);
      const response = await quizAPI.submit({
        quizId: id,
        answers: finalAnswers,
        timeSpent,
      }, token);
      
      setResult(response.data.result);
      setResultId(response.data.resultId);
      setQuizCompleted(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading quiz...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Quiz not found</div>
      </div>
    );
  }

  // Quiz completion screen
  if (quizCompleted && result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-800/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 max-w-2xl w-full"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">
              {result.passed ? '🎉' : '📚'}
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              {result.passed ? 'Congratulations!' : 'Keep Learning!'}
            </h2>
            <p className="text-gray-300 mb-8">
              {result.passed 
                ? 'You passed the quiz!' 
                : 'You can try again to improve your score.'}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-700/50 p-4 rounded-xl">
                <div className="text-4xl font-bold text-blue-400">{result.percentage.toFixed(1)}%</div>
                <div className="text-gray-400 text-sm">Your Score</div>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-xl">
                <div className="text-4xl font-bold text-green-400">{result.correctAnswers}/{result.totalQuestions}</div>
                <div className="text-gray-400 text-sm">Correct Answers</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/quiz/review/${resultId}`)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold"
              >
                📝 Review Answers
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold"
              >
                Back to Dashboard
              </motion.button>
              {!result.passed && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.reload()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold"
                >
                  Try Again
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Quiz start screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-800/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 max-w-2xl w-full"
        >
          <h1 className="text-3xl font-bold text-white mb-4">{quiz.title}</h1>
          <p className="text-gray-300 mb-6">{quiz.description || 'Test your knowledge'}</p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between bg-slate-700/50 p-4 rounded-xl">
              <span className="text-gray-300">Questions</span>
              <span className="text-white font-semibold">{quiz.questions.length}</span>
            </div>
            <div className="flex items-center justify-between bg-slate-700/50 p-4 rounded-xl">
              <span className="text-gray-300">Time Limit</span>
              <span className="text-white font-semibold">{quiz.timeLimit} minutes</span>
            </div>
            <div className="flex items-center justify-between bg-slate-700/50 p-4 rounded-xl">
              <span className="text-gray-300">Passing Score</span>
              <span className="text-white font-semibold">{quiz.passingScore}%</span>
            </div>
          </div>

          <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4 mb-6">
            <p className="text-blue-200 text-sm">
              ⏱️ Once you start, the timer will begin. Make sure you have enough time to complete the quiz.
            </p>
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-6 py-3 bg-slate-700 text-white rounded-xl font-semibold"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startQuiz}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold"
            >
              Start Quiz
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Quiz taking screen
  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="bg-slate-800/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">{quiz.title}</h2>
              <p className="text-gray-400 text-sm">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
            </div>
            <div className={`text-2xl font-bold ${timeLeft < 60 ? 'text-red-400' : 'text-blue-400'}`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/90 backdrop-blur-xl p-8 rounded-3xl border border-white/10 mb-6"
        >
          <h3 className="text-2xl font-bold text-white mb-8">{question.question}</h3>

          <div className="space-y-4">
            {question.options.map((option, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(idx)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedAnswer === idx
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-2 border-white/20'
                    : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                    selectedAnswer === idx
                      ? 'bg-white text-purple-600'
                      : 'bg-slate-600 text-gray-400'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-slate-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next →'}
          </motion.button>
        </div>
      </div>
    </div>
  );
};
