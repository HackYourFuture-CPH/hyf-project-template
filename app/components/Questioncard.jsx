import PropTypes from 'prop-types';
import clsx from 'clsx';

function QuestionCard({ question, answers, selectedAnswer, onAnswer }) {
  return (
    <div className="mx-auto w-full max-w-4xl rounded-xl bg-white p-10">
      <h2 className="mb-10 text-center text-2xl font-bold text-gray-800">
        {question}
      </h2>
      <div className="flex flex-col items-center gap-3">
        <div className="flex w-full flex-col items-center gap-3">
          {Object.keys(answers).map((key) => (
            <button
              className={clsx(
                'w-full max-w-3xl cursor-pointer rounded-lg border p-2 text-lg shadow-md transition-colors duration-300 focus:outline-none',
                {
                  'border-gray-100 bg-gray-400 text-black':
                    selectedAnswer === key,
                  'border-gray-100 bg-gray-100 text-gray-800':
                    selectedAnswer !== key,
                },
              )}
              onClick={() => onAnswer(key)}
              key={key}
            >
              {key}: {answers[key]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

QuestionCard.propTypes = {
  question: PropTypes.string.isRequired,
  answers: PropTypes.object.isRequired,
  selectedAnswer: PropTypes.string,
  onAnswer: PropTypes.func.isRequired,
};

export default QuestionCard;
