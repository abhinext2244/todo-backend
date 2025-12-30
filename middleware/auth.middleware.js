import jwt from "jsonwebtoken";
export const auth = (req, res, next) => {
  try {
    //  Get token
    const token = req.cookies?.access_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach only required data
    req.User = {
      id: decoded.id,
      role: decoded.role
    };

    //  Continue request
    next();
  } catch (error) {
    //  Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired, please login again"
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid authentication token"
    });
  }
};
