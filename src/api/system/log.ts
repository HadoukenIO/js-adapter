export interface GetLogRequestType {
    name: string;
    endFile: string;
    sizeLimit: number;
}

export interface LogInfo {
    name: string;
    size: number;
    date: string;
}
