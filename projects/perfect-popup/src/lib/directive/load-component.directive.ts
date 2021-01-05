import { ComponentFactoryResolver, ComponentRef, Directive, Injector, Input, OnDestroy, OnInit, ReflectiveInjector, ViewChild, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[loadComp]'
})
export class LoadComponentDirective implements OnInit, OnDestroy {
  @Input() comp
  injectComp: ComponentRef<any>
  @Input() data

  // @ViewChild(AdDirective, { static: true }) adHost: AdDirective;
  constructor(private cfr: ComponentFactoryResolver, private vcr: ViewContainerRef, private injector: Injector) { }
  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    if (this.injectComp)
      this.injectComp.destroy()
    // clearInterval(this.interval);
  }

  loadComponent() {

    const componentFactory = this.cfr.resolveComponentFactory(this.comp);
    this.injector = ReflectiveInjector.resolveAndCreate([
      {
        provide: "data", useValue: { data: this.data.data, id: this.data.id }
      }
    ])
    // const viewContainerRef = this.adHost.viewContainerRef;
    this.vcr.clear();

    const componentRef = this.vcr.createComponent(componentFactory, 0, this.injector);
    this.injectComp = componentRef
    // componentRef.instance.data = adItem.data;
  }
}
