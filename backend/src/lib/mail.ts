import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Confirm your email",
    html: `<p>Your verification code is: ${token}</p>`,
  });
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Welcome",
    html: `<p>Welcome, ${name}. Thanks for choosing our company! We are happy to see you on board.</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${`${process.env.CLIENT_URL}/reset-password/${token}`}">here</a> to reset your password.</p>`,
  });
};

export const sendResetSuccessEmail = async (email: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Password Reset Successful",
    html: `<p>We are writing to confirm that your password has been successfully reset.</p>`,
  });
};
