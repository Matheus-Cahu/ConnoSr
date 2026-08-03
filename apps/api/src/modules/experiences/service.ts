import type {
  CreateExperienceInput,
  Experience,
  SearchExperiencesQuery,
  UpdateExperienceInput,
} from "@connosr/shared-types";
import { prisma } from "../../lib/prisma.js";

function toDto(experience: {
  id: string;
  name: string;
  category: string;
  description: string | null;
  addressLine: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  archivedAt: Date | null;
  createdAt: Date;
}): Experience {
  return {
    id: experience.id,
    name: experience.name,
    category: experience.category as Experience["category"],
    description: experience.description,
    addressLine: experience.addressLine,
    city: experience.city,
    region: experience.region,
    country: experience.country,
    latitude: experience.latitude,
    longitude: experience.longitude,
    archivedAt: experience.archivedAt?.toISOString() ?? null,
    createdAt: experience.createdAt.toISOString(),
  };
}

export async function createExperience(
  createdById: string,
  input: CreateExperienceInput,
): Promise<Experience> {
  const experience = await prisma.experience.create({
    data: { ...input, createdById },
  });
  return toDto(experience);
}

export async function getExperience(id: string): Promise<Experience | null> {
  const experience = await prisma.experience.findUnique({ where: { id } });
  return experience ? toDto(experience) : null;
}

export async function updateExperience(
  id: string,
  input: UpdateExperienceInput,
): Promise<Experience | null> {
  const experience = await prisma.experience.update({ where: { id }, data: input }).catch(() => null);
  return experience ? toDto(experience) : null;
}

/** Soft delete: preserves the experience row and all of its reviews. */
export async function archiveExperience(id: string): Promise<Experience | null> {
  const experience = await prisma.experience
    .update({ where: { id }, data: { archivedAt: new Date() } })
    .catch(() => null);
  return experience ? toDto(experience) : null;
}

export async function searchExperiences(
  query: SearchExperiencesQuery,
): Promise<{ items: Experience[]; nextCursor: string | null }> {
  const experiences = await prisma.experience.findMany({
    where: {
      archivedAt: null,
      ...(query.category ? { category: query.category } : {}),
      ...(query.city ? { city: { equals: query.city, mode: "insensitive" } } : {}),
      ...(query.q ? { name: { contains: query.q, mode: "insensitive" } } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: query.limit + 1,
    ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
  });

  const hasMore = experiences.length > query.limit;
  const items = hasMore ? experiences.slice(0, query.limit) : experiences;
  const nextCursor = hasMore ? (items[items.length - 1]?.id ?? null) : null;

  return { items: items.map(toDto), nextCursor };
}
