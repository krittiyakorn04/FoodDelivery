


exports.register = (req,res)=>{
    try {
        res.send('Hello User Register')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.login = (req,res)=>{
    try {
        res.send('Hello User Login')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.currentUser = (req,res)=>{
    try {
        res.send('Hello Current User')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}