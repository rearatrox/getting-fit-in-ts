import {Status} from "@/models/types/status";
import { Priority } from "@/models/types/priority";


// <TData = void> gibt an, dass standardmäßig TData "void" annimmt, also nicht vorhanden ist
// Dadurch wird eine Erstellung von dem Todo-Interface ohne explizite <TData>-Angabe erlaubt
interface Todo<TData>{
    id: string,
    description: string,
    status?: Status,
    createdAt: Date | string;
    data: TData;
}

interface TagMeta {
    tags: string[],
    priority: Priority
}


export type {Todo, TagMeta}