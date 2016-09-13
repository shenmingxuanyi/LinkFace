import {Component} from '@angular/core';
import {NavController, ToastController, LoadingController} from 'ionic-angular';
import {Camera, ImageResizerOptions, ImageResizer} from "ionic-native";
import {LinkFaceVerfication} from "../../util/linkface-verfication";

@Component({
    templateUrl: 'build/pages/about/about.html',
    providers: [LinkFaceVerfication]
})
export class AboutPage {

    confidence: string;

    selfie_file: string;
    historical_selfie_file: string;

    uploading: boolean = false;

    constructor(private navCtrl: NavController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public linkFaceVerfication: LinkFaceVerfication) {
    }


    camera(_image): void {

        Camera.getPicture({})
            .then((imageData)=> {

                let options = {
                    uri: imageData,
                    folderName: 'ImageResize',
                    quality: 90,
                    width: 1280,
                    height: 1280,
                    fileName: imageData.substr(imageData.lastIndexOf('/') + 1)
                } as ImageResizerOptions;

                ImageResizer
                    .resize(options)
                    .then(
                        (filePath: string) => {
                            this[_image] = filePath + "";
                        },
                        () => {
                            this.toastMessage("缩小图像时出现错误了")
                        }
                    );
            });

    }


    verification() {

        if (this.uploading) {
            return;
        }

        if (null == this.selfie_file || null == this.historical_selfie_file) {
            this.toastMessage("请拍照片");
            return;
        }

        this.uploading = true;

        this.linkFaceVerfication.historicalSelfieVerification(this.selfie_file, this.historical_selfie_file, true, true)
            .then(result=> {
                this.confidence = (result.confidence * 100).toFixed(2);
                this.uploading = false;
            })
            .catch(reason=> {
                this.toastMessage(reason);
                this.uploading = false;
            });

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
}
