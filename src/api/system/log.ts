export interface GetLogRequestType {
    name: string;
    endFile?: string;
    sizeLimit?: number;
}

export interface LogInfo {
    name: string;
    size: number;
    date: string;
}

// 2.4 supports string enum types, currently we use 2.2
export type LogLevel = 'verbose' | 'info' | 'warning' | 'error' | 'fatal';
