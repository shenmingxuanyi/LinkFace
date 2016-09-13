import {File, FileError} from "ionic-native";
/***
 * @author 赵俊明
 */

export class FileConvertUtil {

    constructor() {

    }

    public static convertFileToBlob(fullFilePath: string): Promise<Blob|FileError> {

        return new Promise((resolve, reject)=> {
            FileConvertUtil.convertFileToArrayBuffer(fullFilePath).then((arrayBuffer)=> {
                resolve(new Blob([arrayBuffer], {type: "image/" + FileConvertUtil.extractFileType(fullFilePath)}));
            }).catch((reason)=> {
                reject(reason);
            });
        });

    }

    public static convertFileToArrayBuffer(fullFilePath: string): Promise<ArrayBuffer | FileError> {

        return File.readAsArrayBuffer(FileConvertUtil.extractFilePath(fullFilePath), FileConvertUtil.extractFileName(fullFilePath));

    }

    public static extractFilePath(fullFilePath: string): string {
        return fullFilePath.substr(0, fullFilePath.lastIndexOf('/'));
    }

    public static extractFileName(fullFilePath: string): string {
        return fullFilePath.substr(fullFilePath.lastIndexOf('/') + 1);
    }

    public static extractFileType(fullFilePath: string): string {
        return fullFilePath.split(".")[1];
    }

}