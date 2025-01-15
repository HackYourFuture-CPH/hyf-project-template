import React from "react";

function QuestionCard({ question, answers, onAnswer }) {
  return (
    <div className="card bg-white rounded-xl p-10 mx-auto w-full max-w-4xl">
      <h2 className="question text-2xl font-bold mb-10 text-center text-gray-800">
        {question}
      </h2>
      <div className="answers-container flex flex-col gap-3 items-center">
        {Object.keys(answers).map((key) => (
          <button
            key={key}
            className="answer w-full max-w-3xl p-1 text-lg bg-gray-100 border p-1 border-gray-100 shadow-md rounded-lg cursor-pointer  focus:outline-none transition-colors duration-300"
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
