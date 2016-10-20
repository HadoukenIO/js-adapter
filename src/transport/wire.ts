abstract class Wire {
    abstract connect(address): Promise<any>
    abstract send(data): Promise<any>
    abstract shutdown(): Promise<boolean>
    protected abstract onmessage(data): void
}
export default Wire