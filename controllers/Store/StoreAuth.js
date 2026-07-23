const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");

exports.register = async (req, res) => {
  try {
    const {
      email,
      password,
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

    // เช็คว่ากรอกหรือยัง
    if (!username) {
      return res.status(400).json({ message: "Email is require!!!" });
    }
    if (!password) {
      return res.status(400).json({ message: "password is require!!!" });
    }

    // เช็คใน DB ว่ามีมั้ย ซ้ำหรือเปล่า (เดี๋ยวเพิ่ม error เช็คซ้ำ)
    const store = await prisma.store.findFirst({
      where: { OR: 
        [
        {email}, 
        {username}, 
        {phone}
      ] 
      },
    });
    if (store) {
      return res.status(400).json({ message: "This store already exits!!" });
    } 

    const hashPassword = await bcrypt.hash(password, 10);
    
    //ไม่ซ้ำก็ลงเลย 
    const newStore = await prisma.store.create({
      data: {
        email,
        password: hashPassword,
        username,
        phone,
        
        Notice, 
        storeName,
        category,
        address,
        dayOpen: JSON.stringify(dayOpen),
        timeOpen,
        timeClose,
        openAuto,

        promptpayNumber,
        bankName,
        bankAccount,
        bankAccountName,
      },
    });
   //สร้าง Payload
    const payload = {
      id: newStore.id,
      username: newStore.username,
      role: newStore.role
    }

    //generate token
    jwt.sign(payload,process.env.SECRET,{
      expiresIn:'1d'
    },(err,token)=>{
      if(err){
        return res.status(500).json({ message:"Server Error" })
      }
      res.json({payload,token})
    })
    

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" }); //@unique ต้องเขียนด้วย
  }
};

exports.login = async (req, res) => {
  try {
    const {username,password} = req.body

    //เช็คว่ามีมั้ย
    const store = await prisma.store.findFirst({
      where:{
        username
      }
    })
    if(!username){
      return res.status(400).json({ message: "User NOT found or NOT Enabled" })
    }
    if(store.accountStatus === "SUSPENDED" || store.accountStatus === "BANNED"){
      return res.status(400).json({ message: "Account not approved yet" })
    }

    //เช็คว่าตรงมั้ย
    const isMatch = await bcrypt.compare(password,store.password)
    if(!isMatch){
      return res.status(500).json({ message:"Password Invalid!!!" })
    }

    //สร้าง Payload
    const payload = {
      id: store.id,
      username: store.username,
      role: store.role
    }

    //generate token
    jwt.sign(payload,process.env.SECRET,{
      expiresIn:'1d'
    },(err,token)=>{
      if(err){
        return res.status(500).json({ message:"Server Error" })
      }
      res.json({payload,token})
    })


  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.currentRestau = async (req, res) => {
  try {

    const store = await prisma.store.findFirst({
      where:{
        username: req.store.username
      },
      select:{
        id:true,
        email:true,
        username:true,
        role:true
      }
    })

    res.json({store});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
}; 
