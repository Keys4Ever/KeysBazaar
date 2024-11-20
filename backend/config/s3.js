import { s3Bucket } from "./awsCredentials.js";
import { S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: s3Bucket.region,
    credentials: {
        accessKeyId: s3Bucket.access,
        secretAccessKey: s3Bucket.secret
    }
 });

export default s3Client;