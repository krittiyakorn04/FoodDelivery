


exports.register = (req,res)=>{
    try {
        res.send('Hello User Register')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}