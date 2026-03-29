import { AbstractRepository } from "./AbstractRepository";


class InMemoryRepository<T extends {id: string}> extends AbstractRepository<T> {

    /**
     * Fügt das item dem Klassen-Array hinzu.
     * @inheritdoc
     */
    async create(item: T): Promise<T> {
        this.items.push(item);
        return item;
    }

    /**
     * Fügt das aktualisierte Item dem Klassen-Array hinzu.
     * @inheritdoc
     */
    async update(item: T): Promise<T> {
        let itemToUpdateIndex = this.items.findIndex(_ => _.id === item.id);
        return this.items[itemToUpdateIndex] = item;
    }

    async delete(id: string): Promise<string> {
        let itemToDeleteIndex = this.items.findIndex(_ => _.id === id);
        let itemToDelete = this.items[itemToDeleteIndex];

        if (itemToDelete) {
            this.items.splice(itemToDeleteIndex, 1)
            return itemToDelete.id;
        } else {
            throw new Error("Error deleting item.");
        }
    }

}

export {InMemoryRepository}