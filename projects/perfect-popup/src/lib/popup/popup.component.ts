import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Popup } from '../popup';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit, OnDestroy, AfterViewInit {
  data
  fullScreen: boolean = false
  elChangeSize: { width: string, height: string, left: string, top: string } = { width: null, height: null, left: null, top: null }
  dir: Observable<string>
  resizeControl: { maxWidth: number, maxHeight: number, minWidth: number, minHeight: number } = { maxWidth: undefined, maxHeight: undefined, minWidth: 20, minHeight: 20 }
  @ViewChild('PerfectPopup', { static: true }) PerfectPopup: ElementRef
  constructor(@Inject("comp") private compInject: any,
    private poppup: Popup
  ) {
    this.data = compInject

  }
  ngOnInit(): void {

    this.dir = this.poppup.getDir()
    this.resizeControl = {
      maxWidth: this.data.config.maxWidth,
      maxHeight: this.data.config.maxHeight,
      minWidth: this.data.config.minwidth ? this.data.config.minwidth : 20,
      minHeight: this.data.config.minHeight ? this.data.config.minHeight : 20
    }

  }
  ngOnDestroy() {

  }
  ngAfterViewInit() {
    this.setStyle()
    this.PerfectPopup.nativeElement.style.zIndex = `${99990 + (this.poppup.popupList.length)}`
  }
  changeZIndex(PerfectPopup: HTMLElement) {
    if (parseInt(PerfectPopup.style.zIndex.split('9999')[1]) === this.poppup.popupList.length) { return }
    const plist = this.poppup.popupList
    const firstIndex = [plist.find(list => list.id === PerfectPopup.id)]
    plist.splice(plist.findIndex(list => list.id === PerfectPopup.id), 1)
    const newList = firstIndex.concat(plist)
    this.poppup.popupList = newList
    let i = 0
    newList.map((list) => {
      const el = document.getElementById(list.id)
      if (el) {
        i++
        document.getElementById(list.id).style.zIndex = `${99990 + (newList.length - i)}`
      }

    })
  }
  maximaze() {
    const el = document.getElementById(this.data.id)
    // this.changeZIndex(el)
    this.elChangeSize = {
      width: el.style.width,
      height: el.style.height,
      top: el.style.top,
      left: el.style.left
    }
    el.style.top = '0px'
    el.style.left = '0px'
    el.style.transition = 'all 0.2s'
    el.style.width = '100vw'
    el.style.height = '100vh'
    this.fullScreen = !this.fullScreen
  }
  exitMaximaze() {
    const el = document.getElementById(this.data.id)
    el.style.top = this.elChangeSize.top
    el.style.left = this.elChangeSize.left
    el.style.width = this.elChangeSize.width
    el.style.height = this.elChangeSize.height
    this.fullScreen = !this.fullScreen
    el.style.transition = 'unset'

  }
  close() {
    this.poppup.closeThisPopup(this.data.id, this.data.config?.beforeCloseCallBack)
  }
  minimaze() {
    this.poppup.minimize(this.data.id, this.data.config.type, this.data.config?.icon, this.data.config?.headerTitle, this.data.config?.beforeCloseCallBack)
  }
  setStyled: boolean
  setStyle() {
    if (this.setStyled) { return }
    const position: { x: number, y: number } | "center" | "top" | "right" | "left" | "bottom" | "top_right" | "top_left" | "bottom_left" | "bottom_right" = this.data.config.position

    const documentWidth = document.body.clientWidth;
    const documentHeight = document.body.clientHeight;
    let style: string = ''
    switch (position) {
      case "center": {
        let left = (documentWidth / 2) - (this.PerfectPopup.nativeElement.offsetWidth / 2)
        let top = (documentHeight / 2) - (this.PerfectPopup.nativeElement.offsetHeight / 2)
        this.PerfectPopup.nativeElement.style.top = `${top}px`
        this.PerfectPopup.nativeElement.style.left = `${left}px`
        break
      }
      case "top": {
        let left = (documentWidth / 2) - (this.PerfectPopup.nativeElement.offsetWidth / 2)
        this.PerfectPopup.nativeElement.style.top = `20px`
        this.PerfectPopup.nativeElement.style.left = `${left}px`
        break;
      }
      case "bottom": {
        let left = (documentWidth / 2) - (this.PerfectPopup.nativeElement.offsetWidth / 2)
        let top = documentHeight - this.PerfectPopup.nativeElement.offsetHeight - 20
        this.PerfectPopup.nativeElement.style.top = `${top}px`
        this.PerfectPopup.nativeElement.style.left = `${left}px`
        break;

      }
      case "left": {
        let top = (documentHeight / 2) - (this.PerfectPopup.nativeElement.offsetHeight / 2)

        this.PerfectPopup.nativeElement.style.top = `${top}px`
        this.PerfectPopup.nativeElement.style.left = `20px`
        break
      }
      case "right": {
        let top = (documentHeight / 2) - (this.PerfectPopup.nativeElement.offsetHeight / 2)
        let left = documentWidth - this.PerfectPopup.nativeElement.offsetWidth - 20
        this.PerfectPopup.nativeElement.style.top = `${top}px`
        this.PerfectPopup.nativeElement.style.left = `${left}px`
        break;
      }
      case "top_left": {
        this.PerfectPopup.nativeElement.style.top = `${20}px`
        this.PerfectPopup.nativeElement.style.left = `${20}px`
        break;

      }
      case "top_right": {
        let left = documentWidth - this.PerfectPopup.nativeElement.offsetWidth - 20
        this.PerfectPopup.nativeElement.style.top = `${20}px`
        this.PerfectPopup.nativeElement.style.left = `${left}px`
        break;

      }
      case "bottom_left": {
        let top = documentHeight - this.PerfectPopup.nativeElement.offsetHeight - 20
        this.PerfectPopup.nativeElement.style.top = `${top}px`
        this.PerfectPopup.nativeElement.style.left = `${20}px`
        break;
      }
      case "bottom_right": {
        let top = documentHeight - this.PerfectPopup.nativeElement.offsetHeight - 20
        let left = documentWidth - this.PerfectPopup.nativeElement.offsetWidth - 20
        this.PerfectPopup.nativeElement.style.top = `${top}px`
        this.PerfectPopup.nativeElement.style.left = `${left}px`
        break;
      }
      default: {
        if (position?.x && position.y) {
          this.PerfectPopup.nativeElement.style.top = `${position.y + (this.poppup.popupList.length * 20)}px`
          this.PerfectPopup.nativeElement.style.left = `${position.x + (this.poppup.popupList.length * 20)}px`
        } else {
          const p = this.poppup.popupList.length * 20
          this.PerfectPopup.nativeElement.style.top = `${p}px`
          this.PerfectPopup.nativeElement.style.left = `${p}px`
        }
      }
    }
    return style
  }
}
