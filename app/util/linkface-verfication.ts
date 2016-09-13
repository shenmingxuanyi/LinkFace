import {Injectable, Component} from "@angular/core";
import {XHRMultipartFileUpload} from "./xhr-multipart-upload";
import {Storage, LocalStorage} from "ionic-angular";


const ERROR_MAPPING = {
    "ENCODING_ERROR": "参数非UTF-8编码",
    "DOWNLOAD_TIMEOUT": "网络地址图片获取超时",
    "DOWNLOAD_ERROR": "网络地址图片获取失败",
    "IMAGE_FILE_SIZE_TOO_BIG": "图片体积过大 ",
    "IMAGE_ID_NOT_EXIST": "图片不存在",
    "NO_FACE_DETECTED": "图片未检测出人脸 ",
    "CORRUPT_IMAGE": "文件不是图片文件或已经损坏",
    "INVALID_IMAGE_FORMAT_OR_SIZE": "图片大小或格式不符合要求",
    "INVALID_ARGUMENT": "请求参数错误",
    "UNAUTHORIZED": "账号或密钥错误",
    "KEY_EXPIRED": "账号过期",
    "RATE_LIMIT_EXCEEDED": "调用频率超出限额",
    "NO_PERMISSION": "无调用权限",
    "NOT_FOUND": "请求路径错误",
    "INTERNAL_ERROR": "服务器内部错误"
};

@Injectable()
export class LinkFaceVerfication {

    private historicalSelfieVerificationURL = "https://v1-auth-api.visioncloudapi.com/identity/historical_selfie_verification";

    private selfieWatermarkVerificationURL = "https://v1-auth-api.visioncloudapi.com/identity/selfie_watermark_verification";

    private apiId: string;

    private apiSecret: string;

    private storage = new Storage(LocalStorage);

    constructor() {
        this.storage.get("apiId")
            .then(apiId=> {
                this.apiId = apiId || "6b666502c4324026b8604c8001a2cd14";
            }).catch(()=> {
            this.apiId = "6b666502c4324026b8604c8001a2cd14";
        });

        this.storage.get("apiSecret")
            .then(apiSecret=> {
                this.apiSecret = apiSecret || "28cf8b8693e54d0b930d0a5089831841";
            }).catch(()=> {
            this.apiSecret = "28cf8b8693e54d0b930d0a5089831841";
        });

    }

    public historicalSelfieVerification(selfie_file: string, historical_selfie_file: string, selfie_auto_rotate: boolean = true, historical_selfie_auto_rotate: boolean = true): Promise<any> {

        let params = {
            api_id: this.apiId,
            api_secret: this.apiSecret,
            selfie_auto_rotate: selfie_auto_rotate,
            historical_selfie_auto_rotate: historical_selfie_auto_rotate
        };

        let files = []
        files.push({name: "selfie_file", path: selfie_file});
        files.push({name: "historical_selfie_file", path: historical_selfie_file});

        return new Promise((resolve, reject)=> {

            XHRMultipartFileUpload.upload(this.historicalSelfieVerificationURL, files, params)
                .then(result=> {
                    resolve(result);
                })
                .catch(error=> {
                    if (error && error.code == 400) {
                        reject(ERROR_MAPPING[error.message.status]);
                    } else {
                        reject(JSON.stringify(error));
                    }
                });

        });

    }

    public selfieWatermarkVerification(selfie_file: string, watermark_picture_file: string): Promise<any> {
        let params = {api_id: this.apiId, api_secret: this.apiSecret};
        let files = []
        files.push({name: "selfie_file", path: selfie_file});
        files.push({name: "watermark_picture_file", path: watermark_picture_file});

        return new Promise((resolve, reject)=> {

            XHRMultipartFileUpload.upload(this.selfieWatermarkVerificationURL, files, params)
                .then(result=> {
                    resolve(result);
                })
                .catch(error=> {
                    if (error && error.code == 400) {
                        reject(ERROR_MAPPING[error.message.status]);
                    } else {
                        reject(JSON.stringify(error));
                    }
                });
        });
    }


    setApiId(apiId): boolean {
        if (apiId) {
            this.apiId = apiId;
            this.storage.set("apiId", apiId);
            return true;
        }
        return false;
    }

    setApiSecret(apiSecret): boolean {
        if (apiSecret) {
            this.apiSecret = apiSecret;
            this.storage.set("apiSecret", apiSecret);
            return true;
        }
        return false;
    }

}


