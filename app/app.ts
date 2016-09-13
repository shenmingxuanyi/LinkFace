import {Component} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar, Splashscreen} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';


@Component({
    template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {

    private rootPage: any;

    constructor(private platform: Platform) {
        this.rootPage = TabsPage;

        this.platform
            .ready()
            .then(() => {

                //设置状态条颜色
                StatusBar.styleDefault();

                //自动隐藏欢迎屏
                setTimeout(()=> {
                    //验证登录,调至登录界面
                    Splashscreen.hide();

                }, 1000);
            });
    }
}

ionicBootstrap(MyApp);
