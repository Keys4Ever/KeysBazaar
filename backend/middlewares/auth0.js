import { auth } from 'express-openid-connect';
import dotenv from 'dotenv';
import client from '../config/turso.js';

dotenv.config();

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASEURL,
    clientID: process.env.AUTH0_CLIENTID,
    issuerBaseURL: process.env.AUTH0_ISSUERBASE
};

const authMiddleware = auth(config);

const checkUserInDatabase = async (req, res, next) => {
    if (req.oidc && req.oidc.user) {
        const { email, sub } = req.oidc.user;
        const [provider, provider_id] = sub.split('|');

        try {
            // Check if user exists
            const { rows: existingUser } = await client.execute(
                `SELECT * FROM users WHERE provider = '${provider}' AND provider_id = '${provider_id}'`
            );

            if (!existingUser.length) {
                // Insert new user
                await client.execute(
                    `INSERT INTO users (email, provider, provider_id) VALUES ('${email}', '${provider}', '${provider_id}')`
                );
                console.log("New OAuth user inserted into database");
            } else {
                console.log("OAuth user already exists in the database");
            }
        } catch (error) {
            console.error("Error checking or inserting user into the database:", error);
        }
    }
    next();
};

export { authMiddleware, checkUserInDatabase };
