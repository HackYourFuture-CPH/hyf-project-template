'use client';

import React, { useState, useEffect } from 'react';
import QuestionCard from '../../components/questioncard';
import PreviousNext from '../../components/prevNext';

function exam() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:5002/questions');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();

        const shuffledQuestions = data
          .sort(() => Math.random() - 0.5)
          .slice(0, 40);
        setQuestions(shuffledQuestions);
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

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answers = currentQuestion.answers;

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="card mx-auto w-full max-w-4xl rounded-xl bg-white p-10">
        <QuestionCard
          question={currentQuestion.question}
          answers={answers}
          onAnswer={handleAnswer}
        />

        <div>
          <PreviousNext
            showPrevious={currentQuestionIndex > 0}
            showNext={currentQuestionIndex < questions.length - 0}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
        <div className="page-counter mt-5 text-center text-sm text-gray-600">
          <strong>
            {currentQuestionIndex + 1} / {questions.length}
          </strong>
        </div>
      </div>
    </div>
  );
}

export default exam;
