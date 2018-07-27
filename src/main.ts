import Fin from './api/fin';
import { Application } from './api/application/application';
import { _Window as Window } from './api/window/window';
import { _Frame as Frame } from './api/frame/frame';
import { _Notification as Notification } from './api/notification/notification';
import System from './api/system/system';
import { ConnectConfig, isPortDiscoveryConfig } from './transport/wire';
import { default as NodeEnvironment } from './environment/node-env';

import { default as Transport } from './transport/transport';
import WebSocketTransport from './transport/websocket';
import { PortDiscovery } from './transport/port-discovery';
import { normalizeConfig, validateConfig } from './util/normalize-config';

const environment = new NodeEnvironment();
// Connect to an OpenFin Runtime
export async function connect(config: ConnectConfig): Promise<Fin> {
    const wire: Transport = new Transport(WebSocketTransport, environment);
    const normalized = await validateConfig(config);
    await wire.connect(normalized);
    return new Fin(wire);
}

export async function launch(config: ConnectConfig): Promise<number> {
   const normalized = await normalizeConfig(config);
   if (!isPortDiscoveryConfig(normalized)) {
       throw new Error('Invalid Config');
   }
   const pd = new PortDiscovery(normalized, environment);
   return pd.retrievePort();
}

export { Identity } from './identity'
export { Fin, Application, Window, System , Frame, Notification};
