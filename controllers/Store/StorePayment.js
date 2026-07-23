const prisma = require("../../config/prisma");


exports.rejectedPayment = (req, res) => {
  try {
    res.send("Hello rejected Payment");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
//ดูprocess การรับออเดอร์ แบบอัตโนมัติ จัดส่งล่าช้า 
exports.changeStatusPayment = async (req, res) => {
  try {
    const { status } = req.body;
    const storeId = req.store.id;

    const paymentStatus = await prisma.delivery.update({
      where: {
        id: storeId,
      },
      data: {
        paymentStatus,
      },
    });
    res.send("Hello change Status Payment");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
