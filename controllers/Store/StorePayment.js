


exports.rejectedPayment = (req, res) => {
  try {
    res.send("Hello rejected Payment");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeStatusPayment = (req, res) => {
  try {
    res.send("Hello change Status Payment");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};