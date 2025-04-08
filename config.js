import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET manquant dans .env");
}
export default {
    PORT: process.env.PORT || 3000,
    API_PORT: process.env.API_PORT || 3001,
    JWT_SECRET: process.env.JWT_SECRET,
};