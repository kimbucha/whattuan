"use server";

import { Resend } from "resend";
import { validateString, getErrorMessage } from "@/lib/utils";
import ContactFormEmail from "@/email/contact-form-email";
import React from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (formData: FormData) => {
  const senderEmail = formData.get("senderEmail");
  const message = formData.get("message");

  console.log(senderEmail);

  if (!validateString(senderEmail, 500)) {
    return { error: "invalid email" };
  }

  if (!validateString(message, 5000)) {
    return { error: "invalid message" };
  }
  let data;
  try {
    data = await resend.emails.send({
      from: "what contact <onboarding@resend.dev>",
      to: "kim.nguyen.afk@gmail.com",
      subject: "hi from site!",
      reply_to: senderEmail as string,
      react: React.createElement(ContactFormEmail, {
        message: message as string,
        senderEmail: senderEmail as string,
      }),
    });
  } catch (error: unknown) {
    return {
      error: getErrorMessage(error),
    };
  }
  console.log(senderEmail);
  console.log(message);
  return {
    data,
  };
};
