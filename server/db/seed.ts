import { and, count, eq } from "drizzle-orm";
import { auth } from "../auth/auth.js";
import { db } from "./client.js";
import { notes, user } from "./schema.js";

const demoUser = {
  name: "Demo User",
  email: "demo@example.com",
  password: "demo-password-1234",
};

const demoNotes = [
  "Welcome to the template. This seeded note confirms the authenticated notes list is working.",
  "Fork this project, replace the env vars, and then swap the notes resource for your real domain model.",
];

async function ensureDemoUser() {
  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, demoUser.email),
  });

  if (existingUser) {
    return existingUser;
  }

  await auth.api.signUpEmail({
    body: demoUser,
  });

  const createdUser = await db.query.user.findFirst({
    where: eq(user.email, demoUser.email),
  });

  if (!createdUser) {
    throw new Error("Seed user was not created.");
  }

  return createdUser;
}

async function ensureDemoNotes(userId: string) {
  for (const text of demoNotes) {
    const existingNoteCount = await db
      .select({ count: count() })
      .from(notes)
      .where(and(eq(notes.userId, userId), eq(notes.text, text)));

    if (existingNoteCount[0]?.count) {
      continue;
    }

    await db.insert(notes).values({
      userId,
      text,
    });
  }
}

async function main() {
  const seededUser = await ensureDemoUser();
  await ensureDemoNotes(seededUser.id);

  console.log("Seed complete.");
  console.log(`Email: ${demoUser.email}`);
  console.log(`Password: ${demoUser.password}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
