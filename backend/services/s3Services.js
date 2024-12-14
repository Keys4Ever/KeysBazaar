import s3Client from "../config/s3.js";
import { s3Bucket } from '../config/awsCredentials.js';
import { DeleteObjectCommand, GetObjectCommand, ListObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";

/**
 * Upload a file directly to S3 without saving it locally
 * 
 * @param {object} file - The file object from req.files.file
 * @returns {Promise} - Result of the S3 upload operation
 */
const uploadFile = async (file) => {
    const uploadParams = {
        Bucket: s3Bucket.name,
        Key: file.name,
        Body: file.data
    };

    const command = new PutObjectCommand(uploadParams);

    return await s3Client.send(command);
};

/**
 * Retrieve all files from the S3 bucket
 */
const getAllFiles = async () => {
    const command = new ListObjectsCommand({
        Bucket: s3Bucket.name
    });

    return await s3Client.send(command);
};

/**
 * Retrieve a single file from the S3 bucket
 * 
 * @param {string} fileName - The name of the file to retrieve
 */
const getOneFiles = async (fileName) => {
    const command = new GetObjectCommand({
        Bucket: s3Bucket.name,
        Key: fileName
    });

    return await s3Client.send(command);
};

/**
 * Delete a file from the S3 bucket
 * 
 * @param {string} fileName - The name of the file to delete
 */
const deleteFile = async (fileName) => {
    const command = new DeleteObjectCommand({
        Bucket: s3Bucket.name,
        Key: fileName,
    });

    return await s3Client.send(command);
};

export { uploadFile, getAllFiles, getOneFiles, deleteFile };
