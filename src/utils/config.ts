require('dotenv/config')
export const HOST: string = process.env.HOST || 'localhost:3131'
export const PORT: number = <any>process.env.PORT || 3131
export const ENV: number = <any>process.env.ENV || 'dev'
export const FIREBASE_API_KEY: string = process.env.FIREBASE_API_KEY
export const FIREBASE_AUTH_DOMAIN: string = process.env.FIREBASE_AUTH_DOMAIN
export const FIREBASE_DATABASE_URL: string = process.env.FIREBASE_DATABASE_URL
export const FIREBASE_PROJECT_ID: string = process.env.FIREBASE_PROJECT_ID
export const FIREBASE_STORAGE_BUCKET: string = process.env.FIREBASE_STORAGE_BUCKET
export const FIREBASE_MESSAGING_SENDER_ID: string = process.env.FIREBASE_MESSAGING_SENDER_ID
export const FIREBASE_APP_ID: string = process.env.FIREBASE_APP_ID
export const FIREBASE_MEASUREMENT_ID: string = process.env.FIREBASE_MEASUREMENT_ID
