const {Profile, sequelize, Job, Contract} = require("../../model");
const {Transaction} = require("sequelize");
const {ProfileType} = require("../../const/ProfileType");


/**
 *
 * @param {number} profileId
 * @returns {Promise<Profile>}
 */
const getProfile = async (profileId) => {
    const profile = await Profile.findOne({where: {id: profileId}})
    if (!profile) {
        throw {code: '404', message: 'Failed to fetch profile'}
    }
    return profile
}

/**
 *
 * @param {number} amount
 * @param {Profile} profile
 * @param {number} userId
 * @returns {Promise<boolean>}
 */
const deposit = async ({amount, profile, userId}) => {

    if (profile.id !== userId) {
        throw {code: 403, message: `You are not allowed to deposit to User ${userId} balance`}
    }

    if (profile.type !== ProfileType.Client) {
        throw {code: 422, message: 'Only client accounts can be deposited into'}
    }

    await sequelize.transaction({isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE}, async (t) => {
        // Get the total price for the unpaid jobs for the user
        const job = await Job.findOne({
            attributes: [[sequelize.fn('SUM', sequelize.col('price')), 'jobsToPay']], where: {paid: null},
            include: {
                model: Contract,
                where: {
                    ClientId: profile.id
                }
            },
            raw: true
        }, {transaction: t})

        // Get the 25% deposit limit
        const limit = Math.floor(job.jobsToPay * .25)

        //  A client can't deposit more than 25% his total of jobs to pay
        if (amount > limit) {
            throw {code: 422, message: `Deposit amount ${amount} exceeds limit of ${limit}`}
        }

        profile.balance += amount
        await profile.save()
    })

    return true
}

module.exports = {getProfile, deposit}
