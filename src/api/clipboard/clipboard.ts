import { Base } from '../base';
import { WriteRequestType, WriteAnyRequestType } from './write-request';

export default class Clipboard extends Base {

    public writeText(writeObj: WriteRequestType): Promise<void> {
        return this.wire.sendAction('clipboard-write-text', writeObj).then(() => undefined);
    }

    public readText(type?: string): Promise<string> {
        return this.wire.sendAction('clipboard-read-text', type)
            .then(({ payload }) => payload.data);
    }

    public writeHtml(writeObj: WriteRequestType): Promise<void> {
        return this.wire.sendAction('clipboard-write-html', writeObj).then(() => undefined);
    }

    public readHtml(type?: string): Promise<string> {
        return this.wire.sendAction('clipboard-read-html', type)
            .then(({ payload }) => payload.data);
    }

    public writeRtf(writeObj: WriteRequestType): Promise<void> {
        return this.wire.sendAction('clipboard-write-rtf', writeObj).then(() => undefined);
    }

    public readRtf(type?: string): Promise<string> {
        return this.wire.sendAction('clipboard-read-rtf', type)
            .then(({ payload }) => payload.data);
    }

    public write(writeObj: WriteAnyRequestType): Promise<void> {
        return this.wire.sendAction('clipboard-write', writeObj).then(() => undefined);
    }

    public getAvailableFormats(type?: string): Promise<Array<string>> {
        return this.wire.sendAction('clipboard-read-formats', type)
            .then(({ payload }) => payload.data);
    }
}
