const moment = require('moment')

const getValidData = (dateStr) => {
    const date = moment(dateStr)
    if (!date.isValid()) {
        throw {code: 422, message: `Invalid date "${dateStr}"`}
    }
    return date
}

/**
 * Check if start and end dates are dates and they form a valid interval
 * @param {string} start
 * @param {string} end
 * @returns {boolean}
 */
const validateInterval = (start, end) => {
    const startTime = getValidData(start)
    const endTime = getValidData(end)
    if (!startTime.isBefore(endTime)) {
        throw {code: 422, message: `Invalid date interval [${start}, ${end}]`}
    }
    return true
}

module.exports = {validateInterval}
