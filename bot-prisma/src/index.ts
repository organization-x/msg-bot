import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export * from '@prisma/client';

// Allow BigInt Serialization
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(BigInt.prototype as any).toJSON = BigInt.prototype.toString;

export class AppError extends Error {
	constructor(message: string) {
		super(message);
	}
}
