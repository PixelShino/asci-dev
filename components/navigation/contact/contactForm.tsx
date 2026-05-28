"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

type Status = "IDLE" | "LOADING" | "SUCCESS" | "ERROR";

const STYLES = {
  cardLeft:
    "lg:col-span-2 space-y-6 border border-purple-400/20 bg-zinc-100/50 dark:bg-zinc-900/30 p-5 backdrop-blur-sm transition-colors duration-300",
  contactGroup:
    "border-l border-purple-400/30 pl-3 py-1 hover:border-purple-500 dark:hover:border-purple-400 transition-colors group",
  contactLabel: "block text-xs text-zinc-400 dark:text-zinc-500 select-none",
  contactLink:
    "text-zinc-800 dark:text-zinc-200 hover:text-purple-500 dark:hover:text-purple-400 transition-all block mt-1 font-bold",
  inputLabel:
    "block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1 select-none",
  inputField:
    "w-full bg-white dark:bg-zinc-950/60 border border-purple-400/30 p-2 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 text-sm transition-all rounded-sm",
  inputFieldError:
    "border-red-500/70 dark:border-red-500/70 focus:border-red-500 dark:focus:border-red-500",
  errorText:
    "text-[11px] text-red-600 dark:text-red-400 mt-1 font-mono select-none",
  btnSubmit:
    "border border-purple-500 dark:border-purple-400 text-purple-600 dark:text-purple-400 px-5 py-2 hover:bg-purple-500/5 dark:hover:bg-purple-400/10 disabled:opacity-40 transition-all text-sm font-semibold tracking-wider uppercase",
  btnMail:
    "border border-green-600 dark:border-green-500 text-green-600 dark:text-green-400 px-4 py-2 text-xs hover:bg-green-500/10 transition-all font-semibold tracking-wider uppercase",
};

const PHONE_RE = /^[+0-9\s()\-]{6,32}$/;

type FieldErrors = Partial<
  Record<"fullName" | "phone" | "company" | "email" | "message", string>
>;

export function ContactForm() {
  const t = useTranslations("Contact");
  const [status, setStatus] = useState<Status>("IDLE");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [networkError, setNetworkError] = useState("");

  // Локализуем сообщения через i18n, чтобы zod-ошибки не висели на русском
  // в английской локали.
  const schema = z.object({
    fullName: z.string().trim().min(2, t("err_fullName")),
    phone: z
      .string()
      .trim()
      .min(1, t("err_phone"))
      .regex(PHONE_RE, t("err_phone_format")),
    company: z.string().trim().max(120).optional(),
    email: z
      .string()
      .trim()
      .min(1, t("err_email"))
      .email(t("err_email_format")),
    message: z.string().trim().min(10, t("err_message")),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("LOADING");
    setErrors({});
    setNetworkError("");

    const formData = new FormData(e.currentTarget);
    const raw = Object.fromEntries(formData.entries());

    const result = schema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !(key in fieldErrors)) {
          fieldErrors[key as keyof FieldErrors] = issue.message;
        }
      }
      setErrors(fieldErrors);
      setStatus("IDLE");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) throw new Error("PACKET_LOSS");
      setStatus("SUCCESS");
    } catch {
      setStatus("ERROR");
      setNetworkError(t("err_network"));
    }
  };

  const fieldClass = (key: keyof FieldErrors) =>
    `${STYLES.inputField} ${errors[key] ? STYLES.inputFieldError : ""}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 font-mono text-sm md:text-base items-start transition-colors duration-300">
      <div className={STYLES.cardLeft}>
        <div>
          <h3 className="text-purple-600 dark:text-purple-400 text-sm font-bold tracking-wider uppercase mb-1">
            {">"} FETCH DIRECT_CHANNELS
          </h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            // Стабильное соединение доступно 24/7
          </p>
        </div>

        <div className="space-y-4">
          <div className={STYLES.contactGroup}>
            <span className={STYLES.contactLabel}>// TELEGRAM_COMM_LINK</span>
            <Link
              href="https://t.me/pixelshino"
              target="_blank"
              rel="noopener noreferrer"
              className={STYLES.contactLink}>
              [ @pixelshino ]
            </Link>
          </div>

          <div className={STYLES.contactGroup}>
            <span className={STYLES.contactLabel}>// EMAIL_E_MAIL</span>
            <Link
              href="mailto:goldobin.dmitry@bk.ru"
              className={STYLES.contactLink}>
              goldobin.dmitry@bk.ru
            </Link>
          </div>

          <div className={STYLES.contactGroup}>
            <span className={STYLES.contactLabel}>// VOICE_CELL_LINE</span>
            <Link
              href="tel:+79192318930"
              className={`${STYLES.contactLink} tracking-wider`}>
              +7 (919) 231-89-30
            </Link>
          </div>
        </div>

        <div className="pt-2 border-t border-purple-400/10 text-xs text-zinc-400 dark:text-zinc-500 flex items-center justify-between">
          <span>SECURE_SSL_ACTIVE</span>
          <span className="text-green-500 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            ONLINE
          </span>
        </div>
      </div>

      <div className="lg:col-span-3 space-y-4 w-full">
        {status === "SUCCESS" ? (
          <div className="border border-green-500/40 bg-green-500/5 p-6 text-green-600 dark:text-green-400 space-y-4 rounded-sm animate-fadeIn">
            <div className="space-y-2">
              <p className="font-bold">
                {">"} {t("success_status")}
              </p>
              <p className="text-zinc-800 dark:text-zinc-200 text-sm md:text-base">
                {t("success_msg")}
              </p>
              <p className="text-xs text-green-600/70 dark:text-green-400/60 font-semibold">
                {t("success_sub")}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <Link
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className={STYLES.btnMail}>
                [ OPEN GMAIL ]
              </Link>
              <Link
                href="https://e.mail.ru"
                target="_blank"
                rel="noopener noreferrer"
                className={STYLES.btnMail}>
                [ OPEN MAIL.RU ]
              </Link>

              <Button
                type="button"
                variant="link"
                onClick={() => setStatus("IDLE")}
                className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-purple-500 dark:hover:text-purple-400 transition-all underline underline-offset-4 ml-auto h-auto p-0">
                {t("send_again")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-purple-600 dark:text-purple-400 text-lg md:text-xl font-bold tracking-wider">
              {">"} {t("title")} <span className="cursor-blink">█</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 w-full" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className={STYLES.inputLabel}>
                    // {t("fullName")}
                  </Label>
                  <Input
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    className={fieldClass("fullName")}
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? "err-fullName" : undefined}
                  />
                  {errors.fullName && (
                    <p id="err-fullName" className={STYLES.errorText}>
                      // {errors.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <Label className={STYLES.inputLabel}>// {t("phone")}</Label>
                  <Input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    className={fieldClass("phone")}
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? "err-phone" : undefined}
                  />
                  {errors.phone && (
                    <p id="err-phone" className={STYLES.errorText}>
                      // {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className={STYLES.inputLabel}>// {t("company")}</Label>
                  <Input
                    name="company"
                    type="text"
                    autoComplete="organization"
                    className={fieldClass("company")}
                  />
                </div>
                <div>
                  <Label className={STYLES.inputLabel}>// {t("email")}</Label>
                  <Input
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={fieldClass("email")}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "err-email" : undefined}
                  />
                  {errors.email && (
                    <p id="err-email" className={STYLES.errorText}>
                      // {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label className={STYLES.inputLabel}>// {t("comment")}</Label>
                <Textarea
                  name="message"
                  rows={5}
                  className={`${fieldClass("message")} resize-none`}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? "err-message" : undefined}
                />
                {errors.message && (
                  <p id="err-message" className={STYLES.errorText}>
                    // {errors.message}
                  </p>
                )}
              </div>

              {status === "ERROR" && networkError && (
                <div className="text-red-600 dark:text-red-400 text-xs border border-red-500/30 p-3 bg-red-500/5 font-semibold">
                  [{t("sys_error")}]: {networkError}
                </div>
              )}

              <Button
                disabled={status === "LOADING"}
                type="submit"
                variant="ghost"
                className={STYLES.btnSubmit}>
                {status === "LOADING" ? t("sending") : t("send")}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
