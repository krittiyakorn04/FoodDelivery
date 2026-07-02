


exports.changeCustomerStatus = (req,res)=>{
    try {
        res.send('Hello change Customer Status')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.changemerchantStatus = (req,res)=>{
    try {
        res.send('Hello change merchant Status')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}