const jwt = require("jsonwebtoken")

// check JWT token and account type
function authorisationMiddleware(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    req.flash("notice", "Please log in to access this page.");
    return res.redirect("/account/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;

    if (req.user.account_type === 'Employee' || req.user.account_type === 'Admin') {
      next();
    } else {
      req.flash("notice", "Access denied. Insufficient permissions.");
      return res.redirect("/account/login");
    }
  } catch (error) {
    req.flash("notice", "Invalid request. Please log in again.");
    return res.redirect("/account/login");
  }
}

module.exports = authorisationMiddleware;