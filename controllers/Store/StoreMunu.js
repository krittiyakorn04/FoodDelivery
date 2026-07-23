const prisma = require("../../config/prisma");

//เสร็จ เหลือFilters
exports.getMenu = async (req, res) => {
  try {
    const storeId = req.store.id;

    const menu = await prisma.menu.findMany({
      where: {
        storeId,
      },
      include: {
        options: { include: { choices: true } },
      },
    });

    res.send(menu);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.addMenu = async (req, res) => {
  try {
    const { menuItem, categoryId, description, price, imageUrl, options } =
      req.body;
    const storeId = req.store.id;

    const category = await prisma.menuCategory.findFirst({
      where: {
        id: Number(categoryId),
        storeId,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    if (!menuItem) {
      return res.status(400).json({ messege: "name Menu is require!!!" });
    }

    const existMenu = await prisma.menu.findFirst({
      where: {
        storeId,
        menuItem,
      },
    });

    if (existMenu) {
      return res.status(400).json({ message: "This Menu already exits!!" });
    }

    const menu = await prisma.menu.create({
      data: {
        storeId,
        categoryId: parseInt(categoryId),
        menuItem,
        price: parseFloat(price),
        description,
        imageUrl,
        options: {
          create:
            options?.map((opt) => ({
              label: opt.label,
              required: opt.required ?? false,
              maxRequire: opt.maxRequire,
              choices: {
                create:
                  opt.choices?.map((c) => ({
                    name: c.name,
                    extraPrice: parseFloat(c.extraPrice),
                  })) || [],
              },
            })) || [],
        },
      },
      include: {
        options: { include: { choices: true } },
      },
    });

    res.send(menu);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const { menuItem, categoryId, description, price, imageUrl, options } =
      req.body;
    const storeId = req.store.id;

    const category = await prisma.menuCategory.findFirst({
      where: {
        id: Number(categoryId),
        storeId,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    if (!menuItem) {
      return res.status(400).json({ messege: "name Menu is require!!!" });
    }

    const existMenu = await prisma.menu.findFirst({
      where: {
        storeId,
        menuItem,
        NOT: {
          id: Number(req.params.id),
        },
      },
    });

    if (existMenu) {
      return res.status(400).json({ message: "This Menu already exits!!" });
    }

    // ก่อนจะอัพเดต ลบอันเก่าก่อน
    const oldOptions = await prisma.menuOption.findMany({
      where: {
        menuId: Number(req.params.id),
      },
    });
    await prisma.optionChoice.deleteMany({
      where: {
        optionId: {
          in: oldOptions.map((o) => o.id),
        },
      },
    });
    await prisma.menuOption.deleteMany({
      where: {
        menuId: Number(req.params.id),
      },
    });

    const menu = await prisma.menu.update({
      where: {
        id: Number(req.params.id),
        storeId,
      },
      data: {
        categoryId: parseInt(categoryId),
        menuItem,
        price: parseFloat(price),
        description,
        imageUrl,
        options: {
          create:
            options?.map((opt) => ({
              label: opt.label,
              required: opt.required ?? false,
              maxRequire: opt.maxRequire,
              choices: {
                create:
                  opt.choices?.map((c) => ({
                    name: c.name,
                    extraPrice: parseFloat(c.extraPrice),
                  })) || [],
              },
            })) || [],
        },
      },
      include: {
        options: { include: { choices: true } },
      },
    });

    res.send(menu);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.removeMenu = async (req, res) => {
  try {
    const storeId = req.store.id;
    const menu = await prisma.menu.findFirst({
      where: {
        storeId,
        id: Number(req.params.id),
      },
    });

    if (!menu) {
      return res.status(404).json({ message: "Menu not found!" });
    }

    await prisma.menu.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.send("Menu deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeAvailabilityStatus = async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const storeId = req.store.id;

    const AvailabilityStatus = await prisma.menu.update({
      where: {
        id: Number(req.params.id),
        storeId,
      },
      data: {
        isAvailable,
      },
    });

    res.send(AvailabilityStatus);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getMenuBy = async (req, res) => {
  try {
    res.send("Hello Menu By");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getSearchFilters = async (req, res) => {
  try {
    res.send("Hello Search Filters");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
