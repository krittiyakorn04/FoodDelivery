


exports.getStore = (req, res) => {
  try {
    res.send("Hello get Store");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateStore = (req, res) => {
  try {
    res.send("Hello update Store");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.removeStore = (req, res) => {
  try {
    res.send("Hello create Store");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateDeliveryZone = (req, res) => {
  try {
    res.send("Hello delete Store");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
