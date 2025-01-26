'use client';

import { useState, useEffect } from 'react';
import QuestionCard from '../../components/Questioncard';
import PreviousNext from '../../components/Prevnext';
import Button from '../../components/Button';
import CountdownTimer from '../../components/CountdownTimer';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import '../globals.css';
/* import Overview from '../../components/Overview'; -- to be used to connect to overview page*/

function Exam() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  /* const [isOverview, setIsOverview] = useState(false);  -- to be used to connect to overview page */

  const apiUrl = '/api/questions';

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data);
        setError(null);
      } catch {
        setError(
          'Unable to fetch questions. Please check your internet connection or try again later.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (answer) => {
    const updatedAnswers = { ...userAnswers, [currentQuestionIndex]: answer };
    setUserAnswers(updatedAnswers);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      speechSynthesis.cancel();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      speechSynthesis.cancel();
    }
  };

  // to be use for overview connection

  /*   const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
    setIsOverview(false);
  };

  const handleOverviewButtonClick = () => {
    setIsOverview(true);
  }; */

  /*   if (isOverview) {
    return (
      <Overview
        questions={questions}
        userAnswers={userAnswers}
        onQuestionClick={handleQuestionClick}
      />
    );
  } */

  const handleTimeUp = () => {
    (''); // to be used for time up, automatically submit the exam
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <AutorenewIcon
          className="animate-spin text-blue-500"
          style={{ fontSize: 40 }}
        />{' '}
        {/* Show the loading icon */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-center">
        <div className="max-w-md rounded-lg bg-red-100 p-5 text-red-700">
          <h2 className="text-lg font-bold">Error</h2>
          <p>{error}</p>
          <Button
            styles="mt-4 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            onClick={() => window.location.reload()}
            value="Try again"
          />
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answers = currentQuestion.answers;
  const selectedAnswer = userAnswers[currentQuestionIndex] || null;

  return (
    <section className="relative flex min-h-screen items-center justify-center">
      <button
        // onClick={handleOverviewButtonClick}
        className="absolute right-4 top-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Overview
      </button>
      <div className="absolute inset-x-0 top-4">
        <CountdownTimer duration={2700} onTimeUp={handleTimeUp} />{' '}
      </div>
      <div className="mx-auto w-full max-w-4xl rounded-xl p-10">
        <QuestionCard
          question={currentQuestion.question}
          answers={answers}
          selectedAnswer={selectedAnswer}
          onAnswer={handleAnswer}
        />

        <div>
          <PreviousNext
            showPrevious={currentQuestionIndex > 0}
            showNext={currentQuestionIndex < questions.length - 1}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
        <div className="mt-5 text-center text-sm text-gray-600">
          <strong>
            {currentQuestionIndex + 1} / {questions.length}
          </strong>
        </div>
      </div>
    </section>
  );
}

export default Exam;
