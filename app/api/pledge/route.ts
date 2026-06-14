import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '@/lib/supabase'
import { MOSQUE_NAME, ADMIN_EMAIL } from '@/lib/constants'
import { PledgeFormData } from '@/lib/types'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const body: PledgeFormData = await req.json()
    const { full_name, nickname, phone, location, amount, payment_method, message } = body

    if (!full_name || !phone || !location || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Save to Supabase — approved: false by default
    const db = supabaseAdmin()
    const { data: pledge, error: dbError } = await db
      .from('pledges')
      .insert({
        full_name: full_name.trim(),
        nickname: nickname?.trim() || null,
        phone: phone.trim(),
        location: location.trim(),
        amount: Number(amount),
        payment_method,
        message: message?.trim() || null,
        status: 'pledged',
        approved: false,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Supabase error:', dbError)
      return NextResponse.json({ error: 'Failed to save pledge' }, { status: 500 })
    }

    // Send notification email to admin
    const displayName = nickname?.trim() ? `${full_name} (${nickname})` : full_name
    const fmtAmount = 'KES ' + Number(amount).toLocaleString('en-KE')
    const adminUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/admin`
    console.log('RESEND KEY:', process.env.RESEND_API_KEY?.slice(0, 8))
    console.log('email:', process.env.ADMIN_EMAIL)
    console.log('Sending to:', ADMIN_EMAIL)
    const emailResult = await resend.emails.send({
      from: 'Quracle Solar <onboarding@resend.dev>',
      to: ADMIN_EMAIL,
      subject: `New pledge: ${displayName} — ${fmtAmount}`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #085041; margin-bottom: 4px;">New pledge received</h2>
          <p style="color: #666; margin-top: 0;">${MOSQUE_NAME} Solar Project</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr><td style="color: #999; padding: 6px 0; width: 140px;">Name</td><td style="color: #111; font-weight: 500;">${displayName}</td></tr>
            <tr><td style="color: #999; padding: 6px 0;">Phone</td><td style="color: #111;">${phone}</td></tr>
            <tr><td style="color: #999; padding: 6px 0;">Location</td><td style="color: #111;">${location}</td></tr>
            <tr><td style="color: #999; padding: 6px 0;">Amount</td><td style="color: #085041; font-weight: 600; font-size: 16px;">${fmtAmount}</td></tr>
            <tr><td style="color: #999; padding: 6px 0;">Payment</td><td style="color: #111;">${payment_method}</td></tr>
            ${message ? `<tr><td style="color: #999; padding: 6px 0; vertical-align: top;">Message</td><td style="color: #111; font-style: italic;">"${message}"</td></tr>` : ''}
          </table>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 13px; color: #555;">Contact them to arrange payment via <strong>${payment_method}</strong>, then approve them on the admin dashboard.</p>
          <a href="${adminUrl}" style="display:inline-block; margin-top: 12px; padding: 10px 20px; background: #085041; color: #fff; text-decoration: none; border-radius: 8px; font-size: 14px;">
            Go to admin dashboard →
          </a>
        </div>
      `,
    })

    console.log('Resend result:', JSON.stringify(emailResult))

    return NextResponse.json({ success: true, pledge })
  } catch (err) {
    console.error('Pledge API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
