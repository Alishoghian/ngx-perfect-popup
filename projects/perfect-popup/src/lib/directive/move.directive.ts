import { Directive, HostListener, Input } from '@angular/core';
import { NgxPerfectPopup } from '../ngx-perfect-popup';

@Directive({
  selector: '[Move]'
})
export class MoveDirective {
  @Input() element: HTMLElement
  @Input() defualtPositon: { x: number, y: number }
  @Input() reset: boolean
  copyEl
  positon: { x: number, y: number } = { x: 0, y: 0 }
  dragPositon: { x: number, y: number } = { x: 0, y: 0 }
  canDrag: boolean = false;
  area: { changeSize: boolean, width: number, height: number } = { changeSize: false, width: 0, height: 0 }
  @Input() dragable: boolean
  @Input() fullScreen: boolean = false
  zIndex = ''
  constructor(private popup: NgxPerfectPopup) { }
  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    if (!this.dragable) { return }
    if (!this.fullScreen) {
      this.element.style.cursor = 'unset !important'
    }
    if (!this.fullScreen) {
      this.positon.x = parseInt(this.element.style.left)
      this.positon.y = parseInt(this.element.style.top)
      this.element.style.boxShadow = 'rgba(0, 0, 0, 0.16) 0px 0px 15px 5px, rgb(0 0 0 / 0.26) 0px 0px 5px 5px, rgb(0 0 0 / 0.36) 0px 0px 20px 2px !important'
      this.element.style.opacity = '0.8'
    }
    if (event.which === 1 && event.type === 'mousedown' && !this.fullScreen) {
      this.canDrag = true
      this.positon.x = event.clientX - this.positon.x;
      this.positon.y = event.clientY - this.positon.y;
    }
    if (event.type === 'touchstart' && event.targetTouches.length == 1 && !this.fullScreen) {
      this.canDrag = true
      this.positon.x = event.changedTouches[0].clientX - this.positon.x;
      this.positon.y = event.changedTouches[0].clientY - this.positon.y;
    }
  }
  @HostListener('document:touchend', ['$event'])
  @HostListener('document:mouseup', ['$event'])
  onMouseUp(event) {
    this.element.style.opacity = '1'
    this.element.style.boxShadow = 'rgba(0, 0, 0, 0.16) 0px 0px 14px 2px !important'

    // if (event.type === 'mousedown') {
    this.canDrag = false
    this.positon.x = this.dragPositon.x
    this.positon.y = this.dragPositon.y
    if ((event.type === 'mouseup' && document.body.offsetWidth < event.clientX && this.copyEl) ||
      (event.type === 'touchend' && document.body.offsetWidth < event.changedTouches[0].clientX && this.copyEl)) {
      this.area = {
        changeSize: true,
        width: this.element.offsetWidth,
        height: this.element.offsetHeight,
      }
      this.element.style.left = document.body.offsetWidth / 2 + 'px'
      this.element.style.top = '0';
      this.element.style.right = '0'
      this.element.style.width = '50%'
      this.element.style.height = '100vh'
      this.popup.setChange({ width: this.element.offsetWidth, height: this.element.offsetHeight, x: parseInt(this.element.style.left), y: parseInt(this.element.style.top), id: this.element.id })

      document.body.removeChild(this.copyEl)
      this.copyEl = undefined
    }
    if ((event.type === 'mouseup' && 1 > event.clientX && this.copyEl) ||
      (event.type === 'touchend' && 1 > event.changedTouches[0].clientX && this.copyEl)) {
      this.area = {
        changeSize: true,
        width: this.element.offsetWidth,
        height: this.element.offsetHeight,
      }
      this.element.style.left = '0'
      this.element.style.top = '0';
      this.element.style.right = 'unset'
      this.element.style.width = '50%'
      this.element.style.height = '100vh'
      this.popup.setChange({ width: this.element.offsetWidth, height: this.element.offsetHeight, x: parseInt(this.element.style.left), y: parseInt(this.element.style.top), id: this.element.id })

      document.body.removeChild(this.copyEl)
      this.copyEl = undefined
    }
    if ((event.type === 'mouseup' && 1 > event.clientY && this.copyEl) ||
      (event.type === 'touchend' && 1 > event.changedTouches[0].clientY && this.copyEl)) {
      this.area = {
        changeSize: true,
        width: this.element.offsetWidth,
        height: this.element.offsetHeight,
      }
      this.element.style.left = '0'
      this.element.style.top = '0';
      this.element.style.right = 'unset'
      this.element.style.width = '100%'
      this.element.style.height = '100vh'
      this.popup.setChange({ width: this.element.offsetWidth, height: this.element.offsetHeight, x: parseInt(this.element.style.left), y: parseInt(this.element.style.top), id: this.element.id })

      document.body.removeChild(this.copyEl)
      this.copyEl = undefined
    }

    // }
    // if (event.type === 'touchstart' && event.targetTouches.length == 1) {


  }
  @HostListener('document:touchmove', ['$event'])
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event) {
    const maxDragHeight = this.popup.popupListMinimize.length > 0 ? document.body.offsetHeight - 47 : document.body.offsetHeight + 2
    if (this.canDrag && event.type === 'mousemove' && event.clientX > 0 &&
      event.clientY > 0 && maxDragHeight > event.clientY &&
      document.body.offsetWidth > event.clientX) {
      if (this.copyEl) {
        document.body.removeChild(this.copyEl)
        this.copyEl = undefined
      }
      if (this.area.changeSize) {

        this.element.style.width = this.area.width + 'px'
        this.element.style.height = this.area.height + 'px'
        if (event.clientX > this.area.width) {
          this.positon.x = event.clientX - this.area.width + 100
          this.positon.x = event.clientX - this.positon.x
          this.element.style.left = event.clientX - this.area.width + 'px'
        }
        this.area.changeSize = false
        this.popup.setChange({ width: this.element.offsetWidth, height: this.element.offsetHeight, x: parseInt(this.element.style.left), y: parseInt(this.element.style.top), id: this.element.id })

      }
      this.dragPositon.x = event.clientX - this.positon.x
      this.dragPositon.y = event.clientY - this.positon.y
      // this.element.style.transform = `translate3d(${this.dragPositon.x}px, ${this.dragPositon.y}px, 0px)`
      this.element.style.left = this.dragPositon.x + 'px'
      this.element.style.top = this.dragPositon.y + 'px'
    }
    if (this.canDrag && event.type === 'touchmove' && event.targetTouches.length == 1 &&
      event.changedTouches[0].clientX > 0 && event.changedTouches[0].clientY > 0 &&
      maxDragHeight > event.changedTouches[0].clientY &&
      document.body.offsetWidth > event.changedTouches[0].clientX) {
      if (this.copyEl) {
        document.body.removeChild(this.copyEl)
        this.copyEl = undefined
      }
      if (this.area.changeSize) {
        this.element.style.width = this.area.width + 'px'
        this.element.style.height = this.area.height + 'px'
        if (event.changedTouches[0].clientX > this.area.width) {
          this.positon.x = event.changedTouches[0].clientX - this.area.width + 100
          this.positon.x = event.changedTouches[0].clientX - this.positon.x
          this.element.style.left = event.changedTouches[0].clientX - this.area.width + 'px'
        }
        this.popup.setChange({ width: this.element.offsetWidth, height: this.element.offsetHeight, x: parseInt(this.element.style.left), y: parseInt(this.element.style.top), id: this.element.id })
        this.area.changeSize = false
      }
      this.dragPositon.x = event.changedTouches[0].clientX - this.positon.x
      this.dragPositon.y = event.changedTouches[0].clientY - this.positon.y
      // this.element.style.transform = `translate3d(${this.dragPositon.x}px, ${this.dragPositon.y}px, 0px)`
      this.element.style.left = this.dragPositon.x + 'px'
      this.element.style.top = this.dragPositon.y + 'px'
    }
    if ((event.type === 'mousemove' && this.canDrag && document.body.offsetWidth < event.clientX && !this.copyEl) ||
      (event.type === 'touchmove' && this.canDrag && document.body.offsetWidth < event.changedTouches[0].clientX && !this.copyEl)) {
      this.copyEl = document.createElement('div')// chageEl.appendChild(Object.assign(this.element))
      this.copyEl.style.background = 'rgba(0,0,0,0.3)'
      const zIndex = parseInt(this.element.style.zIndex) - 1
      this.copyEl.style.position = 'fixed'
      this.copyEl.id = this.element.id + '_copy'
      this.copyEl.style.zIndex = zIndex.toString()
      this.copyEl.style.opacity = '0.7'
      this.copyEl.style.width = '0'
      this.copyEl.style.height = '0'
      this.copyEl.style.transition = 'all 0.5s'
      this.copyEl.style.left = 'unset'
      this.copyEl.style.right = '0'
      this.copyEl.style.top = '0'
      document.body.appendChild(this.copyEl)

      this.copyEl.style.height = '100vh'
      this.copyEl.style.width = document.body.offsetWidth / 2 + 'px'
    }
    if ((event.type === 'mousemove' && this.canDrag && 1 > event.clientX && !this.copyEl) ||
      (event.type === 'touchmove' && this.canDrag && 1 > event.changedTouches[0].clientX && !this.copyEl)) {
      this.copyEl = document.createElement('div')// chageEl.appendChild(Object.assign(this.element))
      this.copyEl.style.background = 'rgba(0,0,0,0.3)'
      const zIndex = parseInt(this.element.style.zIndex) - 1
      this.copyEl.style.position = 'fixed'
      this.copyEl.id = this.element.id + '_copy'
      this.copyEl.style.zIndex = zIndex.toString()
      this.copyEl.style.width = '0'
      this.copyEl.style.height = '0'
      this.copyEl.style.opacity = '0.7'
      this.copyEl.style.transition = 'all 0.5s'
      this.copyEl.style.left = '0'
      this.copyEl.style.right = 'unset'
      this.copyEl.style.top = '0'
      document.body.appendChild(this.copyEl)
      this.copyEl.style.height = '100vh'
      this.copyEl.style.width = document.body.offsetWidth / 2 + 'px'
    }

    if (((event.type === 'mousemove') && this.canDrag && 1 > event.clientY && !this.copyEl) ||
      (event.type === 'touchmove' && this.canDrag && 1 > event.changedTouches[0].clientY && !this.copyEl)) {
      // const chageEl = document.createElement('div')
      this.copyEl = document.createElement('div')// chageEl.appendChild(Object.assign(this.element))
      const zIndex = parseInt(this.element.style.zIndex) - 1
      this.copyEl.style.position = 'fixed'
      this.copyEl.style.background = 'rgba(0,0,0,0.3)'
      this.copyEl.id = this.element.id + '_copy'
      this.copyEl.style.zIndex = zIndex.toString()
      this.copyEl.style.opacity = '0.7'
      this.copyEl.style.width = '0'
      this.copyEl.style.height = '0'
      this.copyEl.style.transition = 'all 0.5s'
      this.copyEl.style.left = 'unset'
      this.copyEl.style.right = '0'
      this.copyEl.style.top = '0'
      document.body.appendChild(this.copyEl)
      this.copyEl.style.width = '100vw'
      this.copyEl.style.height = document.body.offsetHeight + 'px'
    }
  }
}
