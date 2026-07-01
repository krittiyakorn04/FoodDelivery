


exports.listAddress = (req,res)=>{
    try {
        res.send('Hello list Address')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.addAddress = (req,res)=>{
    try {
        res.send('Hello add Address')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.updateAddress = (req,res)=>{
    try {
        res.send('Hello update Address')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

exports.removeAddress = (req,res)=>{
    try {
        res.send('Hello remove Address')
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}
