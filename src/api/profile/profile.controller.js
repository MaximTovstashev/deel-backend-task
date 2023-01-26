const {route} = require("../../handler");
const {deposit} = require("./profile.service");

module.exports = (app) => {
    route({
        app,
        method: 'post',
        route: '/balances/deposit/:userId',
        handler: (req) => deposit({
            amount: req.body.amount,
            profile: req.profile,
            userId: Number(req.params.userId)
        })
    })
}
