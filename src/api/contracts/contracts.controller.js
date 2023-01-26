const {route} = require("../../handler");
const {getContract, getContracts} = require("./contracts.service");

module.exports = (app) => {
    route({
        app,
        method: 'get',
        route: '/contracts/:id',
        handler: (req) => getContract(req.params.id, req.profile.id)
    })

    route({
        app,
        method: 'get',
        route: '/contracts',
        handler: (req) => getContracts(req.profile.id)
    })
}
