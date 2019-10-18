import { Channel } from './interappbus/channel/index';
import { ChannelClient } from './interappbus/channel/client';
import { Identity } from '../identity';

let channel: Channel;
let client: ChannelClient;

export class LayoutsModule {
    constructor(Channel: Channel) {
        channel = Channel;
    }

    public async getClient() {
        if (!client) {
            try {
                client = await channel.connect('custom-frame', {wait: false});
            } catch (e) {
                // FIX ME WITH BETTER CONSOLE ERROR;
                throw new Error('Not part of a layout');
            }
        }

        return client;
    };

    public async createWindow(layoutConfig: any) {
        const client = await this.getClient();

        const createWindowOptions = {
            options: {
                defaultWidth: 700,
                defaultHeight: 900,
                name: `child-window-${Date.now()}`
            },
            layoutConfig
        };
        return await client.dispatch('create-view-container', createWindowOptions);
    };

    public async attachView(viewConfig: any, target: Identity) {
        const client = await this.getClient();

        return client.dispatch('add-view', {
            target,
            opts: viewConfig
        });
    };

    public async getWindowViews(target: Identity) {
        const client = await this.getClient();

        return client.dispatch('get-views', {
            target,
            opts: {}
        });
    };

    public async closeView(viewConfig: any, target: Identity) {
        const client = await this.getClient();

        return client.dispatch('remove-close-view', {
            target,
            opts: viewConfig
        });
    };

    public async closeLayout() {
        const client = await this.getClient();

        return client.dispatch('close-layout');
    };

    public async reparentView(viewConfig: any, sourceWindow: Identity, destinationWindow: Identity) {
        const client = await this.getClient();

        await client.dispatch('remove-view', {
            target: sourceWindow,
            opts: viewConfig
        });
        await this.attachView(viewConfig, destinationWindow);
    };

    public async getAllWindows() {
        const client = await this.getClient();

        return client.dispatch('get-all-windows');
    };

    public async getAllViews() {
        const client = await this.getClient();

        return client.dispatch('get-all-views');
    };

    public async getSnapshot() {
        const client = await this.getClient();

        return client.dispatch('get-snapshot');
    };

    public async applySnapshot(snapshot: any) {
        const client = await this.getClient();

        return client.dispatch('apply-snapshot', snapshot);
    };
}