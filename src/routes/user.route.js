const { Router } = require("express");
const {
  getAllUsers,
  getUserById,
  deleteUser,
  updateByUser,
  updateByAdmin,
  getUserByIdByAdmin,
} = require("../controllers/user.controller");
const { isAdmin } = require("../middlewares/is-admin.middleware");
const { isAuth } = require("../middlewares/is-auth.middleware");
const router = Router();

const route = "/users";

router.get(`${route}/`, isAdmin, getAllUsers);
router.get(`/user`, isAuth, getUserById);
router.get(`/admin${route}/:id`, isAdmin, getUserByIdByAdmin);
router.put(`${route}/:id`, isAuth, updateByUser);
router.put(`/admin${route}/:id`, isAuth, updateByAdmin);
router.delete(`${route}/:id`, deleteUser);

module.exports = router;
