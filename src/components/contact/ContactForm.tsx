"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/constants";

export function ContactForm() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = `Hello RGW Sweets! My name is ${name || "a customer"}.\n\n${message}`;
    window.open(whatsappLink(text), "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={send} className="card-lux flex flex-col gap-4 p-6">
      <h2 className="font-serif text-xl font-bold text-[var(--color-maroon)]">Send us a message</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="inp"
        required
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="How can we help? (orders, bulk/festive boxes, questions…)"
        rows={4}
        className="inp resize-none"
        required
      />
      <button type="submit" className="btn-gold w-fit">
        <MessageCircle size={18} /> Send via WhatsApp
      </button>
      <p className="text-xs text-[var(--color-ink-faint)]">
        This opens WhatsApp with your message ready to send. We usually reply quickly.
      </p>
    </form>
  );
}
