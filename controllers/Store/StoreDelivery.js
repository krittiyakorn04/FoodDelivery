


exports.listDelivery = (req, res) => {
  try {
    res.send("Hello list Delivery");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.readDelivery = (req, res) => {
  try {
    res.send("Hello read Delivery");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeStatusDelivery = (req, res) => {
  try {
    res.send("Hello change Status Delivery");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};