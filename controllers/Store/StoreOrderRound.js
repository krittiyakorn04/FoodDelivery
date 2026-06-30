


exports.listOrderRound = (req, res) => {
  try {
    res.send("Hello list OrderRound");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.addOrderRound = (req, res) => {
  try {
    res.send("Hello add OrderRound");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateOrderRound = (req, res) => {
  try {
    res.send("Hello update OrderRound");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.removeOrderRound = (req, res) => {
  try {
    res.send("Hello remove OrderRound");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changePattern = (req, res) => {
  try {
    res.send("Hello change Pattern");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.orderLimit = (req, res) => {
  try {
    res.send("Hello order Limit");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeRoundStatus = (req, res) => {
  try {
    res.send("Hello change Round Status");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};