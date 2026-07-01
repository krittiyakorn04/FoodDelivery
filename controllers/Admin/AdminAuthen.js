


exports.register = (req,res)=>{
    try {
        res.send('Hello Admin register')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.login = (req,res)=>{
    try {
        res.send('Hello Admin login')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.currentAdmin = (req,res)=>{
    try {
        res.send('Hello current Admin')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}