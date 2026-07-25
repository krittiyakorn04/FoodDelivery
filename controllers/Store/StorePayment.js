const prisma = require("../../config/prisma");

exports.rejectedPayment = (req, res) => {
  try {
    res.send("Hello rejected Payment");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeStatusPayment = async (req, res) => {
  try {
    const { id, status } = req.body;
    const storeId = req.store.id;

    const payment = await prisma.payment.findFirst({
      where: {
        id: Number(id),
        storeId: req.store.id,
      },
    });

    if (!payment) {
      return res.status(404).json({
        message: "ไม่พบรายการชำระเงิน",
      });
    }

    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status,
      },
    });
    res.send("Hello change Status Payment");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
