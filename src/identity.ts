export interface Identity {
    uuid: string;
    name?: string;
}

export interface ExternalWindowIdentity {
    hwnd: string;
    pid: number;
}
