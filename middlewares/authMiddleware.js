const supabase = require("../config/supabase");

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "Token not found or wrong format.",
      });
    }

    const token = authHeader.split("Bearer ")[1];

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        status: "error",
        message: "Token not found or null user.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Token success",
      data: {
        user,
      },
    });

    next();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error while verify token.",
      error: error.message,
    });
  }
};

module.exports = { requireAuth };
