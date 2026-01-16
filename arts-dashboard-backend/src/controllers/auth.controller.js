const jwt = require("jsonwebtoken");

exports.login = (req, res) => {
  const { role, password } = req.body;

  if (!role || !password) {
    return res.status(400).json({ message: "Role and password required" });
  }

  if (role === "admin") {
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: "Invalid password" });
    }
  } else if (role === "judge") {
    if (password !== process.env.JUDGE_PASSWORD) {
      return res.status(401).json({ message: "Invalid password" });
    }
  } else {
    return res.status(400).json({ message: "Invalid role" });
  }

  const token = jwt.sign(
    { role },
    "ARTSFEST_SECRET",
    { expiresIn: "12h" }
  );

  res.json({ token, role });
};
