const express = require("express");
const {
  register,
  login,
  currentRestau,
} = require("../controllers/Store/StoreAuth");
const {
  updateStore,
  deleteStore,
  getStore,
  removeStore,
  changeStoreStatus,
  changeOrderMode,
  changeStoreOpen,
  getProfile,
  getallStores,
  updateEmail,
  updatePassword,
  updateUsername,
} = require("../controllers/Store/StoreCreate");
const {
  listMenuCategory,
  addMenuCategory,
  updateMenuCategory,
  removeMenuCategory,
} = require("../controllers/Store/StoreMenuCategory");
const {
  listMenu,
  addMenu,
  updateMenu,
  removeMenu,
  changeAvailabilityStatus,
  getMenuBy,
  getSearchFilters,
  getMenu,
} = require("../controllers/Store/StoreMunu");
const {
  addOrderRound,
  changePattern,
  changeRoundStatus,
  updateOrderRound,
  removeOrderRound,
  listOrderRound,
  orderLimit,
} = require("../controllers/Store/StoreOrderRound");
const {
  readOrder,
  changeStatusOrder,
  listOrder,
} = require("../controllers/Store/StoreOrder");
const {
  listDelivery,
  readDelivery,
  changeStatusDelivery,
  updateDeliveryZone,
  removeDeliveryZone,
  changeRainSurcharge,
  addDeliveryZone,
} = require("../controllers/Store/StoreDelivery");
const { rejectedPayment, changeStatusPayment } = require("../controllers/Store/StorePayment");
const {  authStore, storeCheck } = require("../middlewares/auth");

const router = express.Router();

//Authen
router.post("/store/register", register); //+post บช.ร้าน รอ
router.post("/store/login", login); 
router.post("/store/current-restau", authStore,storeCheck, currentRestau); 

//createStore //สร้างร้าน
router.get("/store/profile", authStore, getStore); //
router.put("/store/profile",authStore, updateStore);
router.patch("/store/profile/change-email",authStore, updateEmail);
router.patch("/store/profile/change-password",authStore,updatePassword);
router.patch("/store/profile/change-username",authStore, updateUsername);
router.patch("/store/profile/stutus", removeStore); //ลบ ปุ่มลบร้านแต่จริงๆเก็บไว้แต่เปลี่ยนสถานะ
router.patch("/store/storeStatus", authStore, changeStoreStatus);
router.patch("/store/storeOrderMode", authStore, changeOrderMode);

//MenuCategory 
router.get("/store/category", authStore, listMenuCategory); //f
router.post("/store/category", authStore, addMenuCategory); //f
router.put("/store/category/:id", authStore, updateMenuCategory); //f
router.delete("/store/category/:id", authStore, removeMenuCategory); //f

//Menu
router.get("/store/menu", authStore, getMenu); //f
router.post("/store/addMenu", authStore, addMenu); //f
router.put("/store/updateMenu/:id", authStore, updateMenu); //f
router.delete("/store/deleteMenu/:id", authStore, removeMenu); //f 
router.patch("/store/availability/:id/status", authStore, changeAvailabilityStatus); //f

router.get("/store/menuby", getMenuBy);
router.get("/store/search/filters", getSearchFilters);

//orderRound
router.get("/store/order-round", authStore, listOrderRound);
router.post("/store/order-round", authStore, addOrderRound);
router.put("/store/order-round/:id", updateOrderRound);
router.delete("/store/order-round/:id", removeOrderRound);

router.patch("/store/pattern", changePattern);
router.patch("/store/round/:id/status", changeRoundStatus);

//Order
router.get("/store/order", listOrder);
router.get("/store/order/:id", readOrder);
router.patch("/store/order/:id/Status", changeStatusOrder);

//Delivery&&DeliveryZone
router.get("/store/delivery", listDelivery);
router.get("/store/delivery/:id", readDelivery);
router.patch("/store/delivery/:id/Status", authStore, changeStatusDelivery);

router.post("/store/delivery-zones", authStore, addDeliveryZone);
router.put("/store/delivery-zones/:id", authStore, updateDeliveryZone);
router.delete("/store/delivery-zones/:id", authStore, removeDeliveryZone);
router.patch("/store/rainSurchargeActive", authStore, changeRainSurcharge);

//Payment
router.post("/store/payment/:id", rejectedPayment);
router.patch("/store/payment/:id/status", changeStatusPayment);


module.exports = router;
