import { Directive, HostListener, Input } from '@angular/core';
import { Popup } from '../popup';

@Directive({
  selector: '[resize]'
})
export class ResizeingDirective {

  @Input() element: HTMLElement
  @Input() resizeType: "xr" | "xl" | "yt" | "yb" | "xyrt" | "xyrb" | "xylb" | "xylt" | "xylbTouch" | "xylblTouch"
  @Input() resizeControl: { maxWidth: number, maxHeight: number, minWidth: number, minHeight: number }
  elArea: { width: number, height: number } = { width: 0, height: 0 }
  resizeArea: { width: number, height: number } = { width: 0, height: 0 }
  canResize: boolean = false
  elLastArea: { width: number, height: number } = { width: 0, height: 0 }
  constructor(private popup: Popup) { }
  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  mouseDown(event) {
    let width = 0;
    let height = 0;
    if (event.which === 1 && event.type === 'mousedown') {
      switch (this.resizeType) {
        case "xr": {
          this.elArea.width = this.element.offsetWidth
          this.elArea.width = event.clientX - this.elArea.width

          break;
        }
        case "xl": {
          this.elLastArea.width = this.element.offsetWidth
          this.elArea.width = 0
          this.elArea.width = event.clientX - this.elArea.width
          break;
        }
        case "yb": {
          this.elArea.height = this.element.offsetHeight
          this.elArea.height = event.clientY - this.elArea.height

          break;
        }
        case "yt": {
          this.elLastArea.height = this.element.offsetHeight
          this.elArea.height = 0
          this.elArea.height = event.clientY - this.elArea.height
          break;
        }
        case "xylt": {
          this.elLastArea.width = this.element.offsetWidth
          this.elArea.width = 0
          this.elArea.width = event.clientX - this.elArea.width
          this.elLastArea.height = this.element.offsetHeight
          this.elArea.height = 0
          this.elArea.height = event.clientY - this.elArea.height
          break;
        }
        case "xylb": case "xylblTouch": {
          this.elLastArea.width = this.element.offsetWidth
          this.elArea.width = 0
          this.elArea.width = event.clientX - this.elArea.width
          this.elArea.height = this.element.offsetHeight
          this.elArea.height = event.clientY - this.elArea.height
          break;
        }
        case "xyrt": {
          this.elArea.width = this.element.offsetWidth
          this.elArea.width = event.clientX - this.elArea.width
          this.elLastArea.height = this.element.offsetHeight
          this.elArea.height = 0
          this.elArea.height = event.clientY - this.elArea.height
          break;
        }

        case "xyrb": case "xylbTouch": {
          this.elArea.width = this.element.offsetWidth
          this.elArea.width = event.clientX - this.elArea.width
          this.elArea.height = this.element.offsetHeight
          this.elArea.height = event.clientY - this.elArea.height
          break;
        }

      }
      this.canResize = true;

    }
    if (event.type === 'touchstart' && event.targetTouches.length == 1) {
      if (this.resizeType === "xylbTouch") {
        this.elArea.width = this.element.offsetWidth
        this.elArea.width = event.changedTouches[0].clientX - this.elArea.width
        this.elArea.height = this.element.offsetHeight
        this.elArea.height = event.changedTouches[0].clientY - this.elArea.height
        this.canResize = true;

      }
      if (this.resizeType === 'xylblTouch') {
        this.elLastArea.width = this.element.offsetWidth
        this.elArea.width = 0
        this.elArea.width = event.changedTouches[0].clientX - this.elArea.width
        this.elArea.height = this.element.offsetHeight
        this.elArea.height = event.changedTouches[0].clientY - this.elArea.height
        this.canResize = true;
      }
    }

  }

  @HostListener('document:touchend', ['$event'])
  @HostListener('document:mouseup', ['$event'])
  mouseUp(event) {
    this.canResize = false
    switch (this.resizeType) {
      case "xr": {
        this.elArea.width = this.resizeArea.width
        break;
      }
      case "xl": {
        this.elArea.width = 0
        break;
      }
      case "yb": {
        this.elArea.height = this.resizeArea.height
        break;
      }
      case "yb": {
        this.elArea.height = 0
        break;
      }
    }


  }

