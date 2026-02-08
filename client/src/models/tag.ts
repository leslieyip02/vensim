import { ID_SEPARATOR } from "./graph";

export interface Tag {
    id: string;
    label: string;
    color: string;
}

export function makeTagId(counter: number) {
    return `tag${ID_SEPARATOR}${counter}`;
}
