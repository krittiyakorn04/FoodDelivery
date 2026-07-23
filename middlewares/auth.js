const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

exports.authStore = async (req, res, next) => {
  try {
    const headerToken = req.headers.authorization
    if (!headerToken) {
      return res.status(401).json({ message: "No Token" })
    }

    const token = headerToken.split(" ")[1]
    const decode = jwt.verify(token, process.env.SECRET)
    req.store = decode
    
    const store = await prisma.store.findFirst({
      where: { id: decode.id }
    })

    if (!store) {
      return res.status(404).json({ message: "Store not found" })
    }

    if (store.accountStatus === "SUSPENDED" || store.accountStatus === "BANNED") {
      return res.status(403).json({ message: "This account cannot access" })
    }
    
    next()
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Token Invalid" })
  }
}

//เอาไว้ก่อน
exports.currentRestau = async (req, res) => {
  try {
    const store = await prisma.store.findFirst({
      where: { id: req.store.id },  
      select: {
        id: true,
        email: true,
        username: true,
        storeName: true,
        role: true,
        status: true
      }
    })
    res.json({ store })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server Error" })
  }
}

exports.currentUser = async (req, res) => {
  try {
    const store = await prisma.store.findFirst({
      where: { id: req.store.id },  
      select: {
        id: true,
        email: true,
        username: true,
        storeName: true,
        role: true,
        status: true
      }
    })
    res.json({ store })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server Error" })
  }
}