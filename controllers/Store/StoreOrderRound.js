const prisma = require("../../config/prisma");

//ติดไว้ก่อน

exports.listOrderRound = async (req, res) => {
  try {
    const storeId = req.store.id;
    const orderRound = await prisma.orderRound.findFirst({
      where: {
        storeId,
      },
      orderBy: {
        id: "asc",
      },
    });

    res.send(orderRound);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//เปลี่ยน เวลาเป็นนาที
const timeToMinutes = (time) => {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
};
//
const minuteToTime = (minutes) => {
  const hour = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const minute = (minutes % 60).toString().padStart(2, "0");
  return `${hour}:${minute}`;
};

exports.addOrderRound = async (req, res) => {
  try {
    const {
      isManual,
      roundNumber,
      startTime,
      endTime,
      durationMinutes,
      hasOrderLimit,
      maxOrders,
      cutoffMinutes,
    } = req.body;

    const storeId = req.store.id;

    // ===== Validation =====

    // Manual
    if (isManual && (!startTime || !endTime)) {
      return res.status(400).json({
        message: "กรุณาระบุเวลาเริ่มและเวลาสิ้นสุด",
      });
    }

    // Auto
    if (!isManual && (!durationMinutes || durationMinutes <= 0)) {
      return res.status(400).json({
        message: "กรุณาระบุระยะเวลาของแต่ละรอบ",
      });
    }

    // จำกัดจำนวนออเดอร์
    if (hasOrderLimit && (!maxOrders || maxOrders <= 0)) {
      return res.status(400).json({
        message: "กรุณาระบุจำนวนออเดอร์สูงสุด",
      });
    }

    // Cutoff
    if (cutoffMinutes < 0) {
      return res.status(400).json({
        message: "cutoffMinutes ไม่ถูกต้อง",
      });
    }

    // ==========================
    // Manual
    // ==========================
    if (isManual) {
      // เวลาเริ่มต้องน้อยกว่าสิ้นสุด
      if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
        return res.status(400).json({
          message: "เวลาเริ่มต้องน้อยกว่าเวลาสิ้นสุด",
        });
      }

      // เช็กรอบซ้ำ
      const duplicate = await prisma.orderRound.findFirst({
        where: {
          storeId,
          startTime,
          endTime,
          isManual: true,
        },
      });

      if (duplicate) {
        return res.status(400).json({
          message: "มีรอบนี้อยู่แล้ว",
        });
      }

      const orderRound = await prisma.orderRound.create({
        data: {
          storeId,
          roundNumber,
          startTime,
          endTime,
          durationMinutes:
            timeToMinutes(endTime) - timeToMinutes(startTime),
          isManual: true,
          hasOrderLimit: hasOrderLimit ?? false,
          maxOrders: hasOrderLimit ? maxOrders : null,
          cutoffMinutes,
        },
      });

      return res.send(orderRound);
    }

    // ==========================
    // Auto
    // ==========================

    // มีรอบ Auto อยู่แล้วหรือไม่
    const exists = await prisma.orderRound.findFirst({
      where: {
        storeId,
        isManual: false,
      },
    });

    if (exists) {
      return res.status(400).json({
        message: "มีรอบอัตโนมัติอยู่แล้ว",
      });
    }

    // ดึงเวลาเปิด-ปิดร้าน
    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
      },
    });

    if (!store.timeOpen || !store.timeClose) {
      return res.status(400).json({
        message: "กรุณาตั้งค่าเวลาเปิด-ปิดร้านก่อน",
      });
    }

    const rounds = [];
    let open = timeToMinutes(store.timeOpen);
    const end = timeToMinutes(store.timeClose);
    let roundNum = 1;

    while (open + durationMinutes <= end) {
      rounds.push({
        storeId,
        roundNumber: roundNum,
        startTime: minuteToTime(open),
        endTime: minuteToTime(open + durationMinutes),
        durationMinutes,
        isManual: false,
        hasOrderLimit: hasOrderLimit ?? false,
        maxOrders: hasOrderLimit ? maxOrders : null,
        cutoffMinutes,
      });

      open += durationMinutes;
      roundNum++;
    }

    // รอบสุดท้าย
    const remaining = end - open;

    if (remaining > 0) {
      rounds.push({
        storeId,
        roundNumber: roundNum,
        startTime: minuteToTime(open),
        endTime: minuteToTime(end),
        durationMinutes: remaining,
        isManual: false,
        hasOrderLimit: hasOrderLimit ?? false,
        maxOrders: hasOrderLimit ? maxOrders : null,
        cutoffMinutes,
      });
    }

    await prisma.orderRound.createMany({
      data: rounds,
    });

    return res.send(rounds);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.updateOrderRound = async (req, res) => {
  try {
    const { roundId } = req.params;
    const storeId = req.store.id;

    const round = await prisma.orderRound.findFirst({
      where: {
        id: Number(roundId),
        storeId,
      },
    });

    if (!round) {
      return res.status(404).json({
        message: "ไม่พบรอบ",
      });
    }

    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    let status = round.status;

    // ยังไม่ถึงเวลาเปิด
    if (nowMinutes < timeToMinutes(round.startTime)) {
      status = "CLOSED";
    }

    // ถึงเวลาเปิด
    if (
      nowMinutes >= timeToMinutes(round.startTime) &&
      nowMinutes < timeToMinutes(round.endTime)
    ) {
      status = "OPEN";
    }

    // หมดเวลา
    if (nowMinutes >= timeToMinutes(round.endTime)) {
      status = "CLOSED";
    }

    // เต็มจำนวน
    if (round.hasOrderLimit && round.currentOrders >= round.maxOrders) {
      status = "CLOSED";
    }

    const result = await prisma.orderRound.update({
      where: {
        id: round.id,
      },
      data: {
        status,
      },
    });

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.removeOrderRound = async (req, res) => {
  try {
    const { roundId } = req.params;
    const storeId = req.store.id;

    // ค้นหารอบ
    const round = await prisma.orderRound.findFirst({
      where: {
        id: Number(roundId),
        storeId,
      },
    });

    if (!round) {
      return res.status(404).json({
        message: "ไม่พบรอบรับออเดอร์",
      });
    }

    // ห้ามลบถ้ารอบกำลังเปิด
    if (round.status === "OPEN") {
      return res.status(400).json({
        message: "ไม่สามารถลบรอบที่กำลังเปิดอยู่ได้",
      });
    }

    // เช็กว่ามีออเดอร์ในรอบหรือไม่
    const orderCount = await prisma.order.count({
      where: {
        orderRoundId: round.id,
      },
    });

    if (orderCount > 0) {
      return res.status(400).json({
        message: "ไม่สามารถลบรอบที่มีออเดอร์แล้วได้",
      });
    }

    // ลบรอบ
    await prisma.orderRound.delete({
      where: {
        id: round.id,
      },
    });

    res.json({
      message: "ลบรอบรับออเดอร์สำเร็จ",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.changePattern = async (req, res) => {
  try {
    const { patternManual } = req.body;
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
          "ยังมีรอบรับออเดอร์ที่เปิดอยู่ กรุณาปิดรอบหรือรอให้รอบสิ้นสุดก่อนเปลี่ยนรูปแบบ",
      });
    }

    // เปลี่ยนรูปแบบการสร้างรอบ
    const result = await prisma.store.update({
      where: {
        id: storeId,
      },
      data: {
        patternManual,
      },
    });

    res.json({
      message: "เปลี่ยนรูปแบบการสร้างรอบสำเร็จ",
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.changeRoundStatus = (req, res) => {
  try {
    res.send("Hello change Round Status");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
