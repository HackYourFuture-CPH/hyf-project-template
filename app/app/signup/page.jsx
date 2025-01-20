'use client';

import Button from '@/components/Button';
import { style } from '@/app/style';
import Link from 'next/link';

export default function SignUpPage() {
  const handleSubmit = (event) => {
    event.preventDefault();

    console.log('Form submitted');
  };

  return (
    <section>
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-7 shadow-xl">
        <h1 className={`${style.heading} text-center`}>Tilmeld dig</h1>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="mt-5 flex w-full flex-row gap-5">
            <div className="flex grow flex-col gap-1">
              <label className="ml-1 font-bold" htmlFor="name">
                Fornavn
              </label>
              <input
                className="rounded-xl border p-2 duration-300 hover:border-blue-300"
                autoComplete="name"
                type="text"
                name="name"
                id="name"
                required
                placeholder="Indtast fornavn"
              />
            </div>
            <div className="flex grow flex-col gap-1">
              <label className="ml-1 font-bold" htmlFor="surname">
                Efternavn
              </label>
              <input
                className="rounded-xl border p-2 duration-300 hover:border-blue-300"
                autoComplete="name"
                type="text"
                name="surname"
                id="surname"
                required
                placeholder="Indtast efternavn"
              />
            </div>
          </div>
          <div className="">
            <div className="mb-5 flex flex-col gap-1">
              <label htmlFor="email" className="ml-1 font-bold">
                E-mail
              </label>
              <input
                className="rounded-xl border p-2 duration-300 hover:border-blue-300"
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                required
                placeholder="eksempel.e-mail@gmail.com"
              />
            </div>
            <div className="mb-5 flex flex-col gap-1">
              <label htmlFor="password" className="ml-1 font-bold">
                Adgangskode
              </label>
              <input
                className="rounded-xl border p-2 duration-300 hover:border-blue-300"
                minLength="8"
                type="password"
                name="password"
                id="password"
                autoComplete="new-password"
                required
                placeholder="Indtast mindst 8+ tegn"
              />
            </div>
            <div className="mb-5 flex flex-col gap-1">
              <label htmlFor="repeatPassword" className="ml-1 font-bold">
                Bekræft adgangskode
              </label>
              <input
                className="rounded-xl border p-2 duration-300 hover:border-blue-300"
                minLength="8"
                type="password"
                name="repeatPassword"
                id="repeatPassword"
                autoComplete="new-password"
                required
                placeholder="Indtast mindst 8+ tegn"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              name="checkbox"
              type="checkbox"
              id="terms"
              required
              className="size-4"
            />
            <label htmlFor="terms">
              Ved at tilmelde mig, accepterer jeg Vilkårene for brug og
              Privatlivspolitik
            </label>
          </div>
          <div className="mt-3 flex justify-center">
            <Button styles={`mb-3`} type="submit" value="Tilmeld dig" />
          </div>
          <div className="flex items-center justify-center gap-5">
            <p>Har du allerede en konto?</p>
            <Link href="/signin" className="text-blue-400">
              Log ind
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
