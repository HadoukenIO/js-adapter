type tween = 'linear' |
    'ease-in' |
    'ease-out' |
    'ease-in-out' |
    'ease-in-quad' |
    'ease-out-quad' |
    'ease-in-out-quad' |
    'ease-in-cubic' |
    'ease-out-cubic' |
    'ease-in-out-cubic' |
    'ease-out-bounce' |
    'ease-in-back' |
    'ease-out-back' |
    'ease-in-out-back' |
    'ease-in-elastic' |
    'ease-out-elastic' |
    'ease-in-out-elastic';

export interface TransitionBase {
    duration: number;
    relative?: boolean;
}

export interface Opacity extends TransitionBase {
    opacity: number;
}

export interface Position extends TransitionBase {
    left: number;
    top: number;
}

export interface Size extends TransitionBase {
    width: number;
    height: number;
}

export interface TransitionOptions {
    interrupt: boolean;
    tween?: string;
}

export interface Transition {
    opacity?: Opacity;
    position?: Position;
    size?: Size;
}
