



/**
 * Generisches Repository-Interface für CRUD-Operationen.
 * Abstrahiert die zugrundeliegende Datenquelle von der Business-Logik.
 * Dient als "Vertrag" für Interfaces oder Klassen, die die jeweilige Datenquelle konkret implementieren
 * @template T - Der Entitätstyp, der von diesem Repository verwaltet wird.
 */
interface IRepository<T extends {id: string}> {
    /**
     * Gibt alle Entitäten zurück.
     * @returns Ein Promise, das ein Array aller Entitäten auflöst.
     */
    getAll(): Promise<T[]>;

    /**
     * Gibt eine einzelne Entität anhand ihrer eindeutigen ID zurück.
     * @param id - Die eindeutige ID der gesuchten Entität.
     * @returns Ein Promise, das die Entität oder `undefined` auflöst, falls nicht gefunden.
     */
    getById(id: string): Promise<T | undefined>;

    /**
     * Speichert eine neue Entität.
     * @param item - Die zu erstellende Entität.
     * @returns Ein Promise, das die erstellte Entität auflöst.
     */
    create(item: T): Promise<T>;

    /**
     * Aktualisiert eine bestehende Entität.
     * @param item - Die Entität mit aktualisierten Werten. Muss die bestehende `id` enthalten.
     * @returns Ein Promise, das die aktualisierte Entität auflöst.
     */
    update(item: T): Promise<T>;

    /**
     * Löscht eine Entität anhand ihrer eindeutigen ID.
     * @param id - Die eindeutige ID der zu löschenden Entität.
     * @returns Ein Promise, das die ID der gelöschten Entität auflöst.
     */
    delete(id: string): Promise<string>;
}

export type { IRepository };