const {route} = require("../../handler");
const {getBestProfession, getBestClients} = require("./admin.service");

module.exports = (app) => {
    route({
        app,
        method: 'get',
        route: '/admin/best-profession',
        handler: (req) => getBestProfession(req.query.start, req.query.end)
    })

    route({
        app,
        method: 'get',
        route: '/admin/best-clients',
        handler: (req) => getBestClients(req.query.start, req.query.end, req.query.limit)
    })
}
