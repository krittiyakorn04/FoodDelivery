const express = require("express");
const {
  register,
  login,
  currentAdmin,
} = require("../controllers/Admin/AdminAuthen");
const {
  changeCustomerStatus,
  changemerchantStatus,
} = require("../controllers/Admin/AdminManagement");

const router = express.Router();

//Authen
router.post("/admin/register", register);
router.post("/admin/login", login);
router.get("/admin/current-restau", currentAdmin);

//Admin
router.patch("/admin/:id/customerStatus", changeCustomerStatus);
router.patch("/admin/:id/merchantStatu", changemerchantStatus);

module.exports = router;
