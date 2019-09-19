import { Identity } from "../../main";
import { ResizableView } from "./resizable-view";
import * as path from 'path';
declare var fin: any;
declare var GoldenLayout: any;


export default class Layout {
    private layout: any;
    private isDragging: boolean;

    constructor(config: LayoutConfig, container: HTMLElement) {
        this.render = this.render.bind(this);
        // this.save = this.save.bind(this);
        // this.restore = this.restore.bind(this);
        // this.restoreDefault = this.restoreDefault.bind(this);
        // this.getStorageKey = this.getStorageKey.bind(this);
        // this.getDefaultConfig = this.getDefaultConfig.bind(this);
        // this.createChannelConnections = this.createChannelConnections.bind(this);
        // this.generateLayoutConfig = this.generateLayoutConfig.bind(this);
        // this.getBrowserViewComponent = this.getBrowserViewComponent.bind(this);
        this.isDragging = false;

        this.injectLayoutStyles();
        this.initGoldenLayout(config, container);
        this.registerViewComponent();

        // this.createChannelConnections();
        this.render();
    }

    initGoldenLayout(config: LayoutConfig, container: HTMLElement) {
        this.layout = new GoldenLayout(config, container);
    }

    registerViewComponent() {
        this.layout.registerComponent( 'browserView', function( container: HTMLElement, componentState: ComponentState ){
            return { componentState, container };
        });
    }

    //TODO: get better names around this.
    // async createChannelConnections () {
    //     const { identity } = fin.Window.getCurrentSync();
    //     const channelName = `${identity.uuid}-${identity.name}-custom-frame`;
    //     this.client = await getClient();

    //     //TODO: reusing the same name is al sorts of wrong for this thing...do something else.
    //     this.client.register('add-view', async (viewConfig) => {

    //         const content = {
    //             type: 'component',
    //             componentName: 'browserView',
    //             componentState: viewConfig
    //         };

    //         console.log('adding stuf');
    //         console.log(this.layout.root.contentItems[ 0 ].addChild(content));

    //         var bv = this.getBrowserViewComponent(viewConfig.identity);
    //         const rView = new ResizableView(bv.componentState);
    //         rView.renderIntoComponent(bv);

    //         return content;
    //     });

    //     this.client.register('get-views', async () => {
    //         return this.layout.root.getComponentsByName('browserView').map(bv => bv.componentState);
    //     });

    //     this.client.register('remove-view', async(viewConfig) => {
    //         console.log(viewConfig);
    //         var bv = this.getBrowserViewComponent(viewConfig.identity);
    //         await fin.BrowserView.wrapSync(viewConfig.identity).hide();
    //         bv.container.tab.contentItem.remove();
    //     });

    //     await fin.InterApplicationBus.subscribe({ uuid: '*' }, 'should-tab-to', async (identity) => {
    //         const views = this.layout.root.getComponentsByName('browserView').map(bv => bv.componentState);
    //         for (let v of views) {
    //             await moveView(v, fin.Window.getCurrentSync().identity, identity);
    //         }
    //     })
    // }

    getBrowserViewComponent(identity: Identity) {
        return this.layout.root.getComponentsByName('browserView').find((bv: LayoutComponent) => bv.componentState.identity.name === identity.name);
    }

    // getStorageKey() {
    //     const identity = fin.Window.getCurrentSync().identity;
    //     return encodeURI(`${identity.uuid}-${identity.name}-of-gl-state`);
    // }

    setupListeners() {
        const win = fin.Window.getCurrentSync();
        this.layout.on('tabCreated', this.onTabCreated.bind(this));
        this.layout.on('itemDestroyed', this.onItemDestroyed.bind(this));
        this.layout.on('initialised', this.initializeViews.bind(this));
    }

    onTabCreated(tab: any) {
        this.isDragging = false;
        const dragListener = tab._dragListener;
        const identity = tab.contentItem.config.componentState.identity;

        this.injectPopoutButton(tab);
        dragListener.on('drag', this.onTabDrag.bind(this, tab._dragListener, identity));
    }

    injectPopoutButton(tab: any) {

        const popoutButton = this.buildPopoutButton(tab);
        const closeButton = tab.element[0].getElementsByClassName("lm_close_tab")[0];

        tab.element[0].insertBefore(popoutButton, closeButton);
    }

    injectLayoutStyles() {
        var style = document.createElement('style');
        style.innerHTML = `
            .popout-button {
                position: relative;
                right: 0px;
                color: #fff;
                font-weight: bold;
                z-index: 9999;
                padding: 0px 0px 0px 15px;
                margin: 0px auto;
                display: inline-block;
                top: 1px;
            }

            .popout-icon {
                height: 13px;
            }
        `;
        document.getElementsByTagName("head")[0].appendChild(style);
    }

    buildPopoutButton(parentTab: any) {
        const popoutButton = document.createElement('div');
        popoutButton.className = 'popout-button';
        popoutButton.onclick = () => this.onPopooutButtonClick(parentTab);

        const popoutIcon = document.createElement('img');
        popoutIcon.className = 'popout-icon';
        popoutIcon.src = 'https://drive.google.com/uc?export=view&id=1N2_1rzvZ9RPshapjS5Ol-5j_jQhVY7kh';

        popoutButton.appendChild(popoutIcon);
        return popoutButton;
    }

    onPopooutButtonClick(parentTab: any) {
        const viewState = parentTab.contentItem.container.getState();

        const popupLayout = this.generateLayoutConfig(viewState);
        parentTab.contentItem.remove();

        fin.Window.create({
            defaultWidth: 700,
            defaultHeight: 900,
            name: `child-window-${Date.now()}`,
            layout: popupLayout,
            customFrame: true
        });
    }

    onItemDestroyed(e: LayoutComponent) {
        //Need to wait a bit for the view to move (on a drag and drop)
        setTimeout(() => {
            if(e.componentName === 'browserView') {
                const viewCount = this.layout.root.getComponentsByName('browserView').length;
                if(viewCount === 0) {
                    const currWin =  fin.Window.getCurrentSync();
                    currWin.close().catch(console.error);
                }
            }
        }, 100);
    }

    onTabDrag(dragListener: any, tabIdentity: Identity) {
        if(!this.isDragging) {
            this.isDragging = true;

            const allViews = this.layout.root.getComponentsByName('browserView').map((item: any) => item.container.getState().identity);
            allViews.push(tabIdentity); // we have to add currently dragged tab manualy since it's not in the DOM atm
            allViews.forEach((view: Identity) => fin.BrowserView.wrapSync(view).hide());
            const onDragEnd = () => {
                this.isDragging = false;
                allViews.forEach((view: Identity) => fin.BrowserView.wrapSync(view).show());
                dragListener.off('dragStop', onDragEnd);
                this.updateViewTitles();
            }
            dragListener.on('dragStop', onDragEnd);
        }
    }

    attachViews() {
        const browserViews = this.layout.root.getComponentsByName('browserView');
        browserViews.forEach((bv: LayoutComponent) => {
            const rView = new ResizableView(bv.componentState);
            rView.renderIntoComponent(bv);
        });
    }

    async render() {
        //Restore the layout.
        // await this.restore();
        this.setupListeners();
        this.layout.init();

        const win = fin.Window.getCurrentSync();

        win.on('close-requested', async () => {
            // await this.save();
            await win.close(true);
        });
    }

    async initializeViews() {
        this.attachViews();
        //setInterval(this.updateViewTitles.bind(this), 500);
    }

    async updateViewTitles() {
        const allViewWrappers = this.layout.root.getComponentsByName('browserView');
        const allViewIdentities = allViewWrappers.map((item: any) => item.container.getState().identity);
        const allViews = allViewIdentities.map(fin.BrowserView.wrapSync.bind(fin));
        allViews.forEach(async (view: any) => {
            const {title} = await view.getInfo();
            const [item] = this.findViewWrapper(view.identity)
            if(!title || !item) console.error(`couldn't update view's title. view: ${JSON.stringify(view)}. title: ${title}. dom elem: ${item}`)
            else {
                item.container.setTitle(title);
                item.container.getElement()[0].innerHTML = `<div class="wrapper_title">${title}</div>`
            }
        });
    }

    // async save() {
    //     if (this.layout) {
    //         const config = this.layout.toConfig();
    //         if(!config.content || !config.content.length) return;
    //         const state = JSON.stringify(config);
    //         localStorage.setItem(this.getStorageKey(), state);
    //     }
    // }

    findViewWrapper ({name, uuid}: Identity) {
        return this.layout.root.getComponentsByName('browserView')
            .filter( (wrapper: LayoutComponent) =>
                     wrapper.componentState.identity.name === name &&
                     wrapper.componentState.identity.uuid === uuid
                   );
    }

    //TODO: figure out how to iterate over a saved layout to get the browser view information.
    // async restore() {
    //     const savedState = localStorage.getItem(this.getStorageKey());

    //     if (this.layout) {
    //         this.layout.destroy();
    //     }

    //     if (savedState !== null) {
    //         this.layout = new GoldenLayout(JSON.parse(savedState));
    //     } else {
    //         const { customData } = await fin.Window.getCurrentSync().getOptions();
    //         this.layout = new GoldenLayout(customData);
    //     }

    //     this.layout.registerComponent( 'browserView', function( container, componentState ){
    //         return { componentState, container };
    //     });
    // }

    // async restoreDefault() {
    //     localStorage.removeItem(this.getStorageKey());
    //     this.restore();
    // }

    generateLayoutConfig(componentState: ComponentState) {
        return {
            settings: {
                showPopoutIcon: false,
                showMaximiseIcon: false,
                showCloseIcon: false,
                constrainDragToContainer: false
            },
            content: [{
                type: 'row',
                content:[{
                    type: 'stack',
                    content:[{
                        type: 'component',
                        componentName: 'browserView',
                        componentState
                    }]
                }]
            }]
        };
    }
}

export interface LayoutConfig {
    settings?: {
        popoutWholeStack?: boolean;
        constrainDragToContainer?: boolean;
        showPopoutIcon?: boolean;
        showMaximiseIcon?: boolean;
        showCloseIcon?: boolean;
    };
    content: LayoutContent;
}

// export type LayoutContent = (LayoutComponent)[];
export type LayoutContent = (LayoutRow|LayoutColumn|LayoutComponent)[];

export interface LayoutRow {
    type: 'row';
    content: LayoutContent;
}

export interface LayoutColumn {
    type: 'column';
    content: LayoutContent;
}

export interface LayoutStack {
    type: 'stack';
    content: LayoutContent;
}

export interface LayoutComponent {
    type: 'component';
    componentName: string;
    componentState: ComponentState;
}

export interface ComponentState {
    identity: Identity;
    url: string;
};
