const User = require('../models/userModel');

const verifyRoles =(...allowedRoles) => {
    return async (req, res, next) => {
        const userId = req.id;
        let user;
        try {
          user = await User.findById(userId, "-password");
        } catch (err) {
          return new Error(err);
        }
        if (!user) {
          return res.status(404).json({ messsage: "User Not FOund" });
        }
        const userRoles=user.roles ;
        const result = allowedRoles.every(val => userRoles.includes(val));
        console.log(result);
        if (!result)
        { return res.sendStatus(401);
        }
        console.log("in role middleware");
        next();
    }
}

module.exports = {verifyRoles}