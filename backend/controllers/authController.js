// Get profile information if authenticated
const profileController = (req, res) => {
    if (req.oidc.isAuthenticated()) {
        res.json(req.oidc.user);
    } else {
        res.status(401).send("Not logged in");
    }
};

// Get authentication status
const authStatusController = (req, res) => {
    res.json({
        authenticated: req.oidc.isAuthenticated(),
        user: req.oidc.user || null,
    });
};

// Logout user
const logoutController = (req, res) => {
    res.oidc.logout({
        returnTo: process.env.BASE_URL,
    });
};

// Redirect to login if not authenticated
const loginController = (req, res) => {
    if (!req.oidc.isAuthenticated()) {
        res.oidc.login();
    } else {
        res.redirect('/profile');
    }
};

export { profileController, authStatusController, logoutController, loginController };
