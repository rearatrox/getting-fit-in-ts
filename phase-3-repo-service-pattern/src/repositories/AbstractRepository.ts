import { IRepository } from "./IRepository";



abstract class AbstractRepository<T extends { id: string }> implements IRepository<T> {
    protected items: T[] = [];

    /**
    * @inheritdoc
    */
    abstract create(item: T): Promise<T>;

    /**
    * @inheritdoc
    */
    abstract update(item: T): Promise<T>;

    /**
    * @inheritdoc
    */
    abstract delete(id: string): Promise<string>;


    /**
    * Gibt alle Entitäten aus dem Klassen-Array zurück.
    * @inheritdoc
    */
    async getAll(): Promise<T[]> {
        return this.items;
    }
    /**
     * Gibt die jeweilige Entität aus dem Klassen-Array zurück.
     * @inheritdoc
     */
    async getById(id: string): Promise<T | undefined> {
        return this.items.find(_ => _.id === id);
    }
}

export {AbstractRepository}