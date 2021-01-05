export interface PopupModel {
    maxWidth?: number;
    maxHeight?: number;
    minwidth?: number;
    minHeight?: number;
    theme?: "primary" | "accent" | "light" | "dark";
    styleClass?: string;
    position?: { x: number, y: number } | "center" | "top" | "right" | "left" | "bottom" | "top_right" | "top_left" | "bottom_left" | "bottom_right";
    resizable: boolean | "width" | "height";
    dragable: boolean | "x" | "y";
    beforeCloseCallBack: boolean;
    // toolbar: boolean;
    toolbarAction: boolean;
    multiPopup: boolean;
    overlayBlur?: boolean;
    type?: any;
    data?: any;
    headerTitle?: string;
    icon?: string;
    width?: number;
    height?: number;
}