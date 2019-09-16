//tslint:disable
/* todo IMPORTANT PLEASE READ!
 * Make sure any edits to the Table of Contents in the following jsdoc comment are also made to both:
 * 1. docs home page (/docs.README.md)
 * 2. App config web page (https://openfin.co/documentation/application-config/)
 */

const InterApplicationBus: any = {};

/**
 * @namespace
 * @desc The Channel namespace allows an OpenFin application to create a channel as a {@link Channel#ChannelProvider ChannelProvider},
 * or connect to a channel as a {@link Channel#ChannelClient ChannelClient}. The "handshake" between the communication partners is
 * simplified when using a channel.  A request to connect to a channel as a client will return a promise that resolves if/when the channel has been created. Both the
 * provider and client can dispatch actions that have been registered on their opposites, and dispatch returns a promise that resolves with a payload from the other
 * communication participant. There can be only one provider per channel, but many clients.  Version `9.61.35.*` or later is required for both communication partners.
 *
 * ##### Synchronous Methods
 *  * {@link InterApplicationBus.Channel.onChannelConnect onChannelConnect(ConnectionListener)}
 *  * {@link InterApplicationBus.Channel.onChannelDisconnect onChannelDisconnect(ConnectionListener)}
 *
 * ##### Asynchronous Methods
 *  * {@link InterApplicationBus.Channel.create create(channelName)}
 *  * {@link InterApplicationBus.Channel.connect connect(channelName, options)}
 */
//tslint:disable-next-line
InterApplicationBus.Channel = function() {};

/**
 *
 * Create a new channel.  Returns a promise that resolves with a {@link Channel#ChannelProvider ChannelProvider} instance for your channel.
 * You must provide a unique channelName.  If a channelName is not provided, or it is not unique, the creation will fail.
 * @param {string} channelName - Name of the channel to be created.
 * @returns {Promise<Channel#ChannelProvider>} Returns promise that resolves with an instance of {@link Channel#ChannelProvider ChannelProvider}.
 * @tutorial Channel.create
 */
InterApplicationBus.Channel.create = function () { }

/**
 *
 * Connect to a channel.  Returns a promise for a {@link Channel#ChannelClient ChannelClient} instance for that channel.
 * If you wish to send a payload to the provider, add a payload property to the options argument.
 * @param {string} channelName - Name of the target channel.
 * @param {InterApplicationBus.Channel~ConnectOptions} options - Connection options.
 * @returns {Promise<Channel#ChannelClient>} Returns promise that resolves with an instance of {@link Channel#ChannelClient ChannelClient}.
 * @tutorial Channel.connect

 */
InterApplicationBus.Channel.connect = function (options:any) { }

/**
 *
 * Listens for channel connections.
 * @param {InterApplicationBus.Channel~ConnectionEvent} listener - callback to execute.
 * @returns {Promise<void>}
 * @tutorial Channel.onChannelConnect
 */
InterApplicationBus.Channel.onChannelConnect = function () { }

/**
 *
 * Listen for channel disconnections.
 * @param {InterApplicationBus.Channel~ConnectionEvent} listener - callback to execute.
 * @returns {Promise<void>}
 * @tutorial Channel.onChannelDisconnect
 */
InterApplicationBus.Channel.onChannelDisconnect = function () { }

/**
 * Instance created to enable use of a channel as a provider.  Allows for communication with the {@link Channel#ChannelClient ChannelClients} by invoking an action on
 * a single client via {@link Channel#ChannelProvider#dispatch dispatch} or all clients via {@link Channel#ChannelProvider#publish publish}
 * and to listen for communication from clients by registering an action via {@link Channel#ChannelProvider#register register}.
 *
 * ##### Constructor
 *
 * Returned by {@link Channel.create Channel.create}.
 *
 * ##### Synchronous Methods
 *  * {@link Channel#ChannelProvider#destroy destroy()}
 *  * {@link Channel#ChannelProvider#publish publish(action, payload)}
 *  * {@link Channel#ChannelProvider#register register(action, listener)}
 *  * {@link Channel#ChannelProvider#remove remove(action)}
 *
 * ##### Asynchronous Methods
 *  * {@link Channel#ChannelProvider#dispatch dispatch(to, action, payload)}
 *
 * ##### Middleware
 * Middleware functions receive the following arguments: (action, payload, senderId).
 * The return value of the middleware function will be passed on as the payload from beforeAction, to the action listener, to afterAction
 * unless it is undefined, in which case the most recently defined payload is used.  Middleware can be used for side effects.
 *  * {@link Channel#ChannelProvider#setDefaultAction setDefaultAction(middleware)}
 *  * {@link Channel#ChannelProvider#onError onError(middleware)}
 *  * {@link Channel#ChannelProvider#beforeAction beforeAction(middleware)}
 *  * {@link Channel#ChannelProvider#afterAction afterAction(middleware)}
 *
 * @memberof! Channel#
 * @hideconstructor
 */
