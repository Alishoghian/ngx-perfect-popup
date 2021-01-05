import { ApplicationRef, ComponentFactoryResolver, ComponentRef, ElementRef, Injectable, Injector, ReflectiveInjector, ViewChild } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { MinimizeComponent } from "./minimize/minimize.component";
import { PopupModel } from "./popup-model";
import { PopupComponent } from "./popup/popup.component";

@Injectable()

export class Popup {
    private dir: BehaviorSubject<string> = new BehaviorSubject<string>('ltr')
    private ClosingCallBack = new Subject<string>()
    private changeEmite = new Subject<{ width: number, height: number, x: number, y: number, id: string }>()
    popupList: { id: string, element?: HTMLElement, zIndex?: number, comp: ComponentRef<any> }[] = []
    minimizeListMessage = new Subject<string>()
    popupListMinimize: { id: string, type?: string, icon: string, title: string, beforeCloseCallBack: boolean }[] = []
    miniMizeComp: { el: HTMLElement, comp: ComponentRef<any> }
    afterClosePopup = new Subject<{ type: string, id: string }>()
    constructor(
        private ref: ComponentFactoryResolver,
        private injector: Injector,
        private app: ApplicationRef
    ) {
    }
    changeDir(dir: "ltr" | "rtl") {
        this.dir.next(dir)
    }
    getDir(): Observable<string> {
        return this.dir.asObservable()
    }
    open(comp, config: PopupModel) {
        if (config.multiPopup) {
            const id = this.generateId()
            const el = document.createElement("div")
            el.setAttribute('style', `
            width:0;
            left:0;
            height:0;
            top:0;
        `)
            let factory = this.ref.resolveComponentFactory(PopupComponent);
            this.injector = ReflectiveInjector.resolveAndCreate([
                { provide: "comp", useValue: { component: comp, config: config, id: id } }
            ])
            document.body.appendChild(el);

            const ref = factory.create(this.injector, [], el);
            this.popupList.push({ id: id, element: el, comp: ref, zIndex: this.popupList.length })
            this.app.attachView(ref.hostView);
        }
        else if (!config.multiPopup) {
            const id = this.generateId()
            const el = document.createElement("div")
            el.setAttribute('style', `
            position:fixed;
            top:0;
            left:0;
            width:100vw;
            z-index:${99990 + this.popupList.length + 2};
            height:100vh;   
            background: rgba(0,0,0,0.05);
            backdrop-filter: blur(2px);
            user-select: none;
            -moz-user-select: none; 
            -ms-user-select: none; 
            -khtml-user-select: none; 
            -webkit-user-select: none; 
            -webkit-touch-callout: none;
        `)
            let factory = this.ref.resolveComponentFactory(PopupComponent);
            this.injector = ReflectiveInjector.resolveAndCreate([
                { provide: "comp", useValue: { component: comp, config: config, id: id } }
            ])
            document.body.appendChild(el);
            const ref = factory.create(this.injector, [], el);
            this.popupList.push({ id: id, element: el, comp: ref, zIndex: this.popupList.length })
            this.app.attachView(ref.hostView);
            let self = globalThis
            el.addEventListener("mousedown", (e: any) => {
                if (e.path[0] === el) {
                    this.closeThisPopup(id, config.beforeCloseCallBack)
                }
            })
            el.addEventListener("touchstart", (e: any) => {
                if (e.path[0] === el) {
                    this.closeThisPopup(id, config.beforeCloseCallBack)
                }
            })

        }
    }
    generateId(): string {
        let id = ''
        const key = 'ABCDEFGHIGKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890@#$&'
        for (let i = 0; i < 8; i++) {
            id += key.charAt(0 + Math.floor(Math.random() * key.length))
        }
        return id
    }
    setChange(data: { width: number, height: number, x: number, y: number, id: string }) {
        this.changeEmite.next(data)
    }
    getChange(): Observable<{ width: number, height: number, x: number, y: number, id: string }> {
        return this.changeEmite.asObservable()
    }
    closeThisPopup(id: string, beforClose: boolean) {
        // try{
        if (beforClose) {
            this.ClosingCallBack.next(id)
        }
        else {
            const index = this.popupList[this.popupList.findIndex(popup => popup.id === id)];
            try {
                document.body.removeChild(index.element)
            } catch (e) { }
            this.popupList[this.popupList.findIndex(popup => popup.id === id)].comp.destroy()
            this.popupList.splice(this.popupList.findIndex(popup => popup.id === id), 1)
            if (this.popupListMinimize.length > 0) {
                this.popupListMinimize.splice(this.popupListMinimize.findIndex(list => list.id === id), 1)
            }
        }
    }
    setClosing(id) {
        this.ClosingCallBack.next(id)
    }
    getCloseing(): Observable<string> {
        return this.ClosingCallBack.asObservable()
    }
    close(id) {
        const index = this.popupList[this.popupList.findIndex(popup => popup.id === id)]
        if (index) {
            this.popupList[this.popupList.findIndex(popup => popup.id === id)].comp.destroy()
            try {
                document.body.removeChild(index.element)
            } catch (e) { }
            this.popupList.splice(this.popupList.findIndex(popup => popup.id === id), 1)
            const popupInMiniList = this.popupListMinimize.find(list => list.id === id)
            if (popupInMiniList) {
                this.popupListMinimize.splice(this.popupListMinimize.findIndex(list => list === popupInMiniList), 1)
                this.afterClosePopup.next({ id: popupInMiniList.id, type: popupInMiniList.type })
            }
        }
    }
    minimize(id: string, type: string, icon: string, title, beforeCloseCallBack: boolean) {
        const el = this.popupList.find(p => p.id === id)
        if (el) {
            if (this.popupListMinimize.length === 0) {
                const miniEl = document.createElement('div')
                miniEl.setAttribute('style', `
                    width:0;
                    left:0;
                    height:0;
                    top:0;
                `)
                let factory = this.ref.resolveComponentFactory(MinimizeComponent);
                this.injector = ReflectiveInjector.resolveAndCreate([
                    { provide: "list", useValue: this.popupListMinimize }
                ])
                document.body.appendChild(miniEl);
                const ref = factory.create(this.injector, [], miniEl);
                this.app.attachView(ref.hostView);
                document.body.removeChild(el.element)
                this.popupListMinimize.push({ id: id, icon: icon, type: type, title: title, beforeCloseCallBack: beforeCloseCallBack })
                this.minimizeListMessage.next()
                this.miniMizeComp = { el: miniEl, comp: ref }
            }
            else {
                if (this.popupListMinimize.find(list => list.id !== id)) {
                    this.popupListMinimize.push({ id: id, icon: icon, type: type, title: title, beforeCloseCallBack: beforeCloseCallBack })
                    document.body.removeChild(el.element)
                    this.minimizeListMessage.next()
                }

            }
        }
    }
    maximize(id: string) {
        document.body.appendChild(this.popupList.find(popup => popup.id === id).element)
        this.popupListMinimize.splice(
            this.popupListMinimize.findIndex(list => list.id === id), 1
        )
        if (this.popupListMinimize.length === 0) {
            this.miniMizeComp.comp.destroy()
            document.body.removeChild(this.miniMizeComp.el)
        }

    }
}