  @HostListener('document:touchmove', ['$event'])
  @HostListener('document:mousemove', ['$event'])
  mouseMove(event) {
    const maxDragHeight = this.popup.popupListMinimize.length > 0 ? document.body.offsetHeight - 45 : document.body.offsetHeight
    if (this.canResize && event.type === 'mousemove' && event.clientX > 0 &&
      event.clientY > 0 && maxDragHeight > event.clientY &&
      document.body.offsetWidth > event.clientX) {
      switch (this.resizeType) {
        case "xr": {
          this.resizeArea.width = event.clientX - this.elArea.width
          if ((this.resizeArea.width < this.resizeControl.maxWidth) && (this.resizeArea.width > this.resizeControl.minWidth)) {
            this.element.style.width = this.resizeArea.width + 'px'
          }

          break;
        }
        case "xl": {
          const width = this.elLastArea.width + this.elArea.width - event.clientX
          if ((width < this.resizeControl.maxWidth) && (width > this.resizeControl.minWidth)) {
            this.element.style.width = width + 'px'
            this.element.style.left = event.clientX + 'px'
          }
          break;
        }
        case "yb": {

          this.resizeArea.height = event.clientY - this.elArea.height
          if ((this.resizeArea.height < this.resizeControl.maxHeight) && (this.resizeArea.height > this.resizeControl.minHeight)) {
            this.element.style.height = this.resizeArea.height + 'px'
          }

          break;
        }
        case "yt": {
          const height = this.elLastArea.height + this.elArea.height - event.clientY
          if ((height < this.resizeControl.maxHeight) && (height > this.resizeControl.minHeight)) {
            this.element.style.height = height + 'px'
            this.element.style.top = event.clientY + 'px'
          }
          break;
        }
        case "xylt": {
          const width = this.elLastArea.width + this.elArea.width - event.clientX
          const height = this.elLastArea.height + this.elArea.height - event.clientY
          if ((width < this.resizeControl.maxWidth) && (width > this.resizeControl.minWidth)) {
            this.element.style.width = width + 'px'
            this.element.style.left = event.clientX + 'px'
          }
          if ((height < this.resizeControl.maxHeight) && (height > this.resizeControl.minHeight)) {
            this.element.style.height = height + 'px'
            this.element.style.top = event.clientY + 'px'
          }
          break;
        }
        case "xylb": case "xylblTouch": {
          const width = this.elLastArea.width + this.elArea.width - event.clientX
          if ((width < this.resizeControl.maxWidth) && (width > this.resizeControl.minWidth)) {
            this.element.style.width = width + 'px'
            this.element.style.left = event.clientX + 'px'
          }

          this.resizeArea.height = event.clientY - this.elArea.height
          if ((this.resizeArea.height < this.resizeControl.maxHeight) && (this.resizeArea.height > this.resizeControl.minHeight)) {
            this.element.style.height = this.resizeArea.height + 'px'
          }
          break;
        }
        case "xyrt": {
          this.resizeArea.width = event.clientX - this.elArea.width
          if ((this.resizeArea.width < this.resizeControl.maxWidth) && (this.resizeArea.width > this.resizeControl.minWidth)) {
            this.element.style.width = this.resizeArea.width + 'px'
          }
          const height = this.elLastArea.height + this.elArea.height - event.clientY
          if ((height < this.resizeControl.maxHeight) && (height > this.resizeControl.minHeight)) {
            this.element.style.height = height + 'px'
            this.element.style.top = event.clientY + 'px'
          }
          break;
        }

        case "xyrb": case "xylbTouch": {
          this.resizeArea.width = event.clientX - this.elArea.width
          if ((this.resizeArea.width < this.resizeControl.maxWidth) && (this.resizeArea.width > this.resizeControl.minWidth)) {
            this.element.style.width = this.resizeArea.width + 'px'
          }
          this.resizeArea.height = event.clientY - this.elArea.height
          if ((this.resizeArea.height < this.resizeControl.maxHeight) && (this.resizeArea.height > this.resizeControl.minHeight)) {
            this.element.style.height = this.resizeArea.height + 'px'
          }
          break;
        }
      }
      this.popup.setChange({ width: this.element.offsetWidth, height: this.element.offsetHeight, x: parseInt(this.element.style.left), y: parseInt(this.element.style.top), id: this.element.id })
    }
    if (this.canResize && event.type === 'touchmove' && event.targetTouches.length == 1 && event?.changedTouches[0]?.clientX > 0 &&
      event?.changedTouches[0]?.clientY > 0 && maxDragHeight > event?.changedTouches[0]?.clientY &&
      document.body.offsetWidth > event?.changedTouches[0]?.clientX) {
      if (this.resizeType === "xylbTouch") {

        this.resizeArea.width = event.changedTouches[0].clientX - this.elArea.width
        if ((this.resizeArea.width < this.resizeControl.maxWidth) && (this.resizeArea.width > this.resizeControl.minWidth)) {
          this.element.style.width = this.resizeArea.width + 'px'
        }
        this.resizeArea.height = event.changedTouches[0].clientY - this.elArea.height
        if ((this.resizeArea.height < this.resizeControl.maxHeight) && (this.resizeArea.height > this.resizeControl.minHeight)) {
          this.element.style.height = this.resizeArea.height + 'px'
        }
      }
      if (this.resizeType === 'xylblTouch') {
        const width = this.elLastArea.width + this.elArea.width - event.changedTouches[0].clientX
        this.resizeArea.height = event.changedTouches[0].clientY - this.elArea.height
        if ((width < this.resizeControl.maxWidth) && (width > this.resizeControl.minWidth)) {
          this.element.style.width = width + 'px'
          this.element.style.left = event.changedTouches[0].clientX + 'px'
        }
        if ((this.resizeArea.height < this.resizeControl.maxHeight) && (this.resizeArea.height > this.resizeControl.minHeight)) {
          this.element.style.height = this.resizeArea.height + 'px'
        }
      }
      this.popup.setChange({ width: this.element.offsetWidth, height: this.element.offsetHeight, x: parseInt(this.element.style.left), y: parseInt(this.element.style.top), id: this.element.id })

    }
  }
}
