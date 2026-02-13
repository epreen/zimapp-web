import nodemailer, {
    Transporter,
} from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter: Transporter<SMTPTransport.SentMessageInfo> =
    nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.GOOGLE_OAUTH_SENDER_EMAIL || "epreennjolomole451@gmail.com",
            clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
        },
    });

interface OrderItem {
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

interface ShippingAddress {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface OrderConfirmationData {
    customerName: string;
    customerEmail: string;
    orderId: string;
    orderDate: string;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    productDiscount?: number;
    couponDiscount?: number;
    couponCode?: string;
    businessDiscount?: number;
    shippingAddress: ShippingAddress;
    estimatedDelivery?: string;
}

interface EmailResponse {
    success: boolean;
    messageId?: string;
    error?: string;
}

interface SendMailParams {
    email: string;
    subject: string;
    text: string;
    html?: string;
}

const generateOrderConfirmationHTML = (data: OrderConfirmationData): string => {
    const PRIMARY = "#5B0EFF"; // ZIMAPP primary
    const SECONDARY = "#FFD84D";
    const BG = "#F8F6FC";
  
    const formatCurrency = (amount: number) =>
      `MWK ${amount.toLocaleString("en-MW", { minimumFractionDigits: 2 })}`;
  
    const itemsHtml = data.items
      .map(
        (item) => `
        <tr>
          <td style="padding:10px 0; border-bottom:1px solid #eee;">
            <strong>${item.name}</strong><br />
            <span style="font-size:13px; color:#666;">
              Qty: ${item.quantity}
            </span>
          </td>
          <td align="right" style="padding:10px 0; border-bottom:1px solid #eee;">
            ${formatCurrency(item.price * item.quantity)}
          </td>
        </tr>
      `
      )
      .join("");
  
    const discountRows = `
      ${data.productDiscount ? `
        <tr>
          <td style="padding:6px 0; color:#555;">Product Discount</td>
          <td align="right" style="padding:6px 0; color:#555;">
            -${formatCurrency(data.productDiscount)}
          </td>
        </tr>` : ""}
  
      ${data.couponDiscount ? `
        <tr>
          <td style="padding:6px 0; color:#555;">
            Coupon (${data.couponCode})
          </td>
          <td align="right" style="padding:6px 0; color:#555;">
            -${formatCurrency(data.couponDiscount)}
          </td>
        </tr>` : ""}
  
      ${data.businessDiscount ? `
        <tr>
          <td style="padding:6px 0; color:#555;">Business Discount</td>
          <td align="right" style="padding:6px 0; color:#555;">
            -${formatCurrency(data.businessDiscount)}
          </td>
        </tr>` : ""}
    `;
  
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Order Confirmation</title>
        </head>
        <body style="margin:0; padding:0; background-color:${BG}; font-family:Arial, Helvetica, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
            <tr>
                <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0"
                    style="max-width:600px; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.08);">
        
                    <!-- Header -->
                    <tr>
                    <td style="background:${PRIMARY}; padding:26px 24px; text-align:center;">
                        <h1 style="margin:0; color:#fff; font-size:26px; letter-spacing:1px;">
                        ZIMAPP
                        </h1>
                        <p style="margin:6px 0 0; color:${SECONDARY}; font-size:14px;">
                        Order Confirmation
                        </p>
                    </td>
                    </tr>
        
                    <!-- Greeting -->
                    <tr>
                    <td style="padding:30px 28px 10px;">
                        <h2 style="margin:0; font-size:20px; color:${PRIMARY};">
                        Thank you for your order 🎉
                        </h2>
                        <p style="font-size:14px; color:#555; margin:10px 0 0;">
                        Hi <strong>${data.customerName}</strong>, your order has been successfully placed.
                        </p>
                    </td>
                    </tr>
        
                    <!-- Order Meta -->
                    <tr>
                    <td style="padding:10px 28px;">
                        <table width="100%" style="font-size:13px; color:#555;">
                        <tr>
                            <td>Order ID:</td>
                            <td align="right"><strong>${data.orderId}</strong></td>
                        </tr>
                        <tr>
                            <td>Order Date:</td>
                            <td align="right">${data.orderDate}</td>
                        </tr>
                        </table>
                    </td>
                    </tr>
        
                    <!-- Items -->
                    <tr>
                    <td style="padding:20px 28px;">
                        <h3 style="margin:0 0 10px; font-size:16px; color:${PRIMARY};">
                        Order Summary
                        </h3>
                        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                        ${itemsHtml}
                        </table>
                    </td>
                    </tr>
        
                    <!-- Totals -->
                    <tr>
                    <td style="padding:10px 28px;">
                        <table width="100%" style="font-size:14px;">
                        <tr>
                            <td style="padding:6px 0;">Subtotal</td>
                            <td align="right" style="padding:6px 0;">
                            ${formatCurrency(data.subtotal)}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:6px 0;">Shipping</td>
                            <td align="right" style="padding:6px 0;">
                            ${formatCurrency(data.shipping)}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:6px 0;">Tax</td>
                            <td align="right" style="padding:6px 0;">
                            ${formatCurrency(data.tax)}
                            </td>
                        </tr>
        
                        ${discountRows}
        
                        <tr>
                            <td style="padding:10px 0; font-weight:bold; font-size:16px;">
                            Total
                            </td>
                            <td align="right" style="padding:10px 0; font-weight:bold; font-size:16px;">
                            ${formatCurrency(data.total)}
                            </td>
                        </tr>
                        </table>
                    </td>
                    </tr>
        
                    <!-- Shipping -->
                    <tr>
                    <td style="padding:20px 28px;">
                        <h3 style="margin:0 0 8px; font-size:16px; color:${PRIMARY};">
                        Shipping Address
                        </h3>
                        <p style="margin:0; font-size:14px; color:#555; line-height:1.6;">
                        ${data.shippingAddress.name}<br />
                        ${data.shippingAddress.street}<br />
                        ${data.shippingAddress.city}, ${data.shippingAddress.state}<br />
                        ${data.shippingAddress.country}
                        </p>
        
                        ${
                        data.estimatedDelivery
                            ? `<p style="margin-top:10px; font-size:13px; color:#555;">
                                Estimated delivery: <strong>${data.estimatedDelivery}</strong>
                            </p>`
                            : ""
                        }
                    </td>
                    </tr>
        
                    <!-- Footer -->
                    <tr>
                    <td style="padding:22px 28px; font-size:12px; color:#666;">
                        <hr style="border:none; border-top:1px solid #eee; margin-bottom:14px;" />
                        <p style="margin:0;">
                        ZiMA • Blantyre, Malawi<br />
                        Support: <a href="mailto:support@yourdomain.com" style="color:${PRIMARY}; text-decoration:none;">support@yourdomain.com</a>
                        </p>
                        <p style="margin-top:10px; color:#999;">
                        This is a transactional email. No replies required.
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
};  

const sendOrderConfirmationEmail = async (data: OrderConfirmationData): Promise<EmailResponse> => {
    try {
        const htmlContent = generateOrderConfirmationHTML(data);

        const mailOptions = {
            from: `"zimapp ecommerce platform" <${
                process.env.GOOGLE_OAUTH_SENDER_EMAIL || "epreennjolomole451@gmail.com"
            }>`,
            to: data.customerEmail,
            subject: `Order Confirmation - ${data.orderId} | Thank you for your purchase!`,
            html: htmlContent,
            text: `
                Hi ${data.customerName}!

                Thank you for your order! Here are the details:

                Order ID: ${data.orderId}
                Order Date: ${data.orderDate}

                Items Ordered:
                ${data.items
                    .map(
                        (item) => `
                            - ${item.name} (Qty: ${item.quantity}) - ${(item.price * item.quantity).toFixed(2)}
                        `
                    ).join("\n")
                }

                Order Summary:
                _________________________________________
                Subtotal (${data.items.length} ${
                    data.items.length === 1 ? "item" : "items"
                }): MWK ${data.subtotal.toFixed(2)}
                ${
                    (data.productDiscount || 0) > 0
                        ? `Product Discount: -MWK ${data.productDiscount?.toFixed(2)}`
                        : ""
                }
                ${
                    (data.businessDiscount || 0) > 0
                        ? `Business Discount: -MWK ${data.businessDiscount?.toFixed(2)}`
                        : ""
                }
                _________________________________________
                Shipping: ${data.shipping === 0 ? "FREE" : "MWK " + data.shipping.toFixed(2)}
                Tax: MWK ${data.tax.toFixed(2)}
                _________________________________________
                Total Amount: MWK ${(data.subtotal + data.shipping + data.tax).toFixed(2)}
                ${
                    (data.productDiscount || 0) +
                    (data.couponDiscount || 0) +
                    (data.businessDiscount || 0) >
                    0 ? `
                        Total Discout: -MWK ${(
                            (data.productDiscount || 0) +
                            (data.couponDiscount || 0) +
                            (data.businessDiscount || 0)
                        ).toFixed(2)}
                    ` : ""
                }
                =========================================
                PAYABLE AMOUNT: MWK ${data.total.toFixed(2)}
                =========================================

                Shipping Address:
                ${data.shippingAddress.name}
                ${data.shippingAddress.street}
                ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}
                ${data.shippingAddress.country}

                ${data.estimatedDelivery ? `Estimated Delivery: ${data.estimatedDelivery}` : ""}

                We'll send you another email with tracking information once your order ships.

                If you have any questions, please contact us at support@zimapp.com or +265 xxx xxx xxx.

                Thank you for choosing zimapp!
            `
        };

        const result = await transporter.sendMail(mailOptions);

        return {
            success: true,
            messageId: result.messageId
        }
    } catch (error) {
        console.error("Failed to send order confirmation email: ", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        }
    }
}

const sendMail = async ({
    email,
    subject,
    text,
    html,
}: SendMailParams): Promise<EmailResponse> => {
    try {
        const mailOptions = {
            from: `"zimapp ecommerce platform" <${
                process.env.GOOGLE_OAUTH_SENDER_EMAIL || "epreennjolomole451@gmail.com"
            }>`,
            to: email,
            subject,
            text,
            ...(html && { html }),
        };

        const result = await transporter.sendMail(mailOptions);

        return {
            success: true,
            messageId: result.messageId
        }
    } catch (error) {
        console.error("Failed to send order confirmation email: ", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred"
        }
    }
}

export {
    sendOrderConfirmationEmail,
    sendMail
};

export type {
    OrderConfirmationData,
    OrderItem,
    ShippingAddress,
    EmailResponse,
    SendMailParams
}