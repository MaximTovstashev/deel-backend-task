const {sequelize} = require("../../model")
const {QueryTypes} = require("sequelize");
const {validateInterval} = require("../../utils/time");

/**
 * Technically this still falls under "You should only have to interact with Sequelize" restriction,
 * but I understand there should be a more "Sequelized" manner of creating such requests. Unfortunately
 * this requires a bit more studying of the ORM than a few hours I had.
 *
 * @param {string} start
 * @param {string} end
 * @returns {Promise<{best: (string|*|null)}>}
 */
const getBestProfession = async (start, end) => {

    validateInterval(start, end)

    const profiles = await sequelize.query(`
        SELECT p.profession, SUM(j.price) AS "total" FROM Jobs j 
            LEFT JOIN Contracts c ON j.ContractId = c.id 
            LEFT JOIN Profiles p ON c.ContractorId = p.id
        WHERE j.paid == 1 AND j.paymentDate >= :start AND j.paymentDate <= :end 
        GROUP BY p.profession 
        ORDER BY "total" DESC`,
    {
        replacements: {start, end},
        type: QueryTypes.SELECT
    })

    return {best: profiles[0]?.profession ?? null}
}

/**
 *
 * @param {string} start
 * @param {string} end
 * @param {number} limit
 * @returns {Promise<*>}
 */
const getBestClients = async (start, end, limit = 2) => {
    validateInterval(start, end)

    return sequelize.query(`
            SELECT p.id, p.firstName || ' ' || p.lastName as "fullName", SUM(j.price) AS "paid" FROM Profiles p
                LEFT JOIN Contracts c ON c.ClientId = p.id 
                LEFT JOIN Jobs j ON j.ContractId = c.id 
            WHERE j.paid = 1 AND j.paymentDate >= :start AND j.paymentDate <= :end
            GROUP BY p.id
            ORDER BY paid DESC
            LIMIT :limit`,
    {
        replacements: {start, end, limit},
        type: QueryTypes.SELECT
    })
}

module.exports = {getBestProfession, getBestClients}
