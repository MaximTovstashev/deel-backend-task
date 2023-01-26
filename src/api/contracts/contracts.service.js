const {Op} = require("sequelize");
const {Contract} = require("../../model")
const {ContractStatus} = require("../../const/ContractStatus");

/**
 * FIXED.
 * We could as well check whether the contract has proper Contractor/Client ids upon retrieval
 * and send 403 in case neither of them match profile.id.
 * That would be a bit more REST-compliant and a bit less secure.
 *
 * @param {number} contractId
 * @param {number} profileId
 * @returns contract by id
 */
const getContract = async (contractId, profileId) => {
    const contract = await Contract.findOne({
        where: {
            id: contractId,
            [Op.or]: [{ContractorId: profileId}, {ClientId: profileId}]
        }
    })
    if (!contract) {
        throw {code: 404, message: `Contract ${contractId} not found`}
    }
    return contract
}

/**
 *
 * @param {number} profileId
 * @returns {Promise<Contract[]>}
 */
const getContracts = async (profileId) => {
    return Contract.findAll({
        where: {
            [Op.not]: {status: ContractStatus.Terminated},
            [Op.or]: [{ContractorId: profileId}, {ClientId: profileId}]
        }
    })
}

module.exports = {getContract, getContracts}
