import dotenv from 'dotenv'
dotenv.config()

export const autoEnv = {
    PORT: process.env.PORT,
    JWT_SECRET: process.env.JWT_SECRET,
    REFRESH_SECRET: process.env.REFRESH_SECRET,
    PREFIX: process.env.PREFIX,
    CRYPTO_KEY: process.env.CRYPTO_SECRET,
    USER_MAILER: process.env.USER_MAILER,
    PASSWORD_MAILER: process.env.PASSWORD_MAILER
}