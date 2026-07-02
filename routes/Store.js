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
  updateDeliveryZone,
  removeDeliveryZone,
  changeRainSurcharge,
  changeStoreStatus,
  changeOrderMode,
  changeStoreOpen,
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
} = require("../controllers/Store/StoreDelivery");
const { rejectedPayment, changeStatusPayment } = require("../controllers/Store/StorePayment");

const router = express.Router();

//Authen
router.post("/store/register", register); //+post บช.ร้าน
router.post("/store/login", login);
router.get("/store/current-restau", currentRestau); //ยืนยันการเข้าสู่ระบบ

//createStore //สร้างร้าน
router.get("/store/profile", getStore);
router.put("/store/profile", updateStore);
router.patch("/store/profile/:id/stutus", removeStore); //ลบ ปุ่มลบร้านแต่จริงๆเก็บไว้แต่เปลี่ยนสถานะ
//update password

router.put("/store/delivery-zones/:id", updateDeliveryZone);
router.delete("/store/delivery-zones/:id", removeDeliveryZone);
router.patch("/store/rainSurchargeActive", changeRainSurcharge);

router.patch("/store/storeStatus", changeStoreStatus);
router.patch("/store/storeOpen", changeStoreOpen);
router.patch("/store/storeOrderMode", changeOrderMode);

//MenuCategory
router.get("/store/category", listMenuCategory);
router.post("/store/category", addMenuCategory);
router.put("/store/category/:id", updateMenuCategory);
router.delete("/store/category/:id", removeMenuCategory);

//Menu
router.get("/store/menu", getMenu);
router.post("/store/addMenu", addMenu);
router.put("/store/updateMenu/:id", updateMenu);
router.delete("/store/deleteMenu/:id", removeMenu);
router.patch("/store/availability/:id/status", changeAvailabilityStatus);

router.get("/store/menuby", getMenuBy);
router.get("/store/search/filters", getSearchFilters);

//orderRound
router.get("/store/order-round", listOrderRound);
router.post("/store/order-round", addOrderRound);
router.put("/store/order-round/:id", updateOrderRound);
router.delete("/store/order-round/:id", removeOrderRound);

router.patch("/store/pattern", changePattern);
router.put("/store/order-limit", orderLimit);
router.patch("/store/round/:id/status", changeRoundStatus);

//Order
router.get("/store/order", listOrder);
router.get("/store/order/:id", readOrder);
router.patch("/store/order/:id/Status", changeStatusOrder);

//Delivery
router.get("/store/delivery", listDelivery);
router.get("/store/delivery/:id", readDelivery);
router.patch("/store/delivery/:id/Status", changeStatusDelivery);

//Payment
router.post("/store/payment/:id", rejectedPayment);
router.patch("/store/payment/:id/status", changeStatusPayment);


module.exports = router;
