const prisma = require("../utils/connection");
const userValidator = require("../validators/user.validator");
const path = require("path");
const { v4: uuid } = require("uuid");

const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await prisma.users.findMany();
    if (!allUsers) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json({ message: "All users", data: allUsers });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User", data: user });
  } catch (error) {
    next(error);
  }
};

const getUserByIdByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User", data: user });
  } catch (error) {
    next(error);
  }
};

const updateByUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { fullname, password, username } = req.body;

    const { error } = await userValidator.updateUserSchema.validateAsync(
      req.body
    );
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (username) {
      const existsUserByUsername = await prisma.users.findFirst({
        where: { username },
      });
      if (existsUserByUsername && existsUserByUsername.id !== req.user.id) {
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    let imageName = undefined;
    if (req.files && req.files.profileImage) {
      const file = req.files.profileImage;
      const allowedExtensions = [".png", ".jpg", ".jpeg", ,];
      const extension = path.extname(file.name);

      if (!allowedExtensions.includes(extension)) {
        return res.status(400).json({ message: "Invalid file type" });
      }

      imageName = `${uuid()}${extension}`;
      const uploadPath = `${process.cwd()}/uploads/${imageName}`;

      file.mv(uploadPath, (err) => {
        if (err) {
          console.error("Error uploading file:", err);
          return res.status(500).json({ message: "File upload failed" });
        }
      });
    }

    let hashedPassword = undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = await prisma.users.update({
      where: { id: req.user.id },
      data: {
        fullname,
        password: hashedPassword,
        username,
        profileImage: imageName,
      },
    });

    res.status(200).json({ message: "User updated successfully", data: user });
  } catch (error) {
    next(error);
  }
};

const updateByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      fullname,
      username,
      email,
      password,
      referralCode,
      totalCoins,
      level,
      points,
      isAdmin,
    } = req.body;

    const { error } = userValidator.updateUserSchemaByAdmin.validate(
      req.body
    );
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const dataToUpdate = {
      fullname,
      username,
      email,
      referralCode,
      totalCoins: +totalCoins,
      level,
      points,
      isAdmin: Boolean(isAdmin),
    };

    if (password) {
      dataToUpdate.password = await bcrypt.hash(password, 10);
    }

    if (req.files && req.files.profileImage) {
      const file = req.files.profileImage;
      const allowedExtensions = [".png", ".jpg", ".jpeg"];
      const extension = path.extname(file.name);

      if (!allowedExtensions.includes(extension)) {
        return res.status(400).json({ message: "Invalid file type" });
      }

      const imageName = `${uuid()}${extension}`;
      const uploadPath = `${process.cwd()}/uploads/${imageName}`;

      file.mv(uploadPath, (err) => {
        if (err) {
          console.error("Error uploading file:", err);
          return res.status(500).json({ message: "File upload failed" });
        }
      });

      dataToUpdate.profileImage = imageName;
    }

    const updatedUser = await prisma.users.update({
      where: { id },
      data: dataToUpdate,
    });

    res.json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.users.delete({
      where: { id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const tapToEarnCoins = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const coinsPerTap = user.level;

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        totalCoins: {
          increment: coinsPerTap,
        },
      },
    });

    res.status(200).json({
      message: `Tap successful. You earned ${coinsPerTap} coins.`,
      data: {
        totalCoins: updatedUser.totalCoins,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateByUser,
  getUserByIdByAdmin,
  updateByAdmin,
  deleteUser,
  tapToEarnCoins,
};
