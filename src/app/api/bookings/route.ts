import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createBooking, getBookings } from '@/lib/supabase';
import { BookingRequest } from '@/types/database';

const NOTIFICATION_EMAIL = 'purpolensmediahouse@gmail.com';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      client_name,
      client_email,
      client_phone,
      service,
      event_date,
      location,
      message,
    } = body;
    const estimated_budget = body.estimated_budget || body.budget || '';

    // Validate required fields
    if (!client_name || !client_email || !client_phone || !service || !message) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required fields: name, email, phone, service, and project message.' },
        { status: 400 }
      );
    }

    // 1. Save booking to database (Supabase + fallback)
    const result = await createBooking({
      client_name,
      client_email,
      client_phone,
      service,
      event_date: event_date || undefined,
      location: location || '',
      estimated_budget: estimated_budget || '',
      message,
      status: 'pending',
    });

    const booking = result.data;

    // 2. Prepare automated email notification to purpolensmediahouse@gmail.com
    const emailSubject = `🎥 New PURPOLENS Booking Request: ${client_name} - ${service}`;
    
    const formattedDate = event_date
      ? new Date(event_date).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'Not specified (Flexible)';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0b0e; color: #f4f4f5; margin: 0; padding: 24px; }
          .container { max-width: 620px; margin: 0 auto; background: #131318; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
          .header { background: linear-gradient(135deg, #240046 0%, #3c096c 50%, #5a189a 100%); padding: 32px 28px; text-align: center; }
          .brand { font-size: 26px; font-weight: 900; letter-spacing: 0.15em; color: #ffffff; margin: 0; text-transform: uppercase; }
          .tagline { font-size: 11px; letter-spacing: 0.25em; color: #e0aaff; margin-top: 6px; text-transform: uppercase; }
          .content { padding: 28px; }
          .badge { display: inline-block; padding: 6px 14px; border-radius: 9999px; background: rgba(94, 96, 206, 0.2); border: 1px solid rgba(94, 96, 206, 0.4); color: #c77dff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; }
          .title { font-size: 20px; font-weight: 800; color: #ffffff; margin: 0 0 20px; }
          .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px; margin-bottom: 16px; }
          .field { margin-bottom: 12px; }
          .field:last-child { margin-bottom: 0; }
          .label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #a1a1aa; font-weight: 600; margin-bottom: 3px; }
          .value { font-size: 14px; color: #f4f4f5; font-weight: 500; }
          .message-box { background: rgba(0,0,0,0.4); border-left: 3px solid #7b2cbf; padding: 14px; border-radius: 6px; font-size: 14px; line-height: 1.6; color: #e4e4e7; white-space: pre-line; }
          .actions { text-align: center; padding: 24px 0 10px; }
          .btn { display: inline-block; padding: 12px 24px; border-radius: 9999px; background: linear-gradient(135deg, #7b2cbf, #5e60ce); color: #ffffff !important; text-decoration: none; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 6px; }
          .btn-secondary { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); }
          .footer { padding: 20px 28px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: #71717a; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="brand">PURPOLENS</h1>
            <div class="tagline">Videography • Photography • Editing</div>
          </div>
          <div class="content">
            <div class="badge">🔔 New Booking Request</div>
            <h2 class="title">Production Session Requested</h2>

            <div class="card">
              <div class="field">
                <div class="label">Client Name</div>
                <div class="value"><strong>${client_name}</strong></div>
              </div>
              <div class="field">
                <div class="label">Email Address</div>
                <div class="value"><a href="mailto:${client_email}" style="color: #9d4edd; text-decoration: none;">${client_email}</a></div>
              </div>
              <div class="field">
                <div class="label">Phone / WhatsApp</div>
                <div class="value"><a href="tel:${client_phone}" style="color: #25D366; text-decoration: none;">${client_phone}</a></div>
              </div>
            </div>

            <div class="card">
              <div class="field">
                <div class="label">Service Required</div>
                <div class="value" style="color: #c77dff; font-weight: 700;">${service}</div>
              </div>
              <div class="field">
                <div class="label">Target Event / Shoot Date</div>
                <div class="value">📅 ${formattedDate}</div>
              </div>
              ${location ? `
                <div class="field">
                  <div class="label">Location / Venue</div>
                  <div class="value">📍 ${location}</div>
                </div>
              ` : ''}
              ${estimated_budget ? `
                <div class="field">
                  <div class="label">Estimated Budget</div>
                  <div class="value">💰 ${estimated_budget}</div>
                </div>
              ` : ''}
            </div>

            <div class="card">
              <div class="label" style="margin-bottom: 8px;">Project Brief / Message</div>
              <div class="message-box">${message}</div>
            </div>

            <div class="actions">
              <a href="mailto:${client_email}?subject=RE:%20Your%20PURPOLENS%20Booking%20Request%20(${encodeURIComponent(service)})" class="btn">
                Reply via Email
              </a>
              <a href="https://wa.me/${client_phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(client_name)}!%20Thank%20you%20for%20contacting%20PURPOLENS%20regarding%20your%20${encodeURIComponent(service)}%20project." class="btn btn-secondary">
                Chat on WhatsApp
              </a>
            </div>
          </div>
          <div class="footer">
            PURPOLENS Creative Agency • 27, Ijaoye Street, Jibowu, Yaba, Lagos<br>
            Booking Ref: ${booking.id} • Received: ${new Date().toUTCString()}
          </div>
        </div>
      </body>
      </html>
    `;

    // 3. Attempt email dispatch via SMTP (Gmail or custom SMTP)
    let emailSent = false;
    let emailNotice = '';

    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || '';
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD || '';
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT) || 465;

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: `"PURPOLENS Booking System" <${smtpUser}>`,
          to: NOTIFICATION_EMAIL,
          replyTo: client_email,
          subject: emailSubject,
          html: htmlContent,
        });

        emailSent = true;
        emailNotice = `Notification successfully dispatched to ${NOTIFICATION_EMAIL}`;
      } catch (err: any) {
        console.error('SMTP Email dispatch failed:', err?.message || err);
        emailNotice = `Email notification queued for ${NOTIFICATION_EMAIL}`;
      }
    } else {
      console.log(`[PURPOLENS BOOKING NOTIFICATION] Email prepared for ${NOTIFICATION_EMAIL}:`, {
        client_name,
        client_email,
        client_phone,
        service,
        event_date,
        message,
      });
      emailNotice = `Booking recorded. Notification ready for ${NOTIFICATION_EMAIL}`;
    }

    return NextResponse.json({
      success: true,
      booking,
      emailSent,
      emailNotice,
      message: result.message,
    });
  } catch (error: any) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Internal server error while processing booking' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const bookings = await getBookings();
    return NextResponse.json({ success: true, bookings });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

