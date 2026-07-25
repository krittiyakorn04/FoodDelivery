const prisma = require("../../config/prisma");

//DeliveryZone
exports.addDeliveryZone = async (req, res) => {
  try {
    //ระยะทาง
    const { nameZone, fee } = req.body;
    const storeId = req.store.id;

    if (!nameZone) {
      return res.status(400).json({
        message: "กรุณาระบุชื่อพื้นที่",
      });
    }

    if (fee == null || fee < 0) {
      return res.status(400).json({
        message: "ค่าจัดส่งไม่ถูกต้อง",
      });
    }

    const checkDeliveryZone = await prisma.deliveryZone.findFirst({
      where: {
        storeId,
        nameZone,
      },
    });
    if (checkDeliveryZone) {
      return res
        .status(400)
        .json({ message: "This DeliveryZone already exits!!" });
    }

    const deliveryZone = await prisma.deliveryZone.create({
      data: {
        storeId,
        nameZone,
        fee,
      },
    });

    res.send(deliveryZone);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateDeliveryZone = async (req, res) => {
  try {
    const { id } = req.params;
    const { nameZone, fee } = req.body;
    const storeId = req.store.id;

    if (!nameZone) {
      return res.status(400).json({
        message: "กรุณาระบุชื่อพื้นที่",
      });
    }

    if (fee == null || fee < 0) {
      return res.status(400).json({
        message: "ค่าจัดส่งไม่ถูกต้อง",
      });
    }

    // เช็กว่าโซนนี้เป็นของร้านนี้
    const deliveryZone = await prisma.deliveryZone.findFirst({
      where: {
        id: Number(id),
        storeId,
      },
    });

    if (!deliveryZone) {
      return res.status(404).json({
        message: "ไม่พบพื้นที่จัดส่ง",
      });
    }

    const result = await prisma.deliveryZone.update({
      where: {
        id: Number(id),
      },
      data: {
        nameZone,
        fee,
      },
    });

    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.removeDeliveryZone = async (req, res) => {
  try {
    const { id } = req.params
    const storeId = req.store.id;

    const deliveryZone = await prisma.deliveryZone.findFirst({
      where: {
        storeId,
        id: Number(id)
      },
    });

    if (!deliveryZone) {
      return res.status(404).json({ message: "deliveryZone not found!" });
    }

    const remove = await prisma.deliveryZone.delete({
      where:{
        id: Number(req.params.id),
      }
    })
    res.send("ลบสำเร็จ");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeRainSurcharge = async (req, res) => {
  try {
    const { rainSurchargeActive, rainSurcharge } = req.body
    const storeId = req.store.id

    const store = await prisma.store.update({
      where: { id: storeId },
      data: { 
        rainSurchargeActive,
        rainSurcharge  // อัปเดตค่าพร้อมกันเลย
      }
    })

    res.send(store)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server Error" })
  }
}

//Delivery
exports.listDelivery = async (req, res) => {
  const storeId = req.store.id;

  const delivery = await prisma.delivery.findMany({
    where: {
      storeId,
    },
    include: {
      orderRound: {
        select: {
          roundNumber: true,
          startTime: true,
          endTime: true, //ก่อน cutoffMinutes
        },
      },
      orders: {
        select: {
          deliveryType: true,
          status: true,
          totalPrice: true,
          note: true,
          outOfStock: true,
        },
      },
    },
  });

  try {
    res.send(delivery);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.readDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await prisma.delivery.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        orderRound: {
          select: {
            roundNumber: true,
            startTime: true,
            endTime: true, //ก่อน cutoffMinutes
          },
        },
        orders: {
          select: {
            deliveryType: true,
            status: true,
            totalPrice: true,
            note: true,
            outOfStock: true,
          },
        },
      },
    });

    res.send(products);
    res.send("Hello read Delivery");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeStatusDelivery = async (req, res) => {
  try {
    const { status } = req.body;
    const storeId = req.store.id;

    const deliveryStatus = await prisma.delivery.update({
      where: {
        id: storeId,
      },
      data: {
        deliveryStatus,
      },
    });

    res.send("Hello change Status Delivery");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
