import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from './popup/popup.component';
import { NgxPerfectPopup } from './ngx-perfect-popup';
import { MinimizeComponent } from './minimize/minimize.component';
import { ForKeyPipe } from './pipe/for-key.pipe';
import { LoadComponentDirective } from './directive/load-component.directive';
import { MoveDirective } from './directive/move.directive';
import { ResizeingDirective } from './directive/resizeing.directive';



@NgModule({
  declarations: [
    PopupComponent,
    MoveDirective,
    ResizeingDirective,
    LoadComponentDirective,
    MinimizeComponent,
    ForKeyPipe
  ],
  imports: [
    CommonModule
  ],
  providers: [NgxPerfectPopup],

})
export class NgxPerfectPopupModule { }