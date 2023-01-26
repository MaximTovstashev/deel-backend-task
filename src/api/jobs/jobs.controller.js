const {route} = require("../../handler");

const {getUnpaidJobs, performJobPayment} = require("./jobs.service");

module.exports = (app) => {
    route({
        app,
        method: 'get',
        route: '/jobs/unpaid',
        handler: (req) => getUnpaidJobs(req.profile.id)
    })

    route({
        app,
        method: 'post',
        route: '/jobs/:jobId/pay',
        handler: (req) => performJobPayment(req.params.jobId, req.profile)
    })
}
