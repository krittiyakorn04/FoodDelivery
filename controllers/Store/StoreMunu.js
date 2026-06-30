


exports.listMenu = (req, res) => {
  try {
    res.send("Hello list Menu");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.addMenu = (req, res) => {
  try {
    res.send("Hello add Menu");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateMenu = (req, res) => {
  try {
    res.send("Hello update Menu");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteMenuy = (req, res) => {
  try {
    res.send("Hello delete Menu");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
