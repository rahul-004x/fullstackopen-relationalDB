const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL)

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        console.log('connect to database')
    } catch (err) {
        console.log('failed to connect to the database', err.message)
        return process.exit(1)
    }

    return null
}

module.exports = {
    sequelize, 
    connectToDatabase
}