const jwt = require('jsonwebtoken')


module.exports = (req, res, next) => {
    const token = req.header("x-auth-token")

    //Check if theres no token
    if(!token) {
        return res.status(401).json({msg: "Unauthorized"})
    }

    try {
        const decoded = jwt.verify(token, "positive")
        req.user = decoded.user
        next()
    } catch(err) {
        return res.status(401).json({err})
    }
}