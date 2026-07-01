


exports.getDelivery = (req,res)=>{
    try {
        res.send('Hello get Delivery')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.reaUserDelivery = (req,res)=>{
    try {
        res.send('Hello get Delivery')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}