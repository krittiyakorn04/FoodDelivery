


exports.getUserCart = (req,res)=>{
    try {
        res.send('Hello get User Cart')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.userCart = (req,res)=>{
    try {
        res.send('Hello userCart')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.updateUserCart = (req,res)=>{
    try {
        res.send('Hello update UserCart')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.removeUserCart = (req,res)=>{
    try {
        res.send('Hello remove UserCart')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}