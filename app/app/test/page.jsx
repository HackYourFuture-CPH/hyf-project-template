'use client';

import { useState, useEffect } from 'react';
import QuestionCard from '../../components/Questioncard';
import PreviousNext from '../../components/Prevnext';
import CountdownTimer from '@/components/Countdowntimer';

function Exam() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
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
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleTimeUp = () => {
    alert("Time's up! Submitting your answers.");
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answers = currentQuestion.answers;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <CountdownTimer duration={40 * 60} onTimeUp={handleTimeUp} />
      <div className="mx-auto w-full max-w-4xl rounded-xl bg-white p-10 shadow-lg">
        <QuestionCard
          question={currentQuestion.question}
          answers={answers}
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
    </div>
  );
}

export default Exam;
