import { subscribeToNewsletter } from "@/actions/subscription-action";
import { sendMail } from "@/lib/email-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const ipAddress =
            request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            "unknown";
        const userAgent =
            request.headers.get("user-agent") ||
            "unknown";

        const result = await subscribeToNewsletter({
            email,
            source: "footer",
            ipAddress,
            userAgent
        });

        if (!result.success) {
            return NextResponse.json({
                error: result.message,
                alreadySubscribed: result.alreadySubscribed || false,
            }, {
                status: result.alreadySubscribed ? 200 : 400
            });
        }

        const emailResult = await sendMail({
            email,
            subject: "Welcome to ZIMAPP Newsletter! 🎉",
            text:
                "Thank you for subscribing to our newsletter! You are now part of our exclusive community.",
            html: generateWelcomeEmailHTML(email),
        });

        if (!emailResult.success) {
            console.error("Failed to send welcome email: ", emailResult.error);
        }

        return NextResponse.json({
            message: result.message,
            subscriptionId: result.data?.subscriptionId,
        }, {
            status: 200
        });
    } catch (error) {
        console.error("Newsletter subscription API error: ", error);

        return NextResponse.json({
            error: "Something went wrong. Please try again later."
        }, {
            status: 500
        });
    }
}

function generateWelcomeEmailHTML(email: string): string {
    const PRIMARY = "#5B0EFF"; // Approx hsl(278, 100%, 38%)
    const SECONDARY = "#FFD84D"; // Golden accent
    const BG = "#F8F6FC";
  
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Welcome to ZIMAPP</title>
        </head>
        <body style="margin:0; padding:0; background-color:${BG}; font-family:Arial, Helvetica, sans-serif; color:#111;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG}; padding:24px 0;">
            <tr>
                <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">
        
                    <!-- Header -->
                    <tr>
                    <td style="background:${PRIMARY}; padding:28px 24px; text-align:center;">
                        <h1 style="margin:0; font-size:28px; letter-spacing:1px; color:#ffffff;">
                        ZIMAPP
                        </h1>
                        <p style="margin:8px 0 0; font-size:14px; color:${SECONDARY};">
                        Smart Digital Services for Malawi
                        </p>
                    </td>
                    </tr>
        
                    <!-- Body -->
                    <tr>
                    <td style="padding:32px 28px;">
                        <h2 style="margin-top:0; font-size:22px; color:${PRIMARY};">
                        Welcome aboard 🎉
                        </h2>
        
                        <p style="font-size:15px; line-height:1.7; margin:16px 0;">
                        Hi <strong>${email}</strong>,
                        </p>
        
                        <p style="font-size:15px; line-height:1.7; margin:16px 0;">
                        Thank you for subscribing to the <strong>ZiMAPP Newsletter</strong>.
                        You’re now part of a growing community that believes technology should
                        be simple, powerful, and accessible.
                        </p>
        
                        <p style="font-size:15px; line-height:1.7; margin:16px 0;">
                        Here’s what you can expect from us:
                        </p>
        
                        <ul style="font-size:15px; line-height:1.7; padding-left:18px; margin:12px 0 20px;">
                        <li>Product updates & feature launches</li>
                        <li>Exclusive insights and announcements</li>
                        <li>Early access to new tools and services</li>
                        <li>Community stories from across Malawi</li>
                        </ul>
        
                        <div style="text-align:center; margin:32px 0;">
                        <a href="https://yourdomain.com"
                            style="
                            display:inline-block;
                            background:${PRIMARY};
                            color:#ffffff;
                            text-decoration:none;
                            padding:14px 26px;
                            border-radius:10px;
                            font-weight:bold;
                            font-size:14px;
                            ">
                            Explore ZiMAPP
                        </a>
                        </div>
        
                        <p style="font-size:14px; line-height:1.6; color:#555;">
                        If you ever have questions, feedback, or ideas, our team is always listening.
                        </p>
                    </td>
                    </tr>
        
                    <!-- Divider -->
                    <tr>
                    <td style="padding:0 28px;">
                        <hr style="border:none; border-top:1px solid #eee;" />
                    </td>
                    </tr>
        
                    <!-- Footer -->
                    <tr>
                    <td style="padding:24px 28px; font-size:12px; color:#666;">
                        <p style="margin:0 0 8px;">
                        <strong>ZiMA</strong><br />
                        Blantyre, Malawi
                        </p>
        
                        <p style="margin:0 0 8px;">
                        Support: <a href="mailto:support@yourdomain.com" style="color:${PRIMARY}; text-decoration:none;">support@yourdomain.com</a><br />
                        Phone: +265XXXXXXXXX
                        </p>
        
                        <p style="margin:12px 0 0;">
                        <a href="https://facebook.com/yourpage" style="margin-right:10px; color:${PRIMARY}; text-decoration:none;">Facebook</a>
                        <a href="https://instagram.com/yourpage" style="margin-right:10px; color:${PRIMARY}; text-decoration:none;">Instagram</a>
                        <a href="https://x.com/yourpage" style="color:${PRIMARY}; text-decoration:none;">X</a>
                        </p>
        
                        <p style="margin:16px 0 0; color:#999;">
                        You received this email because you signed up for ZiMAPP updates.
                        </p>
                    </td>
                    </tr>
        
                </table>
                </td>
            </tr>
            </table>
        </body>
        </html>
    `;  
}  