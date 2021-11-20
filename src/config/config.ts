export default {
  port: process.env.PORT,
  environment: process.env.NODE_ENV,
  username: process.env.MONGODB_USERNAME,
  password: process.env.MONGODB_PASSWORD,
  jwt_secret: process.env.JWT_SECRET,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_secret: process.env.GOOGLE_SECRET,
  redis_url: process.env.REDIS_URL
}
