const {Job, Contract, sequelize} = require('../../model')
const {Op, where, Transaction} = require("sequelize");
const {ContractStatus} = require("../../const/ContractStatus");
const {getProfile} = require("../profile/profile.service");


/**
 *
 * @param {number} profileId
 */
const getUnpaidJobs = async (profileId) => {
    return Job.findAll({
        where: {paid: {[Op.eq]: null}}, include: {
            model: Contract, where: {
                status: ContractStatus.InProgress,
                [Op.or]: [{ContractorId: profileId}, {ClientId: profileId}]
            }
        }
    })
}

/**
 *
 * @param {number} jobId
 * @param {number} profileId
 * @returns {Promise<Job>}
 */
const getJob = async (jobId, profileId, transaction) => {
    const job = await Job.findOne({
        where: {id: jobId},
        include: {
            model: Contract,
            where: {
                ClientId: profileId
            }
        }
    }, {transaction})

    if (!job) {
        throw {code: 404, message: `Job ${jobId} not found`}
    }

    return job
}

/**
 * @param {number} jobId
 * @param {Profile} profile
 * @returns {Promise<boolean>}
 */
const performJobPayment = async (jobId, profile) => {


    await sequelize.transaction({isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {

        const job = await getJob(jobId, profile.id, t)

        if (job.paid) {
            throw {code: 422, message: `Job ${jobId} is already paid for`}
        }

        if (job.price > profile.balance) {
            throw {code: 422, message: `Insufficient funds to pay for job ${jobId}`}
        }

        const contractor = await getProfile(job.Contract.ContractorId)

        profile.balance -= job.price
        await profile.save({transaction: t})

        contractor.balance += job.price
        await contractor.save({transaction: t})

        job.set({paid: 1, paymentDate: sequelize.literal('CURRENT_TIMESTAMP')})
        await job.save({transaction: t})
    })

    return true
}

module.exports = {getUnpaidJobs, performJobPayment, getJob}
