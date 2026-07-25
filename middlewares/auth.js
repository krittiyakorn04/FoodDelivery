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

exports.authUser = async (req, res, next) => {
  try {

    const headerToken = req.headers.authorization
    if (!headerToken) {
      return res.status(401).json({ message: "No Token" })
    }

    const token = headerToken.split(" ")[1]
    const decode = jwt.verify(token, process.env.SECRET)
    req.user = decode

    const user = await prisma.customer.findFirst({
      where: { id: decode.id }
    })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.customerStatus === "BANNED") {
      return res.status(403).json({ message: "This account cannot access" })
    }

    next()
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "Token Invalid" })
  }
}

exports.storeCheck = async (req, res, next) => {
  try {
    const { username } = req.store;

    const storeUser = await prisma.store.findFirst({
      where: {
        username,
      },
    });
    if (!storeUser || storeUser.role !== "MERCHANT") {
       return res.status(403).json({ message: "Acess Denied : MERCHANT Only" });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "MERCHANT access denied" });
  }
};

exports.userCheck = async (req, res, next) => {
  try {
    const { username } = req.user;

    const User = await prisma.customer.findFirst({
      where: {
        username,
      },
    });
    if (!User || User.role !== "CUSTOMER") {
      res.status(403).json({ message: "Acess Denied : CUSTOMER Only" });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "CUSTOMER access denied" });
  }
};
