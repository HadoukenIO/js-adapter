import { Base } from '../base';
import { WriteRequestType, WriteAnyRequestType } from './write-request';

/**
 * WriteRequestType interface
 * @typedef { Object } WriteRequestType
 * @property { string } name The name of the running application
 * @property { string } uuid The uuid of the running application
 */

/**
 * The Clipboard API allows reading and writing to the clipboard in multiple formats.
 * @namespace
*/
export default class Clipboard extends Base {

    /**
     * Writes data into the clipboard as plain text
     * @param { WriteRequestType } writeObj This object is described in the WriteRequestType typeof
     * @tutorial Clipboard.writeText
     * @return {Promise.<void>}
    */
    public writeText(writeObj: WriteRequestType): Promise<void> {
        return this.wire.sendAction('clipboard-write-text', writeObj).then(() => undefined);
    }

    /**
     * Read the content of the clipboard as plain text
     * @param { string } type Clipboard Type
     * @tutorial Clipboard.readText
     * @return {Promise.<string>}
    */
    public readText(type?: string): Promise<string> {
        return this.wire.sendAction<string, string>('clipboard-read-text', type)
            .then(({ payload }) => payload.data);
    }

    /**
     * Writes data into the clipboard as Html
     * @param { WriteRequestType } writeObj This object is described in the WriteRequestType typedef
     * @tutorial Clipboard.writeHtml
     * @return {Promise.<void>}
    */
    public writeHtml(writeObj: WriteRequestType): Promise<void> {
        return this.wire.sendAction('clipboard-write-html', writeObj).then(() => undefined);
    }

    /**
     * Read the content of the clipboard as Html
     * @param { string } type Clipboard Type
     * @tutorial Clipboard.readHtml
     * @return {Promise.<string>}
    */
    public readHtml(type?: string): Promise<string> {
        return this.wire.sendAction<string, string>('clipboard-read-html', type)
            .then(({ payload }) => payload.data);
    }

    /**
     * Writes data into the clipboard as Rtf
     * @param { WriteRequestType } writeObj This object is described in the WriteRequestType typedef
     * @return {Promise.<void>}
    */
    public writeRtf(writeObj: WriteRequestType): Promise<void> {
        return this.wire.sendAction('clipboard-write-rtf', writeObj).then(() => undefined);
    }

    /**
     * Read the content of the clipboard as Rtf
     * @param { string } type Clipboard Type
     * @return {Promise.<string>}
    */
    public readRtf(type?: string): Promise<string> {
        return this.wire.sendAction<string, string>('clipboard-read-rtf', type)
            .then(({ payload }) => payload.data);
    }

    /**
     * Writes data into the clipboard
     * @param { WriteRequestType } writeObj This object is described in the WriteRequestType typedef
     * @return {Promise.<void>}
    */
    public write(writeObj: WriteAnyRequestType): Promise<void> {
        return this.wire.sendAction('clipboard-write', writeObj).then(() => undefined);
    }

    /**
     * Reads available formats for the clipboard type
     * @param { string } type Clipboard Type
     * @return {Promise.Array.<string>}
    */
    public getAvailableFormats(type?: string): Promise<Array<string>> {
        return this.wire.sendAction<string[], string>('clipboard-read-formats', type)
            .then(({ payload }) => payload.data);
    }
}
