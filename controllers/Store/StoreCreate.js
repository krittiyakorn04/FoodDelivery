


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
    res.send("Hello remove Store");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateDeliveryZone = (req, res) => {
  try {
    res.send("Hello update Store");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.removeDeliveryZone = (req, res) => {
  try {
    res.send("Hello remove DeliveryZone");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeRainSurcharge = (req, res) => {
  try {
    res.send("Hello change RainSurcharge");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeStoreStatus = (req, res) => {
  try {
    res.send("Hello change Store Status");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeStoreOpen = (req, res) => {
  try {
    res.send("Hello change Store Status");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeOrderMode = (req, res) => {
  try {
    res.send("Hello change OrderMode");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

