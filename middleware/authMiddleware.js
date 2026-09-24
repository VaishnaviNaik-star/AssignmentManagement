import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const professorOnly = (req, res, next) => {
  if (req.user.role !== "professor") {
    return res.status(403).json({ message: "Professor access required" });
  }
  next();
};

export const studentOnly = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ message: "Student access required" });
  }
  next();
};
