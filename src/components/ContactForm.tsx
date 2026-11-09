"use client";

import type { FormEvent } from "react";

const contactEmail = "ahmet.tulum99@gmail.com";

export function ContactForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const topic = String(formData.get("topic") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const subject = `[PratikHesap] ${topic}`;
    const body = `Ad Soyad: ${name}\nE-posta: ${email}\nKonu: ${topic}\n\n${message}`;

    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div>
        <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold text-navy">Adınız</label>
        <input id="contact-name" name="name" autoComplete="name" required maxLength={100} className="form-input" />
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold text-navy">E-posta adresiniz</label>
        <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} className="form-input" />
      </div>
      <div>
        <label htmlFor="contact-topic" className="mb-2 block text-sm font-semibold text-navy">Konu</label>
        <select id="contact-topic" name="topic" required defaultValue="Hata bildirimi" className="form-input">
          <option>Hata bildirimi</option>
          <option>Gizlilik talebi</option>
          <option>Araç önerisi</option>
          <option>Diğer</option>
        </select>
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold text-navy">Mesajınız</label>
        <textarea id="contact-message" name="message" required minLength={10} maxLength={5000} rows={6} className="form-input" />
      </div>
      <p className="text-sm leading-6 text-slate-600">Gönder düğmesi, e-posta uygulamanızda alıcı ve mesajı hazırlar. Form bilgileri PratikHesap sunucusuna gönderilmez; e-postayı açılan uygulamadan sizin göndermeniz gerekir.</p>
      <button type="submit" className="rounded-xl bg-blue px-5 py-3 font-semibold text-white hover:bg-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue">
        E-posta uygulamasında aç
      </button>
    </form>
  );
}
