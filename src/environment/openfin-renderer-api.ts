declare var fin: any;

//TODO: IPC gets deleted by the javascript adapter at the moment.
export const ipc = fin.__internal_.ipc;
export const routingId = fin.__internal_.routingId;
export const CORE_MESSAGE_CHANNEL = fin.__internal_.ipcconfig.channels.CORE_MESSAGE;
export const outboundTopic = 'of-window-message';
export const inboundTopic = `${CORE_MESSAGE_CHANNEL}-${routingId}`;
export const currentWindowIdentity = fin.__internal_.getWindowIdentity();
