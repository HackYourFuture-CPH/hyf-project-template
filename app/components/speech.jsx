import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const ReadingComponent = ({
  translatedQuestion,
  translatedAnswers,
  selectedLanguage,
}) => {
  const handleReadAloud = () => {
    speechSynthesis.cancel();

    const questionUtterance = new SpeechSynthesisUtterance(translatedQuestion);
    questionUtterance.lang =
      selectedLanguage === 'da'
        ? 'da-DK'
        : `${selectedLanguage}-${selectedLanguage.toUpperCase()}`;
    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) {
      speechSynthesis.onvoiceschanged = () => handleReadAloud();
      return;
    }

    const languageVoice = voices.find((voice) =>
      voice.lang.startsWith(selectedLanguage),
    );
    questionUtterance.voice = languageVoice || voices[0];

    speechSynthesis.speak(questionUtterance);

    questionUtterance.onend = () => {
      setTimeout(() => {
        const answerEntries = Object.entries(translatedAnswers);

        const readAnswers = (index = 0) => {
          if (index < answerEntries.length) {
            const [key, value] = answerEntries[index];
            const answerText = `${key}: ${value}`;

            const answerUtterance = new SpeechSynthesisUtterance(answerText);
            answerUtterance.lang =
              selectedLanguage === 'da'
                ? 'da-DK'
                : `${selectedLanguage}-${selectedLanguage.toUpperCase()}`;
            answerUtterance.rate = 0.8;
            answerUtterance.voice = languageVoice;

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

  return (
    <button
      onClick={handleReadAloud}
      className="absolute right-11 top-0 cursor-pointer text-blue-500 hover:text-blue-600"
      aria-label="Read aloud"
    >
      <FontAwesomeIcon icon={faVolumeUp} size="lg" />
    </button>
  );
};

ReadingComponent.propTypes = {
  translatedQuestion: PropTypes.string.isRequired,
  translatedAnswers: PropTypes.object.isRequired,
  selectedLanguage: PropTypes.string.isRequired,
};

export default ReadingComponent;
