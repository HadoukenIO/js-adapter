export interface ExternalProcessRequestType {
    path: string;
    // tslint:disable-next-line
    arguments: string;
    listener: LaunchExternalProcessListener;
}

export interface ExitCode {
    topic: string;
    uuid: string;
    exitCode: number;
}

export interface LaunchExternalProcessListener {
    (code: ExitCode): void;
}

export interface TerminateExternalRequestType {
    uuid: string;
    timeout: number;
    killTree: boolean;
}

export interface ExternalConnection {
    token: string;
    uuid: string;
}
