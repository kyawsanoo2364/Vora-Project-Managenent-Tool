import { Prisma, PrismaClient } from '@prisma/client';

export async function paginateQuery<T>(
  prisma: PrismaClient,
  modelDelegate: any,
  args: {
    cursor?: string;
    take: number;
    where?: Record<string, any>;
    orderBy?: Record<string, any>;
    include?: Record<string, any>;
  },
): Promise<{ items: T[]; nextCursor?: string }> {
  const { cursor, take, include, orderBy, where } = args;

  const records = await modelDelegate.findMany({
    where,
    take: take + 1,
    orderBy,
    include,
    ...(cursor ? { cursor: { id: cursor } } : {}),
  });
  let nextCursor: string | undefined;
  if (records.length > take) {
    const lastRecord = records.pop();
    nextCursor = lastRecord.id;
  }

  return { items: records as T[], nextCursor };
}
