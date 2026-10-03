import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      email,
      name,
      code,
      date,
      time,
      guests,
      category,
      item,
      note,
    } = body;

    if (!email || !name || !code || !date || !time) {
      return NextResponse.json(
        { error: "Missing booking information." },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Nababi Ristorante <onboarding@resend.dev>",
      to: [email],
      subject: "Booking Confirmed - Nababi Ristorante",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Booking Confirmed 🎉</h2>

          <p>Dear ${name},</p>

          <p>
            Your table booking at <strong>Nababi Ristorante</strong>
            has been confirmed.
          </p>

          <hr />

          <p><strong>Booking Code:</strong> ${code}</p>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Time:</strong> ${time}</p>
          <p><strong>Guests:</strong> ${guests}</p>
          <p><strong>Category:</strong> ${category || "Not specified"}</p>
          <p><strong>Item:</strong> ${item || "Not specified"}</p>
          <p><strong>Note:</strong> ${note || "None"}</p>

          <hr />

          <p>
            Please keep your booking code safe. You may need it
            to manage your booking later.
          </p>

          <p>Thank you for choosing Nababi Ristorante.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);

      return NextResponse.json(
        { error: "Email could not be sent." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      id: data?.id,
    });
  } catch (error) {
    console.error("Booking email error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
