


exports.getMenu = (req, res) => {
  try {
    res.send("Hello get Menu");
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

exports.removeMenu = (req, res) => {
  try {
    res.send("Hello remove Menu");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.changeAvailabilityStatus = (req, res) => {
  try {
    res.send("Hello change Availability Status");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getMenuBy = (req, res) => {
  try {
    res.send("Hello Menu By");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getSearchFilters = (req, res) => {
  try {
    res.send("Hello Search Filters");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
