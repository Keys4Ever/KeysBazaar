// config.js
export const fileUploadConfig = {
    useTempFiles: true,
    tempFileDir: './uploads',
    limits: { fileSize: 10 * 1024 * 1024 },
    abortOnLimit: true
};
