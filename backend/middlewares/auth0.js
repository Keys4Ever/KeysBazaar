import { auth } from "express-openid-connect";
import dotenv from "dotenv";
import client from "../config/turso.js";

dotenv.config();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASEURL,
  clientID: process.env.AUTH0_CLIENTID,
  issuerBaseURL: process.env.AUTH0_ISSUERBASE,
};

const authMiddleware = auth(config);

const checkUserInDatabase = async (req, res, next) => {
  if (req.oidc && req.oidc.user) {
    const { email, user_id, nickname, picture } = req.oidc.user;
    const [provider, provider_id] = user_id.split("|");

    try {
      const { rows: existingUser } = await client.execute({
        sql: "SELECT * FROM users WHERE provider = ? AND provider_id = ?",
        args: [provider, provider_id],
      });

      if (!existingUser.length) {
        await client.execute({
          sql: "INSERT INTO users (email, provider, provider_id, username, profile_picture) VALUES (?,?,?,?,?)",
          args: [email, provider, provider_id, nickname, picture],
        });
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
