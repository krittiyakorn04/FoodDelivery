const prisma = require("../../config/prisma");

const bcrypt = require("bcryptjs");

//ยังไม่สมบูรณ์ รอแก้
//หน้าร้าน เอาไปไว้user
exports.getallStores = async (req, res) => {
  try {
    const store = await prisma.store.findMany({
      where: {
        accountStatus: "ACTIVE",
        status: "OPEN",
      },
      select: {
        storeName: true,
        category: true,
      },
    });

    res.send(store);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const store = await prisma.store.findFirst({
      where: {
        id: Number(req.params.id),
      },
    });

    res.send(store);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getStore = async (req, res) => {
  try {
    const store = await prisma.store.findFirst({
      where: {
        id: req.store.id,
      },
      include: {
        nameZone: true,
        fee: true,
      },
    });

    res.send(store);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const storeId = req.store.id;

    const currentStore = await prisma.store.findFirst({
      where: {
        id: storeId,
      },
    });
    if (currentStore.email === email) {
      return res.status(400).json({ message: "เป็น email เดิมอยู่แล้ว" });
    }

    const chackemail = await prisma.store.findFirst({
      where: {
        email,
      },
    });

    if (chackemail) {
      return res.status(400).json({ message: "This email already exits!!" });
    }

    const updateEmail = await prisma.store.update({
      where: {
        id: storeId,
      },
      data: {
        email,
      },
    });
    res.send(updateEmail);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const storeId = req.store.id;

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
      },
    });

    // ต้องเช็ค password เก่าก่อน
    const valid = await bcrypt.compare(oldPassword, store.password);
    if (!valid) {
      return res.status(400).json({ message: "รหัสผ่านเก่าไม่ถูกต้อง" });
    }

    // ค่อยเปลี่ยนใหม่
    const hashPassword = await bcrypt.hash(newPassword, 10);

    await prisma.store.update({
      where: {
        id: storeId,
      },
      data: { password: hashPassword },
    });

    res.send({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateUsername = async (req, res) => {
  //จำกัดการเปลี่ยน username ทุก 30 วัน
  try {
    const { username } = req.body;
    const storeId = req.store.id;

    const currentStore = await prisma.store.findFirst({
      where: {
        storeId,
      },
    });
    if (currentStore.username === username) {
      return res.status(400).json({ message: "เป็น Username เดิมอยู่แล้ว" });
    }

    const chackeUsername = await prisma.store.findFirst({
      where: {
        username,
      },
    });

    if (chackeUsername) {
      return res.status(400).json({ message: "This username already exits!!" });
    }

    // เช็คว่าเปลี่ยนได้แล้วหรือยัง
    const DAYS = 30;
    const store = await prisma.store.findFirst({
      where: {
        storeId,
      },
    });

    if (store.usernameChangedAt) {
      const daysSinceChange =
        (Date.now() - new Date(store.usernameChangedAt)) /
        (1000 * 60 * 60 * 24);
      if (daysSinceChange < DAYS) {
        return res.status(400).json({
          message: `เปลี่ยน username ได้อีกครั้งใน ${Math.ceil(DAYS - daysSinceChange)} วัน`,
        });
      }
    }

    // อัปเดต username + บันทึกเวลา
    await prisma.store.update({
      where: {
        storeId,
      },
      data: { username, usernameChangedAt: new Date() },
    });

    const updateUsername = await prisma.store.update({
      where: {
        storeId,
      },
      data: {
        username,
      },
    });
    res.send(updateUsername);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//ลืม storeName
exports.updateStore = async (req, res) => {
  try {
    const {
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

    const store = await prisma.store.update({
      where: {
        id: req.store.id,
      },
      data: {
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

exports.removeStore = async (req, res) => {
  //ไม่ลบแต่เปลี่ยนสถานะ ติดไว้
  try {
    const storeId = req.store.id;

    await prisma.store.update({
      where: {
        id: Number(storeId),
      },
      data: {
        accountStatus: "SUSPENDED", // login ไม่ได้แล้ว
        status: "DELETED", // ไม่แสดงหน้าบ้าน
      },
    });
    res.send({ message: "ปิดบัญชีสำเร็จ" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeStoreStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const storeId = req.store.id;

    // ดึงข้อมูลร้านก่อน
    const store = await prisma.store.findUnique({
      where: {
        id: storeId,
      },
      include: {
        deliveryZones: true,
      },
    });

    // ถ้าจะเปิดร้าน ให้ตรวจข้อมูลก่อน
    if (status === "OPEN") {
      const missingFields = [];

      if (!store.storeName) missingFields.push("storeName");
      if (!store.phone) missingFields.push("phone");
      if (!store.address) missingFields.push("address");
      if (!store.timeOpen) missingFields.push("timeOpen");
      if (!store.timeClose) missingFields.push("timeClose");
      if (!store.promptpayNumber) missingFields.push("promptpayNumber");

      // ต้องมีพื้นที่จัดส่งอย่างน้อย 1 จุด
      if (!store.deliveryZones || store.deliveryZones.length === 0) {
        missingFields.push("deliveryZones");
      }

      if (missingFields.length > 0) {
        return res.status(400).json({
          message: "กรุณากรอกข้อมูลร้านให้ครบก่อนเปิดร้าน",
          missingFields,
        });
      }
    }

    // อัปเดตสถานะ
    const storeStatus = await prisma.store.update({
      where: { 
        id: storeId 
      },
      data: { 
        status 
      },
    });

    res.json(storeStatus);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeOrderMode = async (req, res) => {
  try {
    const { orderMode } = req.body;
    const storeId = req.store.id;

    // เช็กว่ามีรอบที่กำลังเปิดอยู่หรือไม่
    const activeRound = await prisma.orderRound.findFirst({
      where: {
        storeId,
        status: "OPEN",
      },
    });

    if (activeRound) {
      return res.status(400).json({
        message:
          "ยังมีรอบรับออเดอร์ที่เปิดอยู่ กรุณาปิดรอบหรือรอให้รอบสิ้นสุดก่อนเปลี่ยนโหมด",
      });
    }

    // เปลี่ยนโหมด
    const result = await prisma.store.update({
      where: {
        id: storeId,
      },
      data: {
        orderMode,
      },
    });

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

