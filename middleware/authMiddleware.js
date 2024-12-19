exports.isAuthenticated = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect("/auth/login");
  }
  next();
};
exports.isGuest = (req, res, next) => {
  if (req.session && req.session.userId) {
    // L'utilisateur est connecté, redirection vers une autre page
    return res.redirect("/calendar"); // Changez cette URL si nécessaire
  }
  next(); // Continuer vers la route demandée
};
