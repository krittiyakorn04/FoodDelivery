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

