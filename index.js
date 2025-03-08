require('dotenv').config()
const { Sequelize } = require('sequelize')
const express = require('express')
const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL)

// const main = async () => {
//   try {
//     await sequelize.authenticate()
//     const blogs = await sequelize.query('SELECT * FROM blogs', { type: sequelize.QueryTypes.SELECT })
//     console.log(blogs)
//     console.log('Connection has been established successfully.')
//     sequelize.close()
//   } catch (error) {
//     console.error('Unable to connect to the database:', error)
//   }
// }

// main()

app.get('/', async (req, res) => {
  const blogs =  await sequelize.query('SELECT * FROM blogs', { type: sequelize.QueryTypes.SELECT })
  res.json(blogs) 
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 