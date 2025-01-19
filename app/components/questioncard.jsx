import React from 'react';

function QuestionCard({ question, answers, onAnswer }) {
  return (
    <div className="card mx-auto w-full max-w-4xl rounded-xl bg-white p-10">
      <h2 className="question mb-10 text-center text-2xl font-bold text-gray-800">
        {question}
      </h2>
      <div className="answers-container flex flex-col items-center gap-3">
        {Object.keys(answers).map((key) => (
          <button
            key={key}
            className="answer w-full max-w-3xl cursor-pointer rounded-lg border border-gray-100 bg-gray-100 p-1 text-lg shadow-md  transition-colors duration-300 focus:outline-none"
            onClick={() => onAnswer(key)}
          >
            {key}: {answers[key]}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuestionCard;
