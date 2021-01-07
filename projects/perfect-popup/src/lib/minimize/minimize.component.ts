import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NgxPerfectPopup } from '../ngx-perfect-popup';

@Component({
  selector: 'app-minimize',
  templateUrl: './minimize.component.html',
  styleUrls: ['./minimize.component.scss']
})
export class MinimizeComponent implements OnInit, OnDestroy, AfterViewInit {

  list: {} = {}
  dir: Observable<string>
  sub: Subscription = new Subscription();
  @ViewChild('mini') minimize: ElementRef
  constructor(
    private pop: NgxPerfectPopup
  ) { }
  ngAfterViewInit() {
    this.minimize.nativeElement.style.zIndex = (99992 + this.pop.popupList.length).toString()
  }
  ngOnDestroy() {
    if (this.sub)
      this.sub.unsubscribe()
  }
  ngOnInit(): void {
    this.dir = this.pop.getDir()
    this.loadList()
    this.sub.add(
      this.pop.minimizeListMessage.subscribe(
        data => {
          this.loadList()
        }
      )
    )
  }
  loadList() {
    this.pop.popupListMinimize.map((item, i) => {
      const prop = item?.type ? item.type : `prop_${i}`
      if (!this.list.hasOwnProperty(prop)) {
        this.list[prop] = [item]
      }
      else {
        if (!this.list[prop].find(listItem => listItem.id === item.id)) {
          this.list[prop].push(item)
        }
      }
    })
    try {
      this.minimize.nativeElement.style.zIndex = (99992 + this.pop.popupList.length).toString()
    } catch (e) {
    }
  }
  maximaze(prop) {
    if (this.list[prop].length === 1) {
      this.pop.maximize(this.list[prop][0].id)
      delete this.list[prop]
    }
  }
  checkArrayLength(prop) {
    return this.list[prop].length > 1 ? true : false
  }
  close(prop, popup) {
    this.pop.closeThisPopup(popup.id, popup.beforeCloseCallBack)
    if (popup.beforeCloseCallBack) {
      const sub = this.pop.afterClosePopup.subscribe(data => {
        this.list[data.type].splice(
          this.list[data.type].findIndex(list => list.id === data.id), 1
        )
        sub.unsubscribe()
      })
    }
    else {
      this.list[prop].splice(
        this.list[prop].findIndex(list => list.id === popup.id), 1
      )
    }
  }
  maximazePopup(prop, popup) {
    this.pop.maximize(popup.id)
  }
}
