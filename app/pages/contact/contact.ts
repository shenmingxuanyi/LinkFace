import {Component} from '@angular/core';
import {NavController, ToastController, App} from 'ionic-angular';
import {CallNumber} from "ionic-native";
import {SettingPage} from "../setting/setting";

@Component({
    templateUrl: 'build/pages/contact/contact.html'
})
export class ContactPage {

    settingClickCount: number = 0;

    constructor(private navCtrl: NavController, public toastCtrl: ToastController, private app: App) {

    }

    callTheOffice($event:TouchEvent|MouseEvent) {
        $event.stopPropagation();
        CallNumber.callNumber(13911525861, true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => {
                this.toastMessage("请先开启拨号权限");
            });
    }

    ionViewWillEnter() {
        this.settingClickCount = 0;
    }

    toastMessage(message) {

        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top',
            cssClass: "toast-danger"
        });

        toast.present();
    }

    mailTo(address) {
        location.href = "mailto:" + address;
    }

    setting() {
        ++this.settingClickCount;
        if (this.settingClickCount >= 10) {
            this.settingClickCount = 0;
            this.app.getRootNav().push(SettingPage);
        }
    }
}