class ChannelProvider {

    constructor() {}

    /**
    *
    * Destroy the channel.
    * @returns {Promise<void>}
    * @tutorial ChannelProvider.destroy
    */

   destroy() { }

    /**
     *
     * Dispatch an action to a specified client. Returns a promise for the result of executing that action on the client side.
     * @param {Identity} to - Identity of the target client.
     * @param {string} action - Name of the action to be invoked by the client.
     * @param {*} payload - Payload to be sent along with the action.
     * @returns {Promise<any>}
     * @tutorial Channel.dispatch
     */
    dispatch() { }

    /**
    *
    * Register an action to be called
    * @param {string} action - Name of the action to be registered for channel clients to later invoke.
    * @param {Action} listener - Function representing the action to be taken on a client dispatch.
    * @returns {boolean} - Boolean representing the successful registration of the action.
    * @tutorial Channel.register
    */
    register() { }

    /**
     *
     * Publish an action and payload to every connected client.
     * Synchronously returns an array of promises for each action (see dispatch).
     * @param {string} action
     * @param {*} payload
     * @returns {Array<Promise<any>>}
     * @tutorial ChannelProvider.publish
     */
    publish() { }

    /**
     *
     * Register a listener that is called on every new client connection.
     * It is passed the identity of the connecting client and a payload if it was provided to {@link Channel.connect}.
     * If you wish to reject the connection, throw an error.  Be sure to synchronously provide an onConnection upon receipt of the channelProvider
     * to ensure all potential client connections are caught by the listener.
     * @param {Channel#ChannelProvider~ConnectionListener} listener
     * @returns {void}
     * @tutorial ChannelProvider.onConnection
     */
    onConnection() { }

    /**
     *
     * Register a listener that is called on every new client disconnection.
     * It is passed the disconnection event of the disconnecting client.
     * @param {InterApplicationBus.Channel~ConnectionEvent} listener
     * @returns {void}
     * @tutorial Channel.onDisconnection
     */
    onDisconnection() { }

    /**
     *
     * Register middleware that fires before the action.
     * @param {Channel#ChannelProvider~Middleware} middleware - Function to be executed before invoking the action.
     * @returns {void}
     * @tutorial ChannelMiddleware.beforeAction
     */
    beforeAction() { }

    /**
     *
     * Register an error handler. This is called before responding on any error.
     * @param {function} middleware - Function to be executed in case of an error.
     * @returns {void}
     * @tutorial ChannelMiddleware.onError
     */
    onError() { }

    /**
     *
     * Register middleware that fires after the action.  This is passed the return value of the action.
     * @param {Channel#ChannelProvider~Middleware} middleware - Function to be executed after invoking the action.
     * @returns {void}
     * @tutorial ChannelMiddleware.afterAction
     */
    afterAction() { }

    /**
     *
     * Remove an action by action name.
     * @param {string} action - Name of the action to be removed.
     * @returns {void}
     * @tutorial Channel.remove
     */
    remove() { }

    /**
     *
     * Sets a default action. This is used any time an action that has not been registered is invoked.
     * Default behavior if not set is to throw an error.
     * @param {Channel#ChannelProvider~Middleware} middleware - Function to be executed when a client invokes an action name that has not been registered.
     * @returns {void}
     * @tutorial ChannelMiddleware.setDefaultAction
     */
    setDefaultAction() { }
}

/**
 * Instance created to enable use of a channel as a client.  Allows for communication with the
 * {@link Channel#ChannelProvider ChannelProvider} by invoking an action on the
 * provider via {@link Channel#ChannelClient#dispatch dispatch} and to listen for communication
 * from the provider by registering an action via {@link Channel#ChannelClient#register register}.
 *
 * ##### Constructor
 * Returned by {@link Channel.connect Channel.connect}.
 *
 * ##### Synchronous Methods
 *  * {@link Channel#ChannelClient#disconnect disconnect()}
 *  * {@link Channel#ChannelClient#register register(action, listener)}
 *  * {@link Channel#ChannelClient#remove remove(action)}
 *
 * ##### Asynchronous Methods
 *  * {@link Channel#ChannelClient#dispatch dispatch(action, payload)}
 *
 * ##### Middleware
 * Middleware functions receive the following arguments: (action, payload, senderId).
 * The return value of the middleware function will be passed on as the payload from beforeAction, to the action listener, to afterAction
 * unless it is undefined, in which case the original payload is used.  Middleware can be used for side effects.
 *  * {@link Channel#ChannelClient#setDefaultAction setDefaultAction(middleware)}
 *  * {@link Channel#ChannelClient#onError onError(middleware)}
 *  * {@link Channel#ChannelClient#beforeAction beforeAction(middleware)}
 *  * {@link Channel#ChannelClient#afterAction afterAction(middleware)}
 *
 * @hideconstructor
 * @memberof! Channel#
 */
