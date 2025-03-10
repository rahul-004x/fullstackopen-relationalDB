const express = require('express')
require('express-async-errors')
const app = express()
const { PORT } = require('./config/config')
const { connectToDatabase } = require('./utils/db')
const blogsRouter = require('./controllers/blog')
const { errorHandler } = require('./utils/middleware')

app.use(express.json())

app.use('/api/blogs', blogsRouter)

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()

module.exports = app
