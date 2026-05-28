import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// Серверная схема валидации — повторяет клиентскую, но строже к границам.
const leadSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .min(6)
    .max(32)
    .regex(/^[+0-9\s()\-]+$/),
  company: z
    .string()
    .trim()
    .max(120)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  email: z.string().trim().email().max(160),
  message: z.string().trim().min(10).max(4000),
});

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  let parsed: z.infer<typeof leadSchema>;
  try {
    const body = await req.json();
    parsed = leadSchema.parse(body);
  } catch {
    return NextResponse.json(
      { error: "INVALID_PAYLOAD" },
      { status: 400 },
    );
  }

  const lead = await prisma.lead.create({
    data: {
      fullName: parsed.fullName,
      phone: parsed.phone,
      company: parsed.company ?? null,
      email: parsed.email,
      message: parsed.message,
    },
  });

  const safe = {
    fullName: escapeHtml(parsed.fullName),
    phone: escapeHtml(parsed.phone),
    company: parsed.company ? escapeHtml(parsed.company) : null,
    email: escapeHtml(parsed.email),
    message: escapeHtml(parsed.message),
  };

  try {
    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      family: 4,
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
      tls: { rejectUnauthorized: false },
    } as SMTPTransport.Options);

    const ownerMail = {
      from: `"Portfolio System" <${process.env.SMTP_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: `[SYS_ALERT] Новая заявка: ${safe.fullName}`,
      html: `
        <div style="font-family:monospace;background:#0b0b0b;color:#e0e0e0;padding:20px;border:1px solid #b026ff;">
          <h2 style="color:#b026ff;">&gt; ВХОДЯЩИЙ ПАКЕТ ДАННЫХ</h2>
          <p><strong>Lead ID:</strong> ${lead.id}</p>
          <p><strong>ФИО:</strong> ${safe.fullName}</p>
          <p><strong>Телефон:</strong> ${safe.phone}</p>
          <p><strong>Компания:</strong> ${safe.company ?? "—"}</p>
          <p><strong>Email:</strong> ${safe.email}</p>
          <p><strong>Сообщение:</strong></p>
          <div style="background:#141414;padding:15px;border:1px solid rgba(176,38,255,0.3);margin:10px 0;white-space:pre-wrap;">${safe.message}</div>
        </div>
      `,
    };

    const clientMail = {
      from: `"Dmitrii Goldobin" <${process.env.SMTP_USER}>`,
      to: parsed.email,
      subject: "Заявка принята // DMITRII-GOLDOBIN",
      html: `
        <div style="font-family:monospace;background:#000000;color:#e0e0e0;padding:20px;border:1px solid #b026ff;">
          <p>&gt; Соединение установлено.</p>
          <p>${safe.fullName}, ваша заявка получена. Я свяжусь с вами в течение 24 часов по адресу <strong>${safe.email}</strong>.</p>
          <p style="color:#888888;">// Копия вашего сообщения:</p>
          <p style="color:#888888;font-style:italic;white-space:pre-wrap;">${safe.message}</p>
          <p style="color:#b026ff;">STATUS: SUCCESS // CONNECTION_CLOSED</p>
        </div>
      `,
    };

    await Promise.all([
      transporter.sendMail(ownerMail),
      transporter.sendMail(clientMail),
    ]);
  } catch (mailError) {
    // Лид уже в БД, письмо не пришло — это операционная проблема, не
    // ошибка клиента. Возвращаем success, но логируем для следящего.
    console.error("[contact] SMTP delivery failed for lead", lead.id, mailError);
  }

  return NextResponse.json({ success: true, id: lead.id }, { status: 200 });
}
