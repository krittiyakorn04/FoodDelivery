


exports.getReview = (req,res)=>{
    try {
        res.send('Hello get Review')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.updateReview = (req,res)=>{
    try {
        res.send('Hello updete Review')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.removeReview = (req,res)=>{
    try {
        res.send('Hello remove Review')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}