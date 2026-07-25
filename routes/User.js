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
const { getallStores, getProfile } = require("../controllers/Store/StoreCreate");
const { authUser, userCheck } = require("../middlewares/auth");

const router = express.Router();

//Authen
router.post("/user/register", register);
router.post("/user/login", login);
router.post("/user/current-user",authUser,userCheck, currentUser); 



//ลูกค้าเข้าดูร้าน
router.get("/store/listprofile", getallStores); //
router.get("/store/profile/:id", getProfile); //หน่าร้าน


//Address
router.get("/user/address",authUser, listAddress);
router.post("/user/address",authUser, addAddress);
router.put("/user/address/:id",authUser, updateAddress);
router.delete("/user/address/:id",authUser, removeAddress);

//Profile
router.get("/user/profile",authUser, profileUser);
router.put("/user/profile",authUser, updateProfileUser);

//Cart
router.get("/user/cart", getUserCart);
router.post("/user/cart", userCart);
router.put("/user/cart/:id", updateUserCart);
router.delete("/user/cart/:id", removeUserCart);

//Order
router.get("/user/order", getOrder);
router.post("/user/order", createOrder);
router.post("/user/payment/:id", uploadSlip);

//Delivery
router.get("/user/delivery", getDelivery);
router.get("/user/delivery/:id", readUserDelivery);

//Review
router.get("/user/review/:id", getReview);
router.post("/user/review/:id", updateReview);
router.delete("/user/review/:id", removeReview);

module.exports = router;
