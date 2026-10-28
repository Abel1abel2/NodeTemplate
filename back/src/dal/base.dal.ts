import { PrismaClient, Prisma } from '@prisma/client';

/**
 * Base interface for all DAL operations
 * Provides common CRUD operations that all DAL classes should implement
 */
export interface IBaseDAL<T> {
    findById(id: number | string, include?: object): Promise<T | null>;
    findMany(where?: object, include?: object, orderBy?: object): Promise<T[]>;
    create(data: object): Promise<T>;
    update(id: number | string, data: object): Promise<T>;
    delete(id: number | string): Promise<T>;
    count(where?: object): Promise<number>;
}

/**
 * Base DAL class with common Prisma operations
 * This provides a foundation for all model-specific DAL classes
 */
export abstract class BaseDAL<T> implements IBaseDAL<T> {
    constructor(protected prisma: PrismaClient) { }

    /**
     * Get the Prisma model delegate for the specific model
     * Must be implemented by child classes
     */
    protected abstract getModel(): any;

    async findById(id: number | string, include?: object): Promise<T | null> {
        return this.getModel().findUnique({
            where: { id },
            ...(include && { include }),
        });
    }

    async findMany(where?: object, include?: object, orderBy?: object): Promise<T[]> {
        return this.getModel().findMany({
            ...(where && { where }),
            ...(include && { include }),
            ...(orderBy && { orderBy }),
        });
    }

    async create(data: object): Promise<T> {
        return this.getModel().create({
            data,
        });
    }

    async update(id: number | string, data: object): Promise<T> {
        return this.getModel().update({
            where: { id },
            data,
        });
    }

    async delete(id: number | string): Promise<T> {
        return this.getModel().delete({
            where: { id },
        });
    }

    async count(where?: object): Promise<number> {
        return this.getModel().count({
            ...(where && { where }),
        });
    }

    /**
     * Execute multiple operations in a transaction
     * @param callback Function containing operations to execute in transaction
     */
    async transaction<R>(
        callback: (tx: Prisma.TransactionClient) => Promise<R>
    ): Promise<R> {
        return this.prisma.$transaction(callback);
    }
}
