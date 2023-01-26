const {Profile} = require('../model')


const getProfileMiddleware = async (req, res, next) => {
    if (!req.get('profile_id')) {
        return res.status(401).end()
    }

    try {
        req.profile = await Profile.findOne({where: {id: req.get('profile_id')}})
        next()
    } catch (e) {
        return res.status(404).end()
    }
}

module.exports = {getProfileMiddleware}
