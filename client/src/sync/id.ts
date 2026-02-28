import { generateUsername } from "unique-username-generator";

const LOCAL_CLIENT = "local";

// default clientId will be overwritten by a server-issued clientId on join
let clientId: string = LOCAL_CLIENT;
const username: string = generateUsername("-");

export function setClientId(id: string) {
    clientId = id;
}

export function isClientIdAssigned(): boolean {
    return clientId !== LOCAL_CLIENT;
}

export function getClientId(): string {
    return clientId;
}

export function getUsername(): string {
    return username;
}
