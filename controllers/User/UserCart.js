const prisma = require("../../config/prisma");

exports.getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const userCart = await prisma.cart.findFirst({
      where: {
        orderById: userId,
      },
      include: {
        store: true,
        menu: {
          include: {
            menu: true,
          },
        },
      },
    });

    if (!userCart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    res.send(userCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.readCart = async (req, res) => {
  try {
    const { storeId } = req.params;
    const userId = req.user.id;

    const cart = await prisma.cart.findFirst({
      where: {
        orderById: userId,
        storeId: Number(storeId),
      },
      include: {
        store: {
          select: {
            id: true,
            storeName: true,
          },
        },
        menu: {
          include: {
            menu: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    let cartTotal = 0;
    let totalItems = 0;

    const menus = cart.menu.map((item) => {
      let options = [];
      let optionTotal = 0;

      // แปลง String -> Array
      if (item.options && item.options !== "") {
        try {
          options = JSON.parse(item.options);

          optionTotal = options.reduce(
            (sum, option) => sum + (option.extraPrice || 0),
            0
          );
        } catch (err) {
          options = [];
        }
      }

      const subTotal = (item.price + optionTotal) * item.count;

      cartTotal += subTotal;
      totalItems += item.count;

      return {
        id: item.id,
        menuId: item.menuId,
        menuName: item.menu.menuItem,
        description: item.menu.description,
        price: item.price,
        count: item.count,
        options,
        optionTotal,
        subTotal,
      };
    });

    res.send({
      cartId: cart.id,
      store: cart.store,
      totalItems,
      cartTotal,
      menus,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.userCart = async (req, res) => {
  try {
    const { menuId, count = 1, options = [] } = req.body;
    const userId = req.user.id;

    const menu = await prisma.menu.findFirst({
      where: {
        id: Number(menuId),
      },
    });
    if (!menu) {
      return res.status(400).json({ messege: "menu not found!!!" });
    }

    let cart = await prisma.cart.findFirst({
      where: {
        orderById: userId,
        storeId: menu.storeId,
      },
    });

    // ถ้ายังไม่มี cart สร้าง
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          orderById: userId,
          storeId: menu.storeId,
          cartTotal: 0,
        },
      });
    }

    const optionString = JSON.stringify(options);

    const existMenu = await prisma.menuOnCart.findFirst({
      where: {
        cartId: cart.id,
        menuId: Number(menuId),
        options: optionString,
      }
    })
    if (existMenu) {
      const updateCart = await prisma.menuOnCart.update({
        where: {
          id: existMenu.id
        },
        data: {
          count: existMenu.count + Number(count)
        }
      })
      return res.send(updateCart);
    }

    const addCart = await prisma.menuOnCart.create({
      data: {
        cartId: cart.id,
        menuId: Number(menuId),
        count: count,
        price: menu.price,
        options: optionString,
      },
    });

    res.send(addCart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateUserCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { count } = req.body;
    const userId = req.user.id;


    const item = await prisma.menuOnCart.findFirst({
      where: {
        id: Number(id),
        cart: {
          orderById: userId
        }
      }
    });


    if (!item) {
      return res.status(404).json({
        message: "cart item not found"
      });
    }


    // ถ้าจำนวนเหลือ 0 ให้ลบ
    if (count <= 0) {
      await prisma.menuOnCart.delete({
        where: {
          id: Number(id)
        }
      });

      return res.send({
        message: "removed"
      });
    }


    const update = await prisma.menuOnCart.update({
      where: {
        id: Number(id)
      },
      data: {
        count
      }
    });


    res.send(update);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.removeUserCart = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;


    const item = await prisma.menuOnCart.findFirst({
      where: {
        id: Number(id),
        cart: {
          orderById: userId
        }
      }
    });


    if (!item) {
      return res.status(404).json({
        message: "not found"
      });
    }


    await prisma.menuOnCart.delete({
      where: {
        id: Number(id)
      }
    });


    res.send({
      message: "delete success"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
