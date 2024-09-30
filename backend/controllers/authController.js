
export const profileController = (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.json(req.oidc.user);
  } else {
    res.status(401).send('Not logged in');
  }
};
export const authStatusController = (req, res)=> {
  res.json({
    authenticated: req.oidc.isAuthenticated(),
    user: req.oidc.user || null
  });
}

// Controlador para cerrar sesión
export const logoutController = (req, res) => {
  res.oidc.logout({
    returnTo: "http://localhost:3000",
  });
};