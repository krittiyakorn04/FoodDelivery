


exports.changeCustomerStatus = (req,res)=>{
    try {
        res.send('Hello Admin register')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.changemerchantStatus = (req,res)=>{
    try {
        res.send('Hello Admin register')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}