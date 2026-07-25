const prisma = require("../../config/prisma");



exports.getOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        const getOrder = await prisma.order.findMany({
            where: {
                customerId: userId,
                status: {
                    in: ["PENDING" ,"CONFIRMED" ,"PREPARING" ]
                },
            },
            include: {
                store: true,
                delivery: true,
                menu: {
                    include: {
                        menu: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.send(getOrder);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.createOrder = async (req, res) => {
  try {
    const { cartId, addressId, note } = req.body;
    const userId = req.user.id;

    // 1. หาตะกร้า
    const cart = await prisma.cart.findFirst({
      where: {
        id: Number(cartId),
        orderById: userId,
      },
      include: {
        menu: true,
        store: true,
      },
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // 2. เช็คว่าตะกร้าว่างหรือไม่
    if (cart.menu.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 3. เช็คที่อยู่
    const address = await prisma.address.findFirst({
      where: {
        id: Number(addressId),
        customerId: userId,
      },
    });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    let orderRoundId = null;

    // 4. ถ้าร้านรับเป็นรอบ
    if (cart.store.orderMode === "ROUND") {
      const round = await prisma.orderRound.findFirst({
        where: {
          storeId: cart.store.id,
          status: "OPEN",
        },
      });

      if (!round) {
        return res.status(400).json({
          message: "ร้านยังไม่เปิดรับออเดอร์ในขณะนี้",
        });
      }

      orderRoundId = round.id;
    }

    // 5. สร้าง Delivery
    const delivery = await prisma.delivery.create({
      data: {
        storeId: cart.store.id,
        orderRoundId,
      },
    });

    // 6. สร้าง Order
    const order = await prisma.order.create({
      data: {
        customerId: userId,
        storeId: cart.store.id,
        deliveryId: delivery.id,
        orderRoundId,
        totalPrice: cart.cartTotal,
        note,
      },
    });

    // 7. ย้ายสินค้าในตะกร้าไป Order
    await prisma.menuOnCart.updateMany({
      where: {
        cartId: cart.id,
      },
      data: {
        orderId: order.id,
      },
    });

    // 8. ลบตะกร้า (หรือจะลบหลังชำระเงินก็ได้)
    await prisma.cart.delete({
      where: {
        id: cart.id,
      },
    });

    res.send(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.uploadSlip =  (req, res) => {
    try {
        res.send('Hello upload Slip')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}