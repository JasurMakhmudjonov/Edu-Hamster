const prisma = require("../utils/connection");
const otpGenerator = require("otp-generator");
const sendMail = require("../utils/mail");
const authValidator = require("../validators/auth.validator");
const bcrypt = require("bcrypt");
const { createToken } = require("../utils/jwt");
const crypto = require("crypto");
const redisClient = require("../utils/redis");

function generateReferralCode() {
  return crypto.randomBytes(4).toString("hex"); 
}

function generateReferralCode() {
  return crypto.randomBytes(4).toString("hex"); 
}

const register = async (req, res, next) => {
  try {
    const { fullname, username, email, password } = req.body;

    const { error } = await authValidator.registerSchema.validateAsync(
      req.body
    );
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const existsUser = await prisma.users.findFirst({ where: { email } });
    if (existsUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (username) {
      const existsUserByUsername = await prisma.users.findFirst({
        where: { username },
      });
      if (existsUserByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    let referralCode;
    do {
      referralCode = generateReferralCode();
    } while (await prisma.users.findUnique({ where: { referralCode } }));

    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });

    await sendMail(email, otp);
    console.log(otp);

    const registeredUser = await redisClient.setEx(
      email,
      600, 
      JSON.stringify({ fullname, email, password, username, referralCode, otp })
    );
    console.log(await redisClient.get(email));

    res.status(201).json({
      message: "User registered successfully, please verify your email",
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { code, email } = req.body;
    const { error } = authValidator.verifySchema.validateAsync(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const otpData = await redisClient.get(email);
    if (!otpData) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    const { fullname, username, password, referralCode, otp } =
      JSON.parse(otpData);
    if (otp !== code) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        fullname,
        username,
        email,
        password: hashedPwd,
        referralCode,
      },
    });

    await redisClient.del(email);

    const token = createToken({ id: user.id, isAdmin: user.isAdmin });
    res.json({ message: "User verified successfully", token });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { error } = authValidator.loginSchema.validateAsync(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = createToken({ id: user.id, isAdmin: user.isAdmin });
    res.json({ message: "Logged in successfully", token });
  } catch (error) {
    next(error);
  }
};

const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { error } = authValidator.adminLoginSchema.validateAsync(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const user = await prisma.users.findFirst({
      where: { email, isAdmin: true },
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = createToken({ id: user.id, isAdmin: user.isAdmin });
    res.json({ message: "Admin logged in successfully", token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verify,
  login,
  adminLogin,
};
