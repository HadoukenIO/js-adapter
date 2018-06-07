import { EmitterBase } from '../base';
import Transport from '../../transport/transport';

const enum apiActions {
    REGISTER = 'global-hotkey-register',
    UNREGISTER = 'global-hotkey-unregister',
    UNREGISTER_ALL = 'global-hotkey-unregister-all',
    IS_REGISTERED = 'global-hotkey-is-registered'
}

/**
 * The GlobalHotkey module can register/unregister a global hotkeys.
 * @namespace
 */
export default class GlobalHotkey extends EmitterBase {

    constructor(wire: Transport) {
        super(wire);
        this.topic = 'global-hotkey';
    }

    /**
     * Registers a global hotkey with the operating system.
     * @return {Promise.<void>}
     * @tutorial GlobalHotkey.register
     */
    public async register(hotkey: string, listener: (...args: any[]) => void): Promise<void> {
        this.emitter.on(hotkey, listener);
        await this.wire.sendAction(apiActions.REGISTER, { hotkey });
        return void 0;
    }

    /**
     * Unregisters a global hotkey with the operating system.
     * @return {Promise.<void>}
     * @tutorial GlobalHotkey.unregister
     */
    public async unregister(hotkey: string): Promise<void> {
        this.emitter.removeAllListeners(hotkey);
        await this.wire.sendAction(apiActions.UNREGISTER, { hotkey });
        return void 0;
    }

    /**
     * Unregisters all global hotkeys for the current application.
     * @return {Promise.<void>}
     * @tutorial GlobalHotkey.unregisterAll
     */
    public async unregisterAll(): Promise<void> {
        this.emitter.removeAllListeners();
        await this.wire.sendAction(apiActions.UNREGISTER_ALL, {});
        return void 0;
    }

    /**
     * Checks if a given hotkey has been registered
     * @return {Promise.<bookean>}
     * @tutorial GlobalHotkey.isRegistered
     */
    public async isRegistered(hotkey: string): Promise<boolean> {
        const { payload: { data }} = await this.wire.sendAction(apiActions.IS_REGISTERED, { hotkey });
        return data;
    }
}
