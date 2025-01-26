import '../globals.css';

const AboutPage = () => {
  return (
    <section className="mx-auto max-w-4xl space-y-12 px-6 py-12">
      <h1 className="mb-8 text-center text-4xl font-bold text-blue-600">
        Om Os
      </h1>
      <div className="space-y-10">
        <p className="text-lg text-gray-700">
          Hos{' '}
          <span className="font-bold text-blue-500">
            Dansk Statsborgerskabsforberedelse
          </span>
          , er vi dedikeret til at hjælpe individer med at opnå deres mål om at
          blive danske statsborgere. Vi forstår, at statsborgerskabsprøven kan
          være en udfordrende milepæl, så vi har skabt en brugervenlig og
          engagerende platform designet til at gøre forberedelsesprocessen
          enklere, mere effektiv og sjovere.
        </p>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-blue-500">
            Vores Mission
          </h2>
          <p className="text-lg text-gray-700">
            Vores mission er at give fremtidige danske statsborgere den viden og
            selvtillid, de har brug for at klare sig godt i
            statsborgerskabsprøven. Vi sigter mod at gøre læring om Danmarks
            historie, kultur og samfund tilgængelig for alle, uanset deres
            baggrund eller sprogfærdigheder.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-blue-500">
            Hvad Vi Tilbyder
          </h2>
          <ul className="list-disc space-y-4 pl-6 text-lg text-gray-700">
            <li>
              <span className="font-bold text-blue-500">
                Omfattende Øvningsspørgsmål:
              </span>{' '}
              Vores database indeholder spørgsmål, der er modelleret efter den
              officielle danske statsborgerskabsprøve, og dækker vigtige emner
              som dansk historie, demokrati, kultur og traditioner.
            </li>
            <li>
              <span className="font-bold text-blue-500">
                Interaktive Læringsværktøjer:
              </span>{' '}
              Med funktioner som sprogoversættelse, tekst-til-tale og
              fremskridtsovervågning gør vi studier lettere og mere
              tilgængelige.
            </li>
            <li>
              <span className="font-bold text-blue-500">Flere Sprog:</span>{' '}
              Vores app understøtter oversættelser på flere sprog, så det er
              muligt for alle at forberede sig effektivt, selvom dansk ikke er
              deres første sprog.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-blue-500">
            Hvorfor Vælge Os?
          </h2>
          <ul className="list-disc space-y-4 pl-6 text-lg text-gray-700">
            <li>
              <span className="font-bold text-blue-500">
                Tilpasset Dine Behov:
              </span>{' '}
              Vores app tilpasser sig dine præferencer med funktioner som
              oplæsning, sprogvalg og personlige studieplaner.
            </li>
            <li>
              <span className="font-bold text-blue-500">
                Bekvemmelighed Lige Ved Hånden:
              </span>{' '}
              Lær når som helst, hvor som helst, på din telefon, tablet eller
              computer.
            </li>
            <li>
              <span className="font-bold text-blue-500">
                Inkluderende og Støttende:
              </span>{' '}
              Vi mener, at alle fortjener en fair chance for at få succes, så vi
              er engagerede i at levere ressourcer, der imødekommer forskellige
              læringsstile.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold text-blue-500">
            Din Vej Til Succes
          </h2>
          <p className="text-lg text-gray-700">
            At blive dansk statsborger er et stolt øjeblik, og vi er her for at
            vejlede dig hvert skridt på vejen. Med den rette forberedelse vil du
            føle dig selvsikker og klar til at bestå din statsborgerskabsprøve
            og tage det næste skridt mod din fremtid i Danmark.
          </p>
        </section>

        <section>
          <p className="mb-2 text-xl font-semibold text-blue-600">
            Kom I Gang I Dag!
          </p>
          <p className="text-lg text-gray-700">
            Deltag i tusindvis af andre, der har forberedt sig til den danske
            statsborgerskabsprøve med vores app. Lad os få dig et skridt tættere
            på at opnå din drøm!
          </p>
        </section>
      </div>
    </section>
  );
};

export default AboutPage;
