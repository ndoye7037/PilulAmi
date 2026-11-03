import { Faq } from "@/components/Faq";
import { PhoneMockup } from "@/components/PhoneMockup";
import { WaitlistForm } from "@/components/WaitlistForm";

const problems = [
  "Votre parent oublie parfois un médicament, ou en prend deux fois.",
  "Vous ne pouvez pas être là tous les jours.",
  "Les ordonnances sont sur papier et personne n’a une vue d’ensemble.",
];

const steps = [
  {
    number: "1",
    title: "Photographiez l’ordonnance.",
    text: "Une photo suffit. L’application prépare le planning de prises, à vérifier ensuite par vous.",
  },
  {
    number: "2",
    title: "Votre proche reçoit un rappel à chaque prise.",
    text: "Une notification claire, et un seul bouton : « J’ai pris mon médicament ».",
  },
  {
    number: "3",
    title: "Vous voyez en direct si tout va bien.",
    text: "Une alerte en cas d’oubli, et le suivi de la journée en un coup d’œil.",
  },
];

const benefits = [
  {
    title: "Un rappel simple pour votre parent",
    text: "Une notification claire, et un seul bouton « J’ai pris mon médicament ». Pas de menus, pas de jargon.",
    icon: "🔔",
  },
  {
    title: "Vous êtes prévenu",
    text: "Une alerte si une prise est oubliée, et un suivi de la journée en un coup d’œil. Tranquille, sans l’appeler dix fois.",
    icon: "💛",
  },
  {
    title: "Scannez l’ordonnance",
    text: "Une photo suffit, l’application remplit le planning de prises. Vous relisez et validez ensuite.",
    icon: "📷",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b border-line/70 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <a href="#top" className="flex items-center gap-2 font-serif text-xl">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage text-sm text-white">
              P
            </span>
            PilulAmi
          </a>
          <a
            href="#liste-attente"
            className="rounded-full bg-sage px-4 py-2 text-sm font-bold text-white hover:bg-sage-dark"
          >
            Essayer gratuitement
          </a>
        </div>
      </header>

      <main id="top">
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-sage">
              Pour les familles éloignées
            </p>
            <h1 className="font-serif text-4xl leading-tight text-foreground sm:text-5xl">
              Sachez que maman a bien pris ses médicaments.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-muted">
              PilulAmi rappelle les prises à votre proche et vous prévient en cas
              d’oubli. Simple pour lui, rassurant pour vous.
            </p>
            <div className="relative mt-8">
              <WaitlistForm id="hero-waitlist" />
            </div>
            <p className="mt-16 text-sm text-ink-muted sm:mt-12">
              Essai gratuit · environ 7 € / mois ensuite · sans engagement
            </p>
          </div>
          <PhoneMockup />
        </section>

        <section className="bg-sage-dark text-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 md:grid-cols-3">
            {problems.map((problem) => (
              <p key={problem} className="font-serif text-2xl leading-snug">
                {problem}
              </p>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-sage">
            Comment ça marche
          </p>
          <h2 className="mt-3 font-serif text-4xl">Trois gestes, et vous respirez.</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-3xl border border-line bg-cream p-7"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage-soft font-bold text-sage">
                  {step.number}
                </span>
                <h3 className="mt-5 font-serif text-2xl">{step.title}</h3>
                <p className="mt-3 leading-7 text-ink-muted">{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-cream">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sage">
              Bénéfices
            </p>
            <h2 className="mt-3 max-w-2xl font-serif text-4xl">
              Rassuré sans fliquer. Simple, même si maman n’aime pas les applis.
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {benefits.map((benefit) => (
                <article
                  key={benefit.title}
                  className="rounded-3xl bg-background p-7"
                >
                  <span className="text-3xl" aria-hidden>
                    {benefit.icon}
                  </span>
                  <h3 className="mt-4 font-serif text-2xl">{benefit.title}</h3>
                  <p className="mt-3 leading-7 text-ink-muted">{benefit.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-20 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sage">
              Rassurance
            </p>
            <h2 className="mt-3 font-serif text-4xl">
              Données de santé protégées. Vous gardez le contrôle.
            </h2>
            <p className="mt-5 max-w-xl leading-8 text-ink-muted">
              Hébergement conforme aux exigences françaises pour les données de
              santé. Votre proche décide de ce qu’il partage. PilulAmi n’est pas
              un avis médical : c’est un fil de suivi, pour que Sophie, à 200 km,
              n’ait plus à composer le numéro « au cas où ».
            </p>
          </div>
          <ul className="space-y-4 rounded-3xl border border-line bg-cream p-8">
            <li className="font-medium">Hébergement pensé pour les données de santé</li>
            <li className="font-medium">Le proche garde la main sur le partage</li>
            <li className="font-medium">Vous configurez, il n’a qu’un bouton</li>
            <li className="font-medium">Aucun diagnostic, aucun conseil médical</li>
          </ul>
        </section>

        <section className="bg-sage text-white">
          <div className="mx-auto max-w-xl px-5 py-20 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sage-soft">
              Prix
            </p>
            <h2 className="mt-3 font-serif text-4xl">Une seule offre, un essai gratuit.</h2>
            <p className="mt-8 font-serif text-6xl">7 €</p>
            <p className="mt-1 text-lg text-sage-soft">par mois, après l’essai</p>
            <p className="mt-6 leading-7 text-sage-soft">
              Sans engagement. Payé par l’enfant ou l’aidant. Utilisé par le
              parent, avec une interface volontairement simple.
            </p>
            <a
              href="#liste-attente"
              className="mt-8 inline-flex h-12 items-center rounded-full bg-cream px-6 font-bold text-sage-dark hover:bg-white"
            >
              Essayer gratuitement
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-20">
          <p className="text-center text-sm font-bold uppercase tracking-[0.18em] text-sage">
            FAQ
          </p>
          <h2 className="mt-3 text-center font-serif text-4xl">Questions fréquentes</h2>
          <div className="mt-10">
            <Faq />
          </div>
        </section>

        <section id="liste-attente" className="bg-sage-dark text-white">
          <div className="mx-auto max-w-2xl px-5 py-20 text-center">
            <h2 className="font-serif text-4xl">
              Rejoignez la liste d’attente.
            </h2>
            <p className="mt-4 leading-8 text-sage-soft">
              Laissez votre e-mail pour tester PilulAmi en priorité. Même geste
              que dans le haut de page : essayer gratuitement, mesurer si cela
              vous rassure vraiment.
            </p>
            <div className="relative mt-8 rounded-3xl bg-background p-5 text-left text-foreground">
              <WaitlistForm id="final-waitlist" compact />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line px-5 py-8 text-center text-sm text-ink-muted">
        © PilulAmi · Aide au suivi de traitement, pas un substitut médical
      </footer>
    </div>
  );
}
