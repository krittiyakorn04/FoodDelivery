const express = require("express");
const {
  register,
  login,
  currentUser,
} = require("../controllers/User/UserAuth");
const {
  listAddress,
  addAddress,
  updateAddress,
  removeAddress,
} = require("../controllers/User/UserAddress");
const {
  getUserCart,
  userCart,
  updateUserCart,
  removeUserCart,
} = require("../controllers/User/UserCart");
const {
  createOrder,
  getOrder,
  changeStatusOrderUser,
  uploadSlip,
  changePaymentMethod,
} = require("../controllers/User/UserOrder");
const {
  profileUser,
  updateProfileUser,
} = require("../controllers/User/UserProfile");
const {
  getDelivery,
  readDelivery,
  readUserDelivery,
} = require("../controllers/User/UserDelivery");
const {
  getReview,
  removeReview,
  updateReview,
} = require("../controllers/User/UserReview");

const router = express.Router();

//Authen
router.post("/user/register", register);
router.post("/user/login", login);
router.get("/user/current-user", currentUser);

//Address
router.get("/user/address", listAddress);
router.post("/user/address", addAddress);
router.put("/user/address/:id", updateAddress);
router.delete("/user/address/:id", removeAddress);

//Profile
router.get("/user/profile", profileUser);
router.put("/user/profile", updateProfileUser);

//Cart
router.get("/user/cart", getUserCart);
router.post("/user/cart", userCart);
router.put("/user/cart/:id", updateUserCart);
router.delete("/user/cart/:id", removeUserCart);

//Order
router.get("/user/order", getOrder);
router.post("/user/order", createOrder);
router.patch("/user/order/:id/Status", changeStatusOrderUser);
router.patch("/user/payment/:id/Method", changePaymentMethod);
router.post("/user/payment/:id", uploadSlip);

//Delivery
router.get("/user/delivery", getDelivery);
router.get("/user/delivery/:id", readUserDelivery);

//Review
router.get("/user/review/:id", getReview);
router.post("/user/review/:id", updateReview);
router.delete("/user/review/:id", removeReview);

module.exports = router;
