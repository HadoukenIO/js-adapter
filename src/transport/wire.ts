export interface Wire {
    connect(address): Promise<any>
    send(data): Promise<any>
    shutdown(): Promise<void>
}
export interface WireConstructor {
    new(onmessage: (data) => void)
}