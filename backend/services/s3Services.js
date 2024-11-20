import s3Client from "../config/s3";
import { DeleteObjectCommand, GetObjectCommand, ListObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';

/**
 * What is it for?
 * In product when adding a product, an image is uploaded -> That image is uploaded to s3 -> The image URL is saved in the database (aws base url + image name)
 * In product when deleting a product -> the aws base url is parsed, leaving only the name and using the service -> the image is deleted from s3
 * In product when updating -> the aws base url is parsed, leaving only the name (with image from the database) -> if an image is uploaded and is different from the current one (name, weight) -> the new image is uploaded to s3
 * In user when updating -> if an image is uploaded and is different from the current one (name, weight) -> the new image is uploaded to s3 -> the image is changed in the database
 * 
 * How to save it in db to use it as image source?
 * amazon base url + filename
 * amazon base url = https://keysbazaar-test2.s3.us-east-2.amazonaws.com/
 * filename: GcrLy0vWYAAupdN.png
 * 
 * url: https://keysbazaar-test2.s3.us-east-2.amazonaws.com/GcrLy0vWYAAupdN.png
 * 
 * req.files.file
 * 
 */


// #TODO: Implement at product controller.

const uploadFile = async(file) =>{

    const stream = fs.createReadStream(file.tempFilePath);
    const uploadParams = {
        Bucket: s3Bucket.name,
        Key: file.name,
        Body: stream
    }
    const command = new PutObjectCommand(uploadParams);

    return await s3Client.send(command);

}
const getAllFiles = async() =>{
    const command = new ListObjectsCommand({
        Bucket: s3Bucket.name
    })
    return await s3Client.send(command);
}

const getOneFiles = async(fileName)=>{
    const command = new GetObjectCommand({
        Bucket: s3Bucket.name,
        Key: fileName
    })

    return await s3Client.send(command);
}

const deleteFile = async(fileName) =>{
    const command = new DeleteObjectCommand({
        Bucket: s3Bucket.name,
        Key: fileName,
    })

    return await s3Client.send(command);
}


export { uploadFile, getAllFiles, getOneFiles };