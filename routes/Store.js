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
} = require("../controllers/Store/StoreCreate");
const {
  listMenuCategory,
  addMenuCategory,
  updateMenuCategory,
  deleteMenuCategory,
} = require("../controllers/Store/StoreMenuCategory");
const {
  listMenu,
  addMenu,
  updateMenu,
  deleteMenuy,
} = require("../controllers/Store/StoreMunu");

const router = express.Router();

//Authen
router.post("/store/register", register); //+post บช.ร้าน
router.post("/store/login", login);
router.post("/store/current-restau", currentRestau); //ยืนยันการเข้าสู่ระบบ

//createStore //สร้างร้าน
router.get("/store/profile", getStore);
router.put("/store/profile", updateStore); 
router.patch("/store/profile/:id/stutus", removeStore); //ลบ

router.put("/store/delivery-zones/:id", updateDeliveryZone);
router.put("/store/delivery-zones/:id", updateDeliveryZone);

//MenuCategory
router.get("/store/listMenuCategory", listMenuCategory);
router.post("/store/addMenuCategory", addMenuCategory);
router.put("/store/updateMenuCategory", updateMenuCategory);
router.delete("/store/deleteMenuCategory", deleteMenuCategory);

//Menu
router.get("/store/listMenu", listMenu);
router.post("/store/addMenu", addMenu);
router.put("/store/updateMenu", updateMenu);
router.delete("/store/deleteMenu", deleteMenuy);

//Order

//Delivery

module.exports = router;
