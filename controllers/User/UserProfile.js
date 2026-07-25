const prisma = require("../../config/prisma");

exports.profileUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.customer.findFirst({
      where: {
        id: userId,
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

exports.updateProfileUser = async (req, res) => {
  try {
    const { username}  = req.body
    const userId = req.user.id;

    const currentUser = await prisma.customer.findFirst({
      where: {
        id: userId,
      },
    });
    if (currentUser.username === username) {
      return res.status(400).json({ message: "เป็น Username เดิมอยู่แล้ว" });
    }

    const chackeUsername = await prisma.customer.findFirst({
      where: {
        username,
      },
    });

    if (chackeUsername) {
      return res.status(400).json({ message: "This username already exits!!" });
    }

    const user = await prisma.customer.update({
        where:{
            id: userId
        },
        data:{
            username
        }
    });
    res.send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
