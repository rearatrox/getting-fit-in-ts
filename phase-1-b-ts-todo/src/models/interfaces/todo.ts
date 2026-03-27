import {Status} from "@/models/types/status";

interface Todo {
    id: string,
    title: string,
    description?: string,
    status?: Status,
    createdAt: Date | string;
}

export type {Todo}