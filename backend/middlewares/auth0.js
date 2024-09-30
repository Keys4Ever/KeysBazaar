import { auth } from 'express-openid-connect';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASEURL,
    clientID: process.env.AUTH0_CLIENTID,
    issuerBaseURL: process.env.AUTH0_ISSUERBASE
};

export const authMiddleware = auth(config);