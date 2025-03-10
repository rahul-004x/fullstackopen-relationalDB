require('dotenv').config()
const { Sequelize, DataTypes, Model } = require('sequelize')
const express = require('express')
const app = express()

// Add this middleware to parse JSON request bodies
app.use(express.json())

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

class Blog extends Model {}
Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blogs'  
})

app.get('/api/blogs', async (req, res) => {
  const blogs =  await sequelize.query('SELECT * FROM blogs', { type: sequelize.QueryTypes.SELECT })
  res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
    console.log(req.body)
    const blogs = await Blog.create(req.body)
    res.json(blogs)
})

app.delete('/api/blogs/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    await blog.destroy()
    res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})