import Fin from './api/fin';
import { currentWindowIdentity } from './util/of-renderer-api';
import {default as Transport} from './transport/transport';
import ElIPCTransport from './transport/elipc';

declare var window: any;
const transport = new Transport(ElIPCTransport);
transport.connectSync(Object.assign({}, currentWindowIdentity));
window.fin = Object.assign(window.fin, new Fin(transport, null));
