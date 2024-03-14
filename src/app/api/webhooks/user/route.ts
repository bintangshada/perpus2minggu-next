import { prisma } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";
import { IncomingHttpHeaders } from "http";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook, WebhookRequiredHeaders } from "svix";

const webhookSecret = process.env.WEBHOOK_SECRET || "";

async function handler(request: Request) {
  const payload = await request.json();
  const headersList = headers();
  const heads = {
    "svix-id": headersList.get("svix-id"),
    "svix-timestamp": headersList.get("svix-timestamp"),
    "svix-signature": headersList.get("svix-signature"),
  };
  const wh = new Webhook(webhookSecret);
  let evt: Event | null = null;

  try {
    evt = wh.verify(
      JSON.stringify(payload),
      heads as IncomingHttpHeaders & WebhookRequiredHeaders
    ) as Event;
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({}, { status: 400 });
  }

  const eventType: EventType = evt.type;
  if (eventType === "user.created" || eventType === "user.updated" || eventType === "user.deleted") {
    const { id, ...attributes } = evt.data;
    let username = attributes.username as string;
    if (!username) {
      username = `${attributes.first_name} ${attributes.last_name}`;
    }
    let email = "";
    if (Array.isArray(evt.data.email_addresses)) {
      const emailAddresses = evt.data.email_addresses.map((emailObj: any) => emailObj.email_address);
      email = emailAddresses[0];
    }
    const existingUser = await clerkClient.users.getUser(id as string);
    if (!existingUser.publicMetadata.roles) {
      await clerkClient.users.updateUserMetadata(id as string, {
        publicMetadata: {
          roles: ["user"]
        }
      });
    }
    await prisma.user.upsert({
      where: { externalId: id as string },
      create: {
        externalId: id as string,
        attributes,
        username,
        email,
      },
      update: { username, email, attributes },
    });
    return NextResponse.json({ status: 201 });
  } else {
    return NextResponse.json({}, { status: 400 });
  }
}

type EventType = "user.created" | "user.updated" | "user.deleted" |"*";

type Event = {
  data: Record<string, string | number>;
  object: "event";
  type: EventType;
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
