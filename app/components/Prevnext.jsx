import Button from './Button';
import PropTypes from 'prop-types';

function PreviousNext({ showPrevious, showNext, onPrevious, onNext }) {
  return (
    <div className="mx-auto mt-12 flex max-w-[738px] justify-between">
      {showPrevious && (
        <Button
          styles="bg-blue-500 hover:bg-blue-700"
          value="Previous"
          onClick={onPrevious}
        />
      )}
      <div className="flex-1"></div>
      {showNext && (
        <Button
          styles="pl-11 pr-11 bg-blue-500 hover:bg-blue-700"
          value="Next"
          onClick={onNext}
        />
      )}
    </div>
  );
}

PreviousNext.propTypes = {
  showPrevious: PropTypes.bool.isRequired,
  showNext: PropTypes.bool.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default PreviousNext;
