import { config } from "dotenv";

config()

export const s3Bucket = {
    name: process.env.AWS_BUCKET_NAME2,
    region: process.env.AWS_BUCKET_REGION,
    access: process.env.AWS_BUCKET_ACCESS_KEY2,
    secret: process.env.AWS_BUCKET_SECRET_KEY2,
    url: 'https://keysbazaar-test2.s3.us-east-2.amazonaws.com'
}