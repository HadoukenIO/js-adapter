import { WindowOption, CustomRequestHeaders } from '../window/windowOption';
import { DownloadPreloadOption } from '../system/download-preload';

export interface ApplicationOption {
    disableIabSecureLogging?: boolean;
    loadErrorMessage?: string;
    mainWindowOptions?: WindowOption;
    name?: string;
    nonPersistent?: boolean;
    plugins?: boolean;
    spellCheck?: boolean;
    url?: string;
    uuid: string;
    webSecurity?: boolean;
    // all window options also available in application
    accelerator?: object;
    alwaysOnTop?: boolean;
    api?: object;
    aspectRatio?: number;
    autoShow?: boolean;
    backgroundColor?: string;
    contentNavigation?: object;
    contextMenu?: boolean;
    cornerRounding?: object;
    customData?: string;
    customRequestHeaders?: Array<CustomRequestHeaders>;
    defaultCentered?: boolean;
    defaultHeight?: number;
    defaultLeft?: number;
    defaultTop?: number;
    defaultWidth?: number;
    frame?: boolean;
    hideOnClose?: boolean;
    icon?: string;
    maxHeight?: number;
    maximizable?: boolean;
    maxWidth?: number;
    minHeight?: number;
    minimizable?: boolean;
    minWidth?: number;
    opacity?: number;
    preloadScripts?: Array<DownloadPreloadOption>;
    resizable?: boolean;
    resizeRegion?: object;
    saveWindowState?: boolean;
    shadow?: boolean;
    showTaskbarIcon?: boolean;
    smallWindow?: boolean;
    state?: string;
    taskbarIconGroup?: string;
    waitForPageLoad?: boolean;
}
