const { response } = require("express")

const isAdminRole = (req, res = response, next) => {
    if (!req.user) {
        return res.status(500).json({
            msg: 'Try to validate role without token'
        });
    }

    const { role } = req.user;
    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: 'Cannot perform this action. You are not an Administrator'
        });
    }

    next();
}

const hasRole = (...roles) => {
    return (req, res = response, next) => {
        if (!req.user) {
            return res.status(500).json({
                msg: 'Try to validate role without token'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                msg: `This service requires one of the following roles ${roles}`
            });
        }

        next();
    }
}

module.exports = {
    isAdminRole,
    hasRole
}
