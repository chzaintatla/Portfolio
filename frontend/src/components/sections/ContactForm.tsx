"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";

import { EASE } from "@/animations/variants";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";

interface Props {
  services: string[];
  budgets: string[];
  timelines: string[];
  referrals: string[];
}

type Errors = Partial<Record<string, string>>;

const field =
  "w-full rounded-2xl border border-line bg-night/80 px-4 py-3.5 text-ink placeholder:text-dim transition-colors focus:border-aqua/60 focus:outline-none aria-[invalid=true]:border-red-400/70";

function Field({ label, name, error, children, required }: { label: string; name: string; error?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm text-mute">
        {label} {required && <span className="text-aqua" aria-hidden="true">*</span>}
      </label>
      {children}
      {error && <p id={`${name}-err`} role="alert" className="mt-1.5 text-xs text-red-300">{error}</p>}
    </div>
  );
}

export function ContactForm({ services, budgets, timelines, referrals }: Props) {
  const sp = useSearchParams();
  const consult = sp.get("type") === "consultation";
  const presetService = sp.get("service") ?? "";
  const presetNote = [
    sp.get("model") && `Interested in the "${sp.get("model")!.replace(/-/g, " ")}" engagement model.`,
    sp.get("industry") && `Industry: ${sp.get("industry")}.`,
    consult && "I'd like to book a consultation.",
  ].filter(Boolean).join(" ");

  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");

  const validate = (d: Record<string, string>): Errors => {
    const e: Errors = {};
    if (!d.name || d.name.trim().length < 2) e.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email ?? "")) e.email = "Please enter a valid email address.";
    if (d.phone && !/^[0-9+()\-\s.]{6,40}$/.test(d.phone)) e.phone = "Please enter a valid phone number.";
    if (!d.message || d.message.trim().length < 10) e.message = "Tell us a little more (at least 10 characters).";
    return e;
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    setStatus("sending");
    setServerError("");
    const payload = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== "")) as Record<string, string>;
    payload.source = consult ? "consultation" : "website";
    payload.page = window.location.pathname + window.location.search;
    const utm = [...new URLSearchParams(window.location.search)].filter(([k]) => k.startsWith("utm_")).map(([k, v]) => `${k}=${v}`).join("&");
    if (utm) payload.utm = utm;
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      if (res.status === 429) throw new Error("Too many requests — please try again in a minute.");
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const detail = Array.isArray(body.detail) ? body.detail.map((d: { msg: string }) => d.msg).join(" ") : body.detail;
        throw new Error(detail || "Something went wrong. Please try again or email us directly.");
      }
      track("lead_submit", { service: payload.service ?? "unspecified", source: payload.source });
      setStatus("done");
      form.reset();
    } catch (err) {
      setServerError((err as Error).message);
      setStatus("error");
    }
  }

  return (
    <div className="hairline relative overflow-hidden rounded-[2rem] bg-card/70 p-6 md:p-10">
      <AnimatePresence mode="wait">
        {status === "done" ? (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, ease: EASE }} className="flex min-h-[420px] flex-col items-center justify-center text-center" role="status">
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }} className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet to-aqua shadow-[0_0_60px_rgba(34,211,238,.4)]">
              <Check className="h-9 w-9" strokeWidth={2.5} />
            </motion.span>
            <h2 className="mt-8 font-display text-3xl font-semibold">Request received.</h2>
            <p className="mt-3 max-w-sm text-mute">Thanks — we&apos;ve sent a confirmation to your inbox and will reply within one business day.</p>
            <button type="button" onClick={() => setStatus("idle")} className="mt-8 text-sm text-aqua underline-offset-4 hover:underline">Send another request</button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-5 md:grid-cols-2">
            <Field label="Name" name="name" error={errors.name} required>
              <input id="name" name="name" autoComplete="name" className={field} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} required />
            </Field>
            <Field label="Company" name="company">
              <input id="company" name="company" autoComplete="organization" className={field} />
            </Field>
            <Field label="Email" name="email" error={errors.email} required>
              <input id="email" name="email" type="email" autoComplete="email" className={field} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} required />
            </Field>
            <Field label="Phone" name="phone" error={errors.phone}>
              <input id="phone" name="phone" type="tel" autoComplete="tel" className={field} aria-invalid={!!errors.phone} />
            </Field>
            <Field label="Service" name="service">
              <select id="service" name="service" defaultValue={services.includes(presetService) ? presetService : ""} className={cn(field, "appearance-none")}>
                <option value="">Select a service</option>
                {services.map((s) => <option key={s}>{s}</option>)}
                <option>Something else</option>
              </select>
            </Field>
            <Field label="Budget" name="budget">
              <select id="budget" name="budget" defaultValue="" className={cn(field, "appearance-none")}>
                <option value="">Select a range</option>
                {budgets.map((b) => <option key={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="Timeline" name="timeline">
              <select id="timeline" name="timeline" defaultValue="" className={cn(field, "appearance-none")}>
                <option value="">Select a timeline</option>
                {timelines.map((b) => <option key={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="How did you hear about us?" name="referral">
              <select id="referral" name="referral" defaultValue="" className={cn(field, "appearance-none")}>
                <option value="">Select an option</option>
                {referrals.map((b) => <option key={b}>{b}</option>)}
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Tell us about your project" name="message" error={errors.message} required>
                <textarea id="message" name="message" rows={6} defaultValue={presetNote} className={cn(field, "resize-y")} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-err" : undefined} placeholder="What are you building, and what does success look like?" required />
              </Field>
            </div>
            {/* Honeypot — hidden from people and assistive tech */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            {serverError && <p role="alert" className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200 md:col-span-2">{serverError}</p>}
            <div className="flex flex-wrap items-center justify-between gap-4 md:col-span-2">
              <p className="text-xs text-dim">We reply within one business day. Your details are only used to respond to your request.</p>
              <Button type="submit" disabled={status === "sending"} arrow={status !== "sending"} magnetic={false}>
                {status === "sending" ? (
                  <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Sending…</span>
                ) : "Submit Project Request"}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
