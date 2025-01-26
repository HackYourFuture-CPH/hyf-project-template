import PropTypes from 'prop-types';
import clsx from 'clsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';

function QuestionCard({ question, answers, selectedAnswer, onAnswer }) {
  const handleReadAloud = () => {
    speechSynthesis.cancel();

    const questionUtterance = new SpeechSynthesisUtterance();
    questionUtterance.lang = 'da-DK';
    questionUtterance.rate = 0.8;

    const questionText = `${question}.`;
    questionUtterance.text = questionText;

    const voices = speechSynthesis.getVoices();
    const danishVoice = voices.find((voice) => voice.lang === 'da-DK');
    if (danishVoice) {
      questionUtterance.voice = danishVoice;
    }

    speechSynthesis.speak(questionUtterance);

    questionUtterance.onend = () => {
      setTimeout(() => {
        const answerEntries = Object.entries(answers);

        const readAnswers = (index = 0) => {
          if (index < answerEntries.length) {
            const [key, value] = answerEntries[index];
            const answerText = `${key}: ${value}`;

            const answerUtterance = new SpeechSynthesisUtterance(answerText);
            answerUtterance.lang = 'da-DK';
            answerUtterance.rate = 0.8;
            answerUtterance.voice = danishVoice;

            speechSynthesis.speak(answerUtterance);

            answerUtterance.onend = () => {
              setTimeout(() => readAnswers(index + 1), 1000);
            };
          }
        };

        readAnswers();
      }, 1000);
    };
  };

  const handleAnswer = (key) => {
    speechSynthesis.cancel();
    onAnswer(key);
  };

  return (
    <div className="relative mx-auto w-full max-w-4xl rounded-xl  p-10">
      <button
        onClick={handleReadAloud}
        className="absolute right-11 top-0 cursor-pointer text-blue-500 hover:text-blue-600"
        aria-label="Read aloud"
      >
        <FontAwesomeIcon icon={faVolumeUp} size="lg" />
      </button>

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
                  'border-gray-100 bg-white text-gray-800':
                    selectedAnswer !== key,
                },
              )}
              onClick={() => handleAnswer(key)}
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
