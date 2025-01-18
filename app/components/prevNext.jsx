import React from 'react';
import Button from './Button';

function PreviousNext({ showPrevious, showNext, onPrevious, onNext }) {
  return (
    <div className="navigation-buttons mt-12 flex   max-w-5xl  justify-between">
      {showPrevious && (
        <Button
          styles="bg-blue-500 hover:bg-blue-700"
          value="Previous"
          onClick={onPrevious}
        />
      )}
      {showNext && (
        <Button
          styles="bg-blue-500 hover:bg-blue-700"
          value="Next"
          onClick={onNext}
        />
      )}
    </div>
  );
}

export default PreviousNext;
