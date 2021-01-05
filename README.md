# ngx Perfect Popup

This is an Angular wrapper library for the [Perfect Popup](https://github.com/Alishoghian/ngx-perfect-poup/). To use this library you should get familiar with the Perfect Popup documentation as well since this documentation only explains details specific to this wrapper.

This documentation is for the latest 0/0.1.x version which requires Angular 10.1.3 or newer. For Angular 10.1.3 you need to use the latest 10.1.3 version. Documentation for the 10.x.x can be found from <a href="https://github.com/Alishoghian/ngx-perfect-poup/tree/master">here</a>.


### Building the library

```bash
npm install
npm run build
```

### Running the example

```bash
npm install
npm run start
```

### Installing and usage

```bash
npm install ngx-perfect-popup --save
```

##### Load the module for your app :

First you need to add the PerfectPopupModule  module in your module.

```javascript
import { PerfectPopupModule} from 'ngx-perfect-popup'


@NgModule({
  ...
  imports: [
    ...
    PerfectPopupModule
  ],
})

```
##### Use it in your components and load popup

```javascript
import { Popup,PopupModel } from 'ngx-perfect-popup'
import { TestPopupComponent } from './test-popup.component';

@Component({
  ...
})
export class AppComponent {

constructor(
    private popup: Popup
  ) { }

openPopup(){
  const config:PopupModel={
      icon: './favicon.ico',//your icon path
      styleClass: "cum-popup", // your custom class style 
      theme: "primary", //defult theme
      dragable: true, // popup can be dragable or not
      resizable: true,  // popup can be resize or not
      position: "center", //popup poditon
      multiPopup: true, // display multiple popup
      overlayBlur: true, // when you only have one popup for display and this property is true backdrop-filter active
      beforeCloseCallBack: true, //when this property is true before close you can subscribe close popup message and let for close whit other function
      toolbarAction: true, //when this property is true toolbar action is shown
      // headerTitle: "Sender Popup2",
      maxHeight: 600,
      maxWidth: 600,
      minHeight: 200,
      minwidth: 250,
      // height: 287,
      // width: 333,
      type: "BaseType2", // you can set type for popup
      data: { //pass data into your injetion component
        temp: "generat data for popup2"
      }
    }
    this.pop.open(TestPopupComponent, config)
}

```
##### subscribe before close:
 when beforeCloseCallBack is true you can resave message and prevent the popup close or colse it 

```javascript

import { Popup } from 'ngx-perfect-popup'

export class TestPopupComponent implements OnInit, OnDestroy {
      sub: Subscription = new Subscription()

  constructor(@Inject("data") public data: any,
    private popup: Popup) { }
    ngOnInit(): void {
        this.sub.add(this.popup.getCloseing().subscribe(data => {
            console.log(data);
            if (this.data.id === data) { 
                setTimeout(() => {
                this.popup.close(data) //when you whant close call close function and pass id to it
                }, 4000);
            }
            }))
    }
```
##### add your custom style whit styleClass :
add style in that component you whant call open popup 
```javascript
::ng-deep.cum-popup-style{
        border-radius: 8px;
        overflow: hidden;
    .header{
        background-color: rgb(132, 3, 158);
        color: #eee;
        .full-screen{
           fill: rgb(0, 171, 177); 
        }
        .exit-full-screen{
           fill: rgb(26, 0, 141); 

        }
        .close{
           fill: rgb(219, 10, 10); 

        }
    }
    .content{
        background-color: #eee;
        color: #333;
    }
}
const config:PopupModel={
      styleClass: "cum-popup-style",
      .
      .
      .
}

```
or you can set globaly style in style.scss 
.cum-popup-style{
        border-radius: 8px;
        overflow: hidden;
    .header{
        background-color: rgb(132, 3, 158);
        color: #eee;
        .full-screen{
           fill: rgb(0, 171, 177); 
        }
        .exit-full-screen{
           fill: rgb(26, 0, 141); 

        }
        .close{
           fill: rgb(219, 10, 10); 

        }
    }
    .content{
        background-color: #eee;
        color: #333;
    }
}

