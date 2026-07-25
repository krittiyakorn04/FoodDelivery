const prisma = require("../../config/prisma");

exports.listOrder = async (req, res) => {
  try {
    const storeId = req.store.id;

    const orders = await prisma.order.findMany({
      where: {
        storeId,
        deliveryType: true,
        status: true,
        totalPrice: true,
        note: true,
        outOfStock: true,
      },
      include: {
        orderRound: {
          select: {
            roundNumber: true,
            startTime: true,
            endTime: true, //ก่อน cutoffMinutes
          },
        },
      },
    });
    res.send("Hello list Order");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.readOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await prisma.delivery.findFirst({
      where: {
        id: Number(id),
        deliveryType: true,
        status: true,
        totalPrice: true,
        note: true,
        outOfStock: true,
      },
      include: {
        orderRound: {
          select: {
            roundNumber: true,
            startTime: true,
            endTime: true, //ก่อน cutoffMinutes
          },
        },
      },
    });
    res.send("Hello read Order");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//ดูprocess การรับออเดอร์ แบบอัตโนมัติ จัดส่งล่าช้า ติดไว้
exports.changeStatusOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const storeId = req.store.id;

    const order = await prisma.order.findFirst({
      where: {
        id: Number(id),
        storeId: req.store.id,
      },
    });

    const orderStatus = await prisma.order.update({
      where: {
        id: Number(id),
      },
      data: {
        orderStatus,
      },
    });
    res.send("Hello change Status Order");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
