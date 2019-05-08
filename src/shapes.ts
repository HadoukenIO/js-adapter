export type AnchorType = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface Bounds {
  height: number;
  width: number;
  top: number;
  left: number;
  right?: number;
  bottom?: number;
}

export type RGB = { red: number, blue: number, green: number };

export type ContextMenuSettings = {enable?: boolean, devtools?: boolean, reload?: boolean};