module.exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: "No autorizado" });
};

module.exports.authorizeRole = (roles) => {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) {
            return next();
        }
        res.status(403).json({ error: "Acceso denegado" });
    };
};