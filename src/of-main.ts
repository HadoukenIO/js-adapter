import Fin from './api/fin';
import { Application } from './api/application/application';
import { _Window as Window } from './api/window/window';
import System from './api/system/system';

import {default as Transport, ConnectConfig} from './transport/transport';
import ElIPCTransport from './transport/elipc';
declare var window: any;

const wire = new Transport(ElIPCTransport);
wire.connectSync();
window.fin = Object.assign(window.fin, new Fin(wire, null));
