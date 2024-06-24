const authorization = (roles) => {
    return (req, res, next) => {
        if (!req.isAuthenticated() || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: "No autorizado" });
        }
        next();
    };
};

module.exports = authorization;
