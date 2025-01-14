import Button from "@/components/Button";
import {style, layout} from "@/app/style";
import Explore from "../../components/Explore.jsx";
import {faCircleDollarToSlot} from "@fortawesome/free-solid-svg-icons";
import {faVolumeUp} from "@fortawesome/free-solid-svg-icons";
import {faLanguage} from "@fortawesome/free-solid-svg-icons";
import {faComments} from "@fortawesome/free-regular-svg-icons";

function WelcomePage() {

    const exploreFeatures = [
        {
            id: 1,
            icon: faVolumeUp,
            title: "Text to Speech"
        },
        {
            id: 2,
            icon: faLanguage,
            title: "Translation"
        },
        {
            id: 3,
            icon: faCircleDollarToSlot,
            title: "Free of Charge"
        },
        {
            id: 4,
            icon: faComments,
            title: "Chat Blog"
        }
    ];

    return (
        <section>
            <div className={`${layout.section} gap-10`}>
                <div className={`${style.flexCenter} max-w-[600px]`}>
                    <h1 className={`${style.heading}`}>Velkommen <br/> til DKTestPrep</h1>
                    <p className={`${style.paragraph} my-6`}>Bliv klar til den danske indfødsretsprøve med selvtillid!
                        Forbereder du dig på den danske indfødsretsprøve? DKTestPrep er her for at hjælpe dig med at få
                        succes. Med vores interaktive øvequizzer og engagerende fællesskabsblog vil du få den viden og
                        selvtillid, der er nødvendig for at bestå prøven.</p>
                    <Button value="Log ind" styles={`mt-5`}/>
                </div>
                <div className={`${style.flexCenter} rounded-2xl`}>
                    <img src="/imageWelcome.jpg" alt="image" className='rounded-2xl'/>
                </div>
            </div>
            <div className={`flex flex-row gap-28 justify-center ${style.marginY}`}>
                {exploreFeatures.map(feature => (
                    <Explore key={feature.id} {...feature} />
                ))}
            </div>
        </section>
    );
}

export default WelcomePage;
