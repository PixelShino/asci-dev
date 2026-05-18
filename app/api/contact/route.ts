import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, phone, email, comment } = body;

    if (!name || !email || !comment) {
      return NextResponse.json(
        { error: "REQUIRED_FIELDS_MISSING" },
        { status: 400 },
      );
    }

    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const isSecure = smtpPort === 465;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: isSecure,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      family: 4,
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
      tls: {
        rejectUnauthorized: false,
      },
    } as SMTPTransport.Options);

    const ownerMailOptions = {
      from: `"Portfolio System" <${process.env.SMTP_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: `[SYS_ALERT] New Lead: ${name}`,
      html: `
        <div style="font-family: monospace; background: #0b0b0b; color: #e0e0e0; padding: 20px; border: 1px solid #b026ff;">
          <h2 style="color: #b026ff;">&gt; ВХОДЯЩИЙ ПАКЕТ ДАННЫХ</h2>
          <hr style="border-color: #b026ff; opacity: 0.3;" />
          <p><strong>Имя отправителя:</strong> ${name}</p>
          <p><strong>Телефон:</strong> ${phone || "NOT_PROVIDED"}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Сообщение:</strong></p>
          <div style="background: #141414; padding: 15px; border-left: 3px solid #b026ff; margin: 10px 0;">
            ${comment}
          </div>
        </div>
      `,
    };

    const userMailOptions = {
      from: `"Dmitry Goldobin" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "[УВЕДОМЛЕНИЕ] Сообщение успешно доставлено // DMITRII-GOLDOBIN",
      html: `
        <div style="font-family: monospace; background: #000000; color: #e0e0e0; padding: 20px; border: 1px solid #b026ff;">
          <p>&gt; Инициализация соединения...</p>
          <p>Здравствуйте, ${name}. Ваше сообщение успешно доставлено в систему.</p>
          <p>Дмитрий свяжется с вами в ближайшее время по указанному адресу: ${email}.</p>
          <br />
          <p style="color: #888888;">// Копия вашего комментария:</p>
          <p style="color: #888888; font-style: italic;">"${comment}"</p>
          <br />
          <p style="color: #b026ff;">STATUS: SUCCESS // CONNECTION_CLOSED</p>
        </div>
      `,
    };

    await Promise.all([
      transporter.sendMail(ownerMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("--- SMTP ERROR ---");
    console.error(error);
    console.error("------------------");

    return NextResponse.json(
      { error: "MAIL_DELIVERY_FAILED", details: error.message },
      { status: 500 },
    );
  }
}
