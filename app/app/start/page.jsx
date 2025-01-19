'use client';

import Button from '@/components/Button';
import { style, layout } from '@/app/style';
import Explore from '../../components/Explore.jsx';
import {
  faCircleDollarToSlot,
  faVolumeUp,
  faLanguage,
} from '@fortawesome/free-solid-svg-icons';
import { faComments } from '@fortawesome/free-regular-svg-icons';
import Link from 'next/link';

function WelcomePage() {
  const exploreFeatures = [
    {
      id: 1,
      icon: faVolumeUp,
      title: 'Text to Speech',
    },
    {
      id: 2,
      icon: faLanguage,
      title: 'Translation',
    },
    {
      id: 3,
      icon: faCircleDollarToSlot,
      title: 'Free of Charge',
    },
    {
      id: 4,
      icon: faComments,
      title: 'Chat Blog',
    },
  ];

  return (
    <section>
      <div
        className={`${layout.section} flex-col items-center justify-center gap-10 md:flex-row`}
      >
        <div
          className={`${style.flexCenter} max-w-[600px] md:max-w-[400px] lg:max-w-[600px]`}
        >
          <h1 className={`${style.heading}`}>
            Velkommen <br /> til DKTestPrep
          </h1>
          <p className={`${style.paragraph} my-6`}>
            Bliv klar til den danske indfødsretsprøve med selvtillid! Forbereder
            du dig på den danske indfødsretsprøve? DKTestPrep er her for at
            hjælpe dig med at få succes. Med vores interaktive øvequizzer og
            engagerende fællesskabsblog vil du få den viden og selvtillid, der
            er nødvendig for at bestå prøven.
          </p>
          <Link href="/signin">
            <Button value="Log ind" styles={`mt-5`} />
          </Link>
        </div>
        <div className={`${style.flexCenter} max-w-[600px] rounded-2xl`}>
          <img src="/imageWelcome.jpg" alt="image" className="rounded-2xl" />
        </div>
      </div>
      <div
        className={`ss:flex-wrap xs:flex-wrap ss:gap-10 xs:gap-8 flex flex-row justify-center sm:flex-wrap sm:gap-10 md:gap-20 ${style.marginY}`}
      >
        {exploreFeatures.map((feature) => (
          <Explore key={feature.id} {...feature} />
        ))}
      </div>
    </section>
  );
}

export default WelcomePage;
