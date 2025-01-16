"use client"

import Button from "@/components/Button";
import {style} from "@/app/style";
import Link from 'next/link';

export default function SignUpPage() {

    const handleSubmit = (event) => {
        event.preventDefault();

        console.log("Form submitted");
    }

    return (
        <section>
            <div className="max-w-3xl mx-auto rounded-2xl bg-white shadow-xl p-7">
                <h1 className={`${style.heading} text-center`}>Tilmeld dig</h1>
                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    <div className="flex flex-row w-full gap-5 mt-5">
                        <div className="flex flex-col gap-1 flex-grow">
                            <label className="font-bold ml-1" htmlFor="name">Fornavn</label>
                            <input className="p-2 border rounded-xl hover:border-blue-300 duration-300" autoComplete="name" type="text"
                                   name="name" id="name" required placeholder="Indtast fornavn"/>
                        </div>
                        <div className="flex flex-col gap-1 flex-grow">
                            <label className="font-bold ml-1" htmlFor="surname">Efternavn</label>
                            <input className="p-2 border rounded-xl hover:border-blue-300 duration-300" autoComplete="name" type="text"
                                   name="surname" id="surname" required placeholder="Indtast efternavn"/>
                        </div>
                    </div>
                    <div className="">
                        <div className="flex flex-col gap-1 mb-5">
                            <label htmlFor="email" className="font-bold ml-1">E-mail</label>
                            <input className="p-2 border rounded-xl hover:border-blue-300 duration-300" type="email"
                                   name="email" id="email" autoComplete="email"  required placeholder="eksempel.e-mail@gmail.com"/>
                        </div>
                        <div className="flex flex-col gap-1 mb-5">
                            <label htmlFor="password" className="font-bold ml-1">Adgangskode</label>
                            <input className="p-2 border rounded-xl hover:border-blue-300 duration-300" minLength="8" type="password"
                                   name="password" id="password" autoComplete="new-password" required placeholder="Indtast mindst 8+ tegn"/>
                        </div>
                        <div className="flex flex-col gap-1 mb-5">
                            <label htmlFor="repeatPassword" className="font-bold ml-1">Bekræft adgangskode</label>
                            <input className="p-2 border rounded-xl hover:border-blue-300 duration-300" minLength="8" type="password"
                                   name="repeatPassword" id="repeatPassword" autoComplete="new-password" required
                                   placeholder="Indtast mindst 8+ tegn"/>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input name="checkbox" type="checkbox" id="terms" required className="w-4 h-4"/>
                        <label htmlFor="terms">Ved at tilmelde mig, accepterer jeg Vilkårene for brug og
                            Privatlivspolitik</label>
                    </div>
                    <div className="flex justify-center mt-3">
                        <Button styles={`mb-3`} type="submit" value="Tilmeld dig"/>
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
    )
}