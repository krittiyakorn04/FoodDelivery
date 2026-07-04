const prisma = require("../../config/prisma");

const bcrypt = require("bcryptjs");

exports.getStore = async (req, res) => {
  try {
    const store = await prisma.store.findFirst({
      where: {
        id: req.store.id,
      },
    });

    res.send(store);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateStore = async (req, res) => {
  try {
    const {
      email,
      password, //อย่าลืม 
      username,
      phone,

      Notice,
      storeName,
      category,
      address,
      dayOpen,
      timeOpen,
      timeClose,
      openAuto,
      promptpayNumber,
      bankName,
      bankAccount,
      bankAccountName,
    } = req.body;
    const { id } = req.store;

    const hashPassword = await bcrypt.hash(password, 10);

    //เขียนด้วย  email,password เก่า ใหม่ ไม่ใส่แต่แรก ,username , phone ห้ามซ้ำ,
      // storeName ห้ามซ้ำ เปลี่ยนได้กี่ครั้ง

    const store = await prisma.store.update({
      where: {
        id: req.store.id,
      },
      data: {
        email,
        password: hashPassword,
        username,
        phone,

        Notice,
        storeName,
        category,
        address,
        dayOpen,
        timeOpen,
        timeClose,
        openAuto,
        promptpayNumber,
        bankName,
        bankAccount,
        bankAccountName,
      },
    });

    res.send(store);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.removeStore = (req, res) => { //หนังชีวิต
  try {
    res.send("Hello remove Store");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateDeliveryZone = (req, res) => {
  try {
    res.send("Hello update Store");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.removeDeliveryZone = (req, res) => {
  try {
    res.send("Hello remove DeliveryZone");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeRainSurcharge = (req, res) => {
  try {
    res.send("Hello change RainSurcharge");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeStoreStatus = (req, res) => {
  try {
    res.send("Hello change Store Status");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeStoreOpen = (req, res) => {
  try {
    res.send("Hello change Store Status");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeOrderMode = (req, res) => {
  try {
    res.send("Hello change OrderMode");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
