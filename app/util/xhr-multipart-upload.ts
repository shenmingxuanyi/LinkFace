import {BrowserXhr} from "@angular/http";
import {FileConvertUtil} from "./file-convert-util";
import {FileError} from "ionic-native";
import {Injectable, Component} from "@angular/core";
/**
 * @author zhaojunming
 */

export class XHRMultipartFileUpload {

    private static browserXhr = new BrowserXhr();

    constructor() {

    }

    public static upload(url: string, files: {name: string,path: string}[], params: any): Promise<any> {

        const xhr = XHRMultipartFileUpload.browserXhr.build();

        xhr.open("post", encodeURI(url));

        let formData = new FormData();

        return new Promise((resolve, reject)=> {

            if (params) {
                for (let _v in params) {
                    if (params.hasOwnProperty(_v)) {
                        formData.append(_v, params[_v]);
                    }
                }
            }

            let blobPromiseList: Array<Promise<Blob|FileError>> = [];

            files.forEach((file)=> {
                blobPromiseList.push(FileConvertUtil.convertFileToBlob(file.path));
            });

            Promise.all(blobPromiseList).then((result)=> {

                result.forEach((blob, index)=> {
                    formData.append(files[index].name, blob, FileConvertUtil.extractFileName(files[index].path));
                });

                xhr.onreadystatechange = ()=> {
                    if (xhr.readyState == 4) {
                        if (xhr.status == 200) {
                            resolve(JSON.parse(xhr.responseText));
                        } else {
                            reject({code: xhr.status, message: JSON.parse(xhr.responseText)});
                        }
                    }

                }

                xhr.send(formData);


            }).catch((reason)=> {
                reject(reason);
            });

        });

    }


}