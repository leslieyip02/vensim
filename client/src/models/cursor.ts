export interface Cursor {
    x: number;
    y: number;
    username: string;
}

// no add message is needed because the update acts like an upsert
export type CursorMessage =
    | { type: "cursor/update"; clientId: string; cursor: Cursor }
    | { type: "cursor/delete"; clientId: string };
