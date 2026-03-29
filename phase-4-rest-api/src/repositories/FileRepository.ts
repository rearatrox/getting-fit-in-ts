import { InMemoryRepository } from "./InMemoryRepository";
import * as fs from "fs/promises";
import * as path from "path";

class FileRepository<T extends { id: string }> extends InMemoryRepository<T> {
    private fileName = path.join(__dirname, "..", "..", "todos.json");

    /**
     * Erstellt eine initialisierte Instanz von FileRepository.
     * Lädt beim Erstellen direkt die bestehenden Daten aus der JSON-Datei.
     */
    static async create<T extends { id: string }>(): Promise<FileRepository<T>> {
        const repo = new FileRepository<T>();
        await repo.loadFile();
        return repo;
    }

    /**
     * loads file "todos.json" with todos and stores them inside class
     */
    public async loadFile(): Promise<void> {
        try {
            const file = await fs.readFile(this.fileName);
            this.items = JSON.parse(file.toString());
        }
        catch {
            this.items = [];
        }

    }
    /**
     * saves class todos to file "todos.json"
     * throws error if saving is not successful
     */
    private async saveFile(): Promise<void> {
        try {
            await fs.writeFile(this.fileName, JSON.stringify(this.items, null, 2), "utf-8");
        } catch (error) {
            throw new Error(`Failed to save todos: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Erstellt ein neues Item und speichert dieses anschließend auf dem Filesystem.
     * @param item zu erstellendes Item.
     * @returns erstelltes Item.
     */
    async create(item: T): Promise<T> {
    const createdItem = await super.create(item);
    await this.saveFile();
    return createdItem;
    }

    /**
     * Aktualisiert ein Item und speichert dieses anschließend auf dem Filesystem.
     * @param item zu aktualisierendes Item.
     * @returns aktualisiertes Item.
     */
    async update(item: T): Promise<T> {
        const updatedItem = await super.update(item);
        await this.saveFile();
        return updatedItem;
    }

    /**
     * Löscht ein Item und speichert das Array anschließend auf dem Filesystem.
     * @param id die id des zu löschenden Items.
     * @returns id des gelöschten items.
     */
    async delete(id: string): Promise<string> {
        const deletedItemId = await super.delete(id);
        await this.saveFile();
        return deletedItemId;
    }
}

export {FileRepository}