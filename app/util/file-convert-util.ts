import {File, FileError} from "ionic-native";
/***
 * @author 赵俊明
 */

export class FileConvertUtil {

    constructor() {

    }

    //讲文件转换为Blob
    public static convertFileToBlob(fullFilePath: string): Promise<Blob|FileError> {

        return new Promise((resolve, reject)=> {
            FileConvertUtil.convertFileToArrayBuffer(fullFilePath).then((arrayBuffer)=> {
                resolve(new Blob([arrayBuffer], {type: "image/" + FileConvertUtil.extractFileType(fullFilePath)}));
            }).catch((reason)=> {
                reject(reason);
            });
        });

    }

    //将文件装换为ArrayBuffer
    public static convertFileToArrayBuffer(fullFilePath: string): Promise<ArrayBuffer | FileError> {

        return File.readAsArrayBuffer(FileConvertUtil.extractFilePath(fullFilePath), FileConvertUtil.extractFileName(fullFilePath));

    }

    //截取文件路径
    public static extractFilePath(fullFilePath: string): string {
        return fullFilePath.substr(0, fullFilePath.lastIndexOf('/'));
    }

    //截取文件名称
    public static extractFileName(fullFilePath: string): string {
        return fullFilePath.substr(fullFilePath.lastIndexOf('/') + 1);
    }

    //截取文件类型
    public static extractFileType(fullFilePath: string): string {
        return fullFilePath.split(".")[1];
    }

}