import React from "react";
import Button from "./Button";

function PreviousNext({ showPrevious, showNext, onPrevious, onNext }) {
  return (
    <div className="navigation-buttons flex justify-between   mt-12  max-w-5xl">
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
