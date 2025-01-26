/* eslint-disable @next/next/no-img-element -- Disabling because this i am having problems using the optimized component for images */
'use client';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowsRotate,
  faClock,
  faForward,
  faListCheck,
} from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/Button';
import '../globals.css';

const ExamInstructions = () => {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="flex w-full max-w-4xl flex-col items-center justify-center rounded-lg p-8">
        <div className="mb-6 flex w-full justify-center">
          <img
            src="/istructionImage.jpg"
            width={500}
            height={300}
            className="max-h-60 w-1/2 rounded-lg object-cover"
            alt="Instruction"
          />
        </div>

        <h1 className="mb-6 text-center text-3xl font-bold text-blue-600">
          Velkommen til eksamen
        </h1>

        <div className="mb-6 grid grid-cols-1 gap-6 text-lg text-gray-700 md:grid-cols-2">
          <div className="flex items-start gap-4">
            <FontAwesomeIcon
              icon={faArrowsRotate}
              className="size-6 text-blue-500"
            />
            <span>
              <h2 className="font-bold">Undgå at opdatere eller genindlæse:</h2>{' '}
              Hvis du opdaterer eller genindlæser eksamenssiden, vil du miste
              alt dit fremskridt. Undgå at gøre dette under eksamen.
            </span>
          </div>
          <div className="flex items-start gap-4">
            <FontAwesomeIcon icon={faClock} className="size-6 text-green-500" />
            <span>
              <h2 className="font-bold">Timeren starter:</h2> Eksamens timeren
              begynder, så snart du klikker på knappen “Start Eksamen”.
            </span>
          </div>
          <div className="flex items-start gap-4">
            <FontAwesomeIcon
              icon={faForward}
              className="size-6 text-purple-500"
            />
            <span>
              <h2 className="font-bold">Spring spørgsmål over:</h2> Hvis du er
              usikker på et spørgsmål, kan du springe det over og vende tilbage
              til det senere. Du kan også gå tilbage til tidligere spørgsmål for
              at ændre dine svar.
            </span>
          </div>
          <div className="flex items-start gap-4 ">
            <FontAwesomeIcon
              icon={faListCheck}
              className="size-6 text-red-500"
            />
            <span>
              <h2 className="font-bold">Eksamensoversigt:</h2> Brug
              eksamensoversigten til at overvåge dit fremskridt. Den giver et
              klart overblik over besvarede og ubesvarede spørgsmål, så du kan
              holde dig organiseret under testen. Ved at klikke på et nummer i
              oversigten vil du blive ført til det spørgsmål.
            </span>
          </div>
        </div>

        <Link href="/questions">
          <Button
            value="Start Eksamen"
            className="mt-10 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          />
        </Link>
      </div>
    </section>
  );
};

export default ExamInstructions;
