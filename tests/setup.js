require('dotenv').config({path: '.test.env'})
const {seed} = require("../scripts/seed")

module.exports = async function () {
    await seed()
};
