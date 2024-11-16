import { Resend } from 'resend';
import "dotenv/config";
    
const resend = new Resend(process.env.RESEND_API_KEY);


export default resend;