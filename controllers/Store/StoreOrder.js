


exports.listOrder = (req, res) => {
  try {
    res.send("Hello list Order");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.readOrder = (req, res) => {
  try {
    res.send("Hello read Order");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports. changeStatusOrder = (req, res) => {
  try {
    res.send("Hello change Status Order");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};