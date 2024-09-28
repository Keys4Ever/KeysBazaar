import { createClient } from "@libsql/client";
import 'dotenv/config';

const turso = createClient({
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_TOKEN,
});

export default turso;
