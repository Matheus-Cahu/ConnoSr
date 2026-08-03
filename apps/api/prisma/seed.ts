import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await argon2.hash("password123", { type: argon2.argon2id });

  const [alice, bruno] = await Promise.all([
    prisma.user.upsert({
      where: { email: "alice@example.com" },
      update: {},
      create: {
        email: "alice@example.com",
        username: "alice",
        displayName: "Alice Silva",
        passwordHash,
        bio: "Explorando restaurantes escondidos de SP.",
      },
    }),
    prisma.user.upsert({
      where: { email: "bruno@example.com" },
      update: {},
      create: {
        email: "bruno@example.com",
        username: "bruno",
        displayName: "Bruno Costa",
        passwordHash,
        bio: "Hotéis e resorts pelo Brasil afora.",
      },
    }),
  ]);

  await prisma.follow.upsert({
    where: { followerId_followingId: { followerId: alice.id, followingId: bruno.id } },
    update: {},
    create: { followerId: alice.id, followingId: bruno.id },
  });

  const experience = await prisma.experience.create({
    data: {
      name: "Cantina da Vila",
      category: "RESTAURANT",
      description: "Cantina italiana tradicional no bairro da Vila Madalena.",
      city: "São Paulo",
      region: "SP",
      country: "Brasil",
      createdById: bruno.id,
    },
  });

  await prisma.review.create({
    data: {
      userId: bruno.id,
      experienceId: experience.id,
      rating: 5,
      text: "Melhor nhoque da cidade, atendimento excelente!",
    },
  });

  console.log("Seed complete:", { alice: alice.username, bruno: bruno.username, experience: experience.name });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
