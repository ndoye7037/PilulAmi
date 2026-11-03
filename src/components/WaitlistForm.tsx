"use client";

import { FormEvent, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function WaitlistForm({
  id,
  compact = false,
}: {
  id?: string;
  compact?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(data.error ?? "Une erreur est survenue.");
        return;
      }

      setStatus("success");
      setMessage("Merci. Vous êtes sur la liste d’attente.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Impossible d’envoyer le formulaire. Réessayez.");
    }
  }

  return (
    <form
      id={id}
      onSubmit={onSubmit}
      className={
        compact
          ? "flex w-full flex-col gap-3"
          : "mx-auto flex w-full max-w-xl flex-col flex-wrap gap-3 sm:flex-row"
      }
    >
      <label className="sr-only" htmlFor={id ? `${id}-email` : "email"}>
        Adresse e-mail
      </label>
      <input
        id={id ? `${id}-email` : "email"}
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Votre e-mail"
        autoComplete="email"
        className="h-12 flex-1 rounded-full border border-line bg-cream px-5 text-base text-foreground outline-none ring-sage/30 placeholder:text-ink-muted/70 focus:ring-4"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="h-12 shrink-0 rounded-full bg-sage px-6 text-base font-bold text-white transition hover:bg-sage-dark disabled:opacity-70"
      >
        {status === "loading" ? "Envoi…" : "Essayer gratuitement"}
      </button>
      {message ? (
        <p
          className={`basis-full text-sm ${
            status === "success" ? "text-sage-dark" : "text-terracotta"
          }`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
