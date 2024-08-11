require("dotenv/config");

const config = {
  port: process.env.PORT,
  databaseURL: process.env.DATABASE_URL,
  secret: process.env.SECRET,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION,
};

module.exports = { config };
