import {Component} from '@angular/core';
import {NavController, ToastController, LoadingController, ActionSheetController, Toast} from 'ionic-angular';
import {Camera, ImageResizerOptions, ImageResizer, ImagePicker} from "ionic-native";
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

    constructor(private navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public linkFaceVerfication: LinkFaceVerfication) {

    }


    camera(_image): void {

        this.choiceCamera(_image);

        let actionSheet = this.actionSheetCtrl.create({
            title: '选择获取照片的方式',
            buttons: [
                {
                    text: '相机',
                    icon: 'camera',
                    role: 'destructive',
                    handler: () => {
                        this.choiceCamera(_image);
                    }
                },
                {
                    text: '图库',
                    icon: 'images',
                    role: 'destructive',
                    handler: () => {
                        this.choiceImageLib(_image);
                    }
                },
                {
                    text: '取消',
                    icon: 'close',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });

        // actionSheet.present();


    }


    choiceCamera(_image) {
        Camera.getPicture({})
            .then((imageData)=> {
                this.imageResize(_image, imageData);
            })
            .catch(()=> {
                this.toastMessage("启动相机出现错误");
            });
    }

    choiceImageLib(_image) {
        ImagePicker.getPictures({maximumImagesCount: 1})
            .then((results) => {
                if (results && results.length > 0) {
                    if (results[0]) {
                        this.imageResize(_image, results[0]);
                    }
                }

            }, (err) => {
                this.toastMessage("选择图像出现错误");
            });
    }


    imageResize(_image, imageData) {
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
