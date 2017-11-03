import Fin from './api/fin';
import { currentWindowIdentity } from './environment/openfin-renderer-api';
import {default as Transport} from './transport/transport';
import ElIPCTransport from './transport/elipc';
import { default as OpenFinEnvironment } from './environment/openfin-env';

declare var window: any;

const environment = new OpenFinEnvironment();
const transport = new Transport(ElIPCTransport, environment);
transport.connectSync(Object.assign({}, currentWindowIdentity));
window.fin = Object.assign(window.fin, new Fin(transport, null));