class ChannelClient {

    constructor() {}

    /**
    *
    * Disconnect from the channel.
    * @tutorial Channel.disconnect
    * @returns {Promise<void>}
    */
   disconnect() { }

    /**
     *
     * Dispatch the given action to the channel provider.  Returns a promise that resolves with the response from the provider for that action.
     * @param {string} action - Name of the action to be invoked by the channel provider.
     * @param {*} payload - Payload to be sent along with the action.
     * @tutorial Channel.dispatch
     * @returns {Promise<any>}
     */
    dispatch() { }

    /**
    *
    * Register an action to be called by the provider of the channel.
    * @param {string} action - Name of the action to be registered for the channel provider to later invoke.
    * @param {Action} listener - Function representing the action to be taken on a provider dispatch.
    * @returns {Boolean}
    * @tutorial Channel.register
    */
    register() { }

    /**
     *
     * Register middleware that fires before the action.
     * @param {Channel#ChannelClient~Middleware} middleware - Function to be executed before invoking the action.
     * @returns {void}
     * @tutorial ChannelMiddleware.beforeAction
     */
    beforeAction() { }

    /**
     *
     * Register a listener that is called on channel disconnection.
     * It is passed the disconnection event of the disconnecting channel.
     * @param {InterApplicationBus.Channel~ConnectionEvent} listener
     * @returns {void}
     * @tutorial Channel.onDisconnection
     */
    onDisconnection() { }

    /**
     * Register an error handler. This is called before responding on any error.
     * @param {function} middleware - Function to be executed in case of an error.
     * @returns {void}
     * @tutorial ChannelMiddleware.onError
     */
    onError() { }

    /**
     *
     * Register middleware that fires after the action.  This is passed the return value of the action.
     * @param {Channel#ChannelClient~Middleware} middleware - Function to be executed after invoking the action.
     * @returns {void}
     * @tutorial ChannelMiddleware.afterAction
     */
    afterAction() { }

    /**
     *
     * Remove an action by action name.
     * @param {string} action - Name of the action to be removed.
     * @returns {void}
     * @tutorial Channel.remove
     */
    remove() { }

    /**
     *
     * Sets a default action. This is used any time an action that has not been registered is invoked.
     * Default behavior if not set is to throw an error.
     * @param {Channel#ChannelClient~Middleware} middleware - Function to be executed when a client invokes an action name that has not been registered.
     * @returns {void}
     * @tutorial ChannelMiddleware.setDefaultAction
     */
    setDefaultAction() { }
}

/**
 * Channel action callback signature
 * @callback Channel#ChannelProvider~Action
 * @param {any} payload - Payload sent along with the message.
 * @param {Identity} identity - Identity of the sender.
*/
/**
 * Channel action callback signature
 * @callback Channel#ChannelClient~Action
 * @param {any} payload - Payload sent along with the message.
 * @param {Identity} identity - Identity of the sender.
*/
/**
 * Middleware function signature
 * @callback Channel#ChannelProvider~Middleware
 * @param {string} action - Action to be invoked.
 * @param {any} payload - Payload sent along with the message (or error for error middleware).
 * @param {Identity} identity - Identity of the sender.
*/
/**
 * Middleware function signature
 * @callback Channel#ChannelClient~Middleware
 * @param {string} action - Action to be invoked.
 * @param {any} payload - Payload sent along with the message.
 * @param {Identity} identity - Identity of the sender.
*/
/**
 * Callback for the channel onConnection or onDisconnection. If it errors connection will be rejected.
 * @callback Channel#ChannelProvider~ConnectionListener
 * @param {Identity} identity - Identity of the client attempting to connect to the channel.
 * @param {any} payload - Payload sent with connection request.
*/
/**
 * Callback for onChannelConnect or onChannelDisconnect.
 * @typedef {object} InterApplicationBus.Channel~ConnectionEvent
 * @property {string} channelId - Identifier of the channel.
 * @property {string} uuid - Channel provider uuid.
 * @property {string} [name] - Channel provider name.
 * @property {string} channelName - Name of the channel.
 */

/**
 * Options provided on a client connection to a channel.
 * @typedef {object} InterApplicationBus.Channel~ConnectOptions
 * @property {any} [payload] - Payload to pass to ChannelProvider onConnection action.
 * @property {boolean} [wait=true] - If true will wait for ChannelProvider to connect. If false will fail if ChannelProvider is not found.
 *
 */
