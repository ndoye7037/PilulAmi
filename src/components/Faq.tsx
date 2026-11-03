"use client";

import { useState } from "react";

const items = [
  {
    question: "Mon parent n’est pas à l’aise avec les smartphones, ça marche ?",
    answer:
      "Oui. L’interface est faite pour être très simple : un rappel clair, et un seul bouton « J’ai pris mon médicament ». C’est vous qui configurez tout.",
  },
  {
    question: "Mes données sont-elles protégées ?",
    answer:
      "Oui. L’hébergement est conforme aux exigences françaises pour les données de santé, et votre proche garde le contrôle de ce qu’il partage.",
  },
  {
    question: "L’application remplace-t-elle un médecin ?",
    answer:
      "Non. Elle aide à suivre le traitement, elle ne donne pas d’avis médical.",
  },
  {
    question: "Combien ça coûte ?",
    answer:
      "Un essai gratuit, puis un abonnement mensuel sans engagement, autour de 7 € par mois.",
  },
  {
    question: "Qui utilise PilulAmi, et qui paie ?",
    answer:
      "Votre parent utilise l’application au quotidien. L’abonnement est pris en charge par l’enfant ou l’aidant.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-line rounded-3xl border border-line bg-cream">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-serif text-lg text-foreground">{item.question}</span>
              <span className="text-sage" aria-hidden>
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen ? (
              <p className="px-6 pb-5 text-ink-muted leading-7">{item.answer}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
