


exports.getOrder = (req,res)=>{
    try {
        res.send('Hello get Order')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.createOrder = (req,res)=>{
    try {
        res.send('Hello createOrder')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.changeStatusOrderUser = (req,res)=>{
    try {
        res.send('Hell change Status OrderUser')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.changePaymentMethod = (req,res)=>{
    try {
        res.send('Hello change Payment Method')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.uploadSlip = (req,res)=>{
    try {
        res.send('Hello upload Slip')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}