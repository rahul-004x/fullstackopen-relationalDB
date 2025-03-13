const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')

const sequelize = new Sequelize(DATABASE_URL)

const runMigration = async () => {
    const migrator = new Umzug({
        migrations: {
            glob: 'migrations/*.js',
        },
        storage: new SequelizeStorage({ sequelize, tableName: 'migrations'}),
        context: sequelize.getQueryInterface(),
        logger: console,
    })

    const migrations = await migrator.up()
    console.log('migration up to date ', {
        files: migrations.map((mig) => mig.name),
    })
}

const connectToDatabase = async () => {
    try {
        await sequelize.authenticate()
        await runMigration()
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