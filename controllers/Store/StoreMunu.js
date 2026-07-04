const prisma = require("../../config/prisma");

exports.getMenu = async (req, res) => {
  try {
    const storeId = req.store.id;

    const menu = await prisma.menu.findMany();

    res.send(menu);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.addMenu = async (req, res) => {
  try {
    const { menuItem, categoryId, description, price, imageUrl,options } = req.body;
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
              required: opt.required || false,
              maxRequire: opt.maxRequire || 1,
              choices: {
                create:
                  opt.choices?.map((c) => ({
                    name: c.name,
                    extraPrice: parseFloat(c.extraPrice) || 0,
                  })) || [],
              },
            })) || [],
        },
      },
    });

    res.send(menu);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateMenu = (req, res) => {
  try {
    res.send("Hello update Menu");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.removeMenu = (req, res) => {
  try {
    res.send("Hello remove Menu");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeAvailabilityStatus = (req, res) => {
  try {
    res.send("Hello change Availability Status");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getMenuBy = (req, res) => {
  try {
    res.send("Hello Menu By");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getSearchFilters = (req, res) => {
  try {
    res.send("Hello Search Filters");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
