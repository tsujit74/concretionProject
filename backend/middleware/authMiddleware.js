import User from "../models/user.model.js";

const verifyToken = async (req, res, next) => {
  const token =  req.headers['authorization'];
  if (!token) return res.status(403).send("NOt token provided");

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(403).send("Invalid token");
    }
    req.user = user;
    req.isAdmin = user.role === 'admin'
    next()
  } catch (error) {
    return res.status(500).json({ message: "An error occurred while verifying the token" });
  }
 
};

export default verifyToken;
