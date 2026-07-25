const prisma = require("../../config/prisma");

exports.listAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.customer.findFirst({
      where: {
        customerId: userId,
      },
      include: {
        addresses: true,
      },
    });
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//เพิ่มdefaul ชื่อ เบอร์
exports.addAddress = async (req, res) => {
  try {
    const { label, address } = req.body;
    const userId = req.user.id;

    const newAddress = await prisma.address.create({
      data: {
        label,
        address,
        customerId: userId,
      },
    });
    res.send(newAddress);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const { label, address } = req.body;
    const userId = req.user.id;

    const user = await prisma.address.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        label,
        address,
      },
    });
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.removeAddress = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id;

    const findaddress = await prisma.address.findFirst({
      where: {
        customerId: userId,
        id: Number(id),
      },
    });

    if (!findaddress) {
      return res.status(404).json({ message: "address not found!" });
    }

    const user = await prisma.address.delete({
      where: {
        id: Number(id),
      },
    });
    res.send(" remove Address");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
