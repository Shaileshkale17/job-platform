import jwt from "jsonwebtoken";

const authenticateToken =
  (requiredRoles = []) =>
  (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]; // Expected: "Bearer <token>"

    if (!token) {
      return res.status(401).json({
        status: 401,
        message: "Access denied. No token provided.",
        success: false,
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach decoded user data (e.g. id, role)

      if (requiredRoles.length > 0 && !requiredRoles.includes(decoded.role)) {
        return res.status(403).json({
          status: 403,
          message: "Access denied. Insufficient permissions.",
          success: false,
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        status: 401,
        message: "Invalid token.",
        success: false,
      });
    }
  };

export default authenticateToken;
