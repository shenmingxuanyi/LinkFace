import {Component} from '@angular/core';
import {NavController, ActionSheetController, LoadingController, ToastController} from 'ionic-angular';
import {LinkFaceVerfication} from "../../util/linkface-verfication";
import {ImageResizerOptions, ImageResizer, Camera, ImagePicker} from "ionic-native";
import {NFCCardReader} from "../../cordova-plugin/nfc-card-reader";

@Component({
    templateUrl: 'build/pages/home/home.html',
    providers: [LinkFaceVerfication]
})
export class HomePage {

    confidence: string;

    selfie_file: string;

    historical_selfie_file: string;

    uploading: boolean = false;
    cardReading: boolean = false;

    idCardInfo: any;

    constructor(private navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public linkFaceVerfication: LinkFaceVerfication) {

    }


    readIDCard() {

        this.toastMessage("请使用NFC读取身份证", "toast-info");

        this.cardReading = true;

        this.idCardInfo = null;
        this.selfie_file = null;

        NFCCardReader.readerIDCard()
            .then((res)=> {
                this.idCardInfo = res.idCardInfo;
                this.selfie_file = "file://" + this.idCardInfo.photoPath;
                this.cardReading = false;
            })
            .catch((error)=> {
                this.toastMessage(error);
                this.cardReading = false;
            });

    }

    camera(_image): void {
        this.choiceCamera(_image);
    }


    choiceCamera(_image) {
        Camera.getPicture({})
            .then((imageData)=> {
                this.imageResize(_image, imageData);
            })
            .catch((error)=> {
                this.toastMessage(JSON.stringify(error));
            });
    }

    imageResize(_image, imageData) {
        let options = {
            uri: imageData,
            folderName: 'ImageResize',
            quality: 90,
            width: 800,
            height: 800,
            fileName: imageData.substr(imageData.lastIndexOf('/') + 1)
        } as ImageResizerOptions;

        ImageResizer
            .resize(options)
            .then(
                (filePath: string) => {
                    this[_image] = filePath + "";
                    this.confidence = null;
                },
                () => {
                    this.toastMessage("缩小图像时出现错误了")
                }
            );
    }

    verification() {


        if (this.uploading) {
            return;
        }

        if (null == this.selfie_file || null == this.historical_selfie_file) {
            this.toastMessage("请拍照片后者选择图像");
            return;
        }

        this.uploading = true;

        this.confidence = null;

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


    toastMessage(message, cssclass: string = "toast-danger") {

        let toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'top',
            cssClass: cssclass
        });

        toast.present();
    }
}
