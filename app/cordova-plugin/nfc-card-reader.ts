/**
 * Created by Z.JM on 2016/9/18.
 */


declare const cordova: any;

const NFC_CARD_READER_TYPE = {
    ID_CARD: "ID",
    IC_CARD: "IC"
}

export class NFCCardReader {

    constructor() {
    }

    public static readerIDCard(): Promise<any> {

        return this.unitReader(NFC_CARD_READER_TYPE.ID_CARD);
    }

    public static  readerICCard(): Promise<any> {

        return this.unitReader(NFC_CARD_READER_TYPE.IC_CARD);
    }

    public static closeReaderListener(): Promise<any> {
        return new Promise((resolve, reject)=> {
            document.addEventListener("deviceready", ()=> {
                try {
                    cordova.plugin.card.closeCardListener(function (res) {
                        resolve(res);
                    }, function (error) {
                        reject("NFC-ERROR-000 关闭NFC监听出现错误");
                    });
                }
                catch (error) {
                    reject("NFC-ERROR-000 关闭NFC监听出现错误");
                }
            }, false);
        });
    }

    private static unitReader(type: string): Promise<any> {

        return new Promise((resolve, reject)=> {
            document.addEventListener("deviceready", ()=> {
                try {
                    cordova.plugin.card
                        .startCardListener((res) => {
                            if (res) {
                                if (NFC_CARD_READER_TYPE.ID_CARD == type) {
                                    //身份证
                                    if (res.cardType == NFC_CARD_READER_TYPE.ID_CARD) {
                                        resolve(res);
                                    } else {
                                        reject("NFC-ERROR-004 请读取身份证");
                                    }
                                } else if (NFC_CARD_READER_TYPE.IC_CARD == type) {
                                    //银行卡
                                    if (res.cardType == NFC_CARD_READER_TYPE.IC_CARD) {
                                        resolve(res);
                                    } else {
                                        reject("NFC-ERROR-004 请读取银行卡");
                                    }
                                }
                            } else {
                                reject("NFC-ERROR-003 读取NFC信息出现错误");
                            }
                        }, function (error) {
                            reject("NFC-ERROR-002 启动NFC监听出现错误");
                        });
                } catch (e) {
                    reject("NFC-ERROR-001 启动NFC监听出现错误");
                }

            }, false);
        });
    }

}
