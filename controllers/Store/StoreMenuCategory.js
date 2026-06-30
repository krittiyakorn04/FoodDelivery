


exports.listMenuCategory = (req, res) => {
  try {
    res.send("Hello list MenuCategory");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.addMenuCategory = (req, res) => {
  try {
    res.send("Hello add MenuCategory");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateMenuCategory = (req, res) => {
  try {
    res.send("Hello update MenuCategory");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.removeMenuCategory = (req, res) => {
  try {
    res.send("Hello remove MenuCategory");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};


