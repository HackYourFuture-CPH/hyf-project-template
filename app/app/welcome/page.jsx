import Button from "@/components/Button";
import styles from '../../styles/global.css'
import { style, layout } from "@/styles/style";

function WelcomePage() {
    return (
        <section className={`${layout.section}`}>
            <div className={`${style.flexCenter}`}>
                <h1 className={`${style.heading}`}>Velkommen til DKTestPrep</h1>
                <p className={`${style.paragraph}`}>Bliv klar til den danske indfødsretsprøve med selvtillid!
                    Forbereder du dig på den danske indfødsretsprøve? DKTestPrep er her for at hjælpe dig med at få
                    succes. Med vores interaktive øvequizzer og engagerende fællesskabsblog vil du få den viden og
                    selvtillid, der er nødvendig for at bestå prøven.</p>
                <Button styles={`mt-10`}/>
            </div>
        </section>
    );
}

export default WelcomePage;
