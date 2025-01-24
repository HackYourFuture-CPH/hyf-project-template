'use client';
import { useState } from 'react';
import clsx from 'clsx';

const OverviewPage = () => {
  const [questions, setQuestions] = useState(
    Array.from({ length: 40 }, (_, i) => ({
      id: i + 1,
      answered: i === 0, //first question as answered
    })),
  );

  const handleQuestionClick = (id) => {
    console.log(`Question ${id} clicked.`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-10 ">
      <div className="flex max-w-7xl space-x-6">
        {/* Left Section: Text */}
        <div className="w-1/2">
          <h1 className="mb-4 text-2xl font-bold">Din spørgsmåloversigt</h1>
          <p>
            Spørgsmåloversigten giver dig et overblik over dine besvarede og
            ubesvarede spørgsmål. Du skal trykke på et nummer for at gå til
            spørgsmålet.
          </p>
          <div>
            <div className="mb-2 flex items-center">
              <div className="mr-2 size-6 border border-gray-500"></div>
              <span>Ikke besvaret</span>
            </div>
            <div className="flex items-center">
              <div className="mr-2 size-6 bg-gray-400"></div>
              <span>Besvaret</span>
            </div>
          </div>
        </div>

        {/* Right Section: Grid */}
        <div className="w-1/2">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: 'repeat(10, 3rem)',
              gridTemplateRows: 'repeat(4, 3rem)',
            }}
          >
            {questions.map((question) => (
              <button
                key={question.id}
                onClick={() => handleQuestionClick(question.id)}
                className={clsx(
                  'size-full rounded border border-gray-500 text-center',
                  {
                    'bg-gray-400 border-gray-400': question.answered, // answered
                    'border-gray-500': !question.answered, //not answered
                  },
                )}
              >
                {question.id}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
