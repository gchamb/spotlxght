import DefaultEmailTemplate from "~/components/email-templates/default";
import { resend } from "~/server/resend";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { apiKeys } from "~/server/db/schema";
import { sendEmailRequest } from "~/lib/types";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const apiKey = headers().get("spotlxght-key");

  if (apiKey === null) {
    console.log("Invalid request.");
    return Response.json(null, { status: 400 });
  }

  const requestData = (await request.json()) as unknown;

  const valid = sendEmailRequest.safeParse(requestData);
  if (!valid.success) {
    console.log("Invalid request.");
    console.log(valid.error.errors);
    return Response.json(null, { status: 400 });
  }

  const { emails, subject, message } = valid.data;

  try {
    const key = await db.query.apiKeys.findFirst({
      where: eq(apiKeys.id, apiKey),
    });

    if (key === undefined) {
      console.log("Invalid api key.");
      return Response.json(null, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: "spotlxght <noreply@spotlxght.com>",
      to: emails,
      react: DefaultEmailTemplate({ message }),
      subject,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
