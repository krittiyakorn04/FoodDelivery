


exports.profileUser = (req,res)=>{
    try {
        res.send('Hello profile User')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.updateProfileUser = (req,res)=>{
    try {
        res.send('Hello update Profile User')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}