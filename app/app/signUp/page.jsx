"use client"

import Button from "@/components/Button";
import {style} from "@/app/style";
import {useRouter} from 'next/navigation';

export default function SignUpPage({onClick}) {
    const router = useRouter();

    const handlerSignIn = () => {
        router.push("/signIn");
    }

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
                            <input className="p-2 border rounded-xl hover:border-blue-300 duration-300" type="text"
                                   name="name" id="name" required placeholder="Indtast fornavn"/>
                        </div>
                        <div className="flex flex-col gap-1 flex-grow">
                            <label className="font-bold ml-1" htmlFor="surname">Efternavn</label>
                            <input className="p-2 border rounded-xl hover:border-blue-300 duration-300" type="text"
                                   name="surname" id="surname" required placeholder="Indtast efternavn"/>
                        </div>
                    </div>
                    <div className="">
                        <div className="flex flex-col gap-1 mb-5">
                            <label htmlFor="email" className="font-bold ml-1">E-mail</label>
                            <input className="p-2 border rounded-xl hover:border-blue-300 duration-300" type="email"
                                   name="email" id="email" required placeholder="eksempel.e-mail@gmail.com"/>
                        </div>
                        <div className="flex flex-col gap-1 mb-5">
                            <label htmlFor="password" className="font-bold ml-1">Adgangskode</label>
                            <input className="p-2 border rounded-xl hover:border-blue-300 duration-300" minLength="8" type="password"
                                   name="password" id="password" required placeholder="Indtast mindst 8+ tegn"/>
                        </div>
                        <div className="flex flex-col gap-1 mb-5">
                            <label htmlFor="repeatPassword" className="font-bold ml-1">Bekræft adgangskode</label>
                            <input className="p-2 border rounded-xl hover:border-blue-300 duration-300" minLength="8" type="password"
                                   name="repeatPassword" id="repeatPassword" required
                                   placeholder="Indtast mindst 8+ tegn"/>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="terms" required className="w-4 h-4"/>
                        <p>Ved at tilmelde mig, accepterer jeg Vilkårene for brug og
                            Privatlivspolitik</p>
                    </div>
                    <div className="flex justify-center mt-3">
                        <Button styles={`mb-3`} type="submit" value="Tilmeld dig"/>
                    </div>
                    <div className="flex items-center justify-center gap-5">
                        <p>Har du allerede en konto?</p>
                        <a className="text-blue-400" href="/signIp" onClick={handlerSignIn}>Log ind</a>
                    </div>
                </form>
            </div>
        </section>
    )
}