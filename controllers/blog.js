const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../config/config')

const blogFinder = async (req, res, next) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
        req.blog = blog
        next()
    } else {
        res.status(404).end()
    }
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    console.log('Authorization header:', authorization)
    
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        } catch {
            return res.status(401).json({ error: 'invalid token'})
        }
    } else {
        return res.status(401).json({ error: 'token missing'})
    }
    next()
}

router.get('/', async (req, res) => {
    let where = {}
    
    if (req.query.search) {
        where = {
            [Op.or]: [
                { title: { [Op.iLike]: `%${req.query.search}%` } },
                { author: { [Op.iLike]: `%${req.query.search}%` } }
            ]
        }
    }
    
    const blogs = await Blog.findAll({
        attributes: {exclude: ['userId']},
        include: {
            model: User,
            attributes: ['name']
        },
        where
    })
    res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
    res.json(blog)
})  

router.get('/:id', blogFinder, async (req, res) => {
    res.json(req.blog)
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
    if (req.blog.userId === req.decodedToken.id) {
        await req.blog.destroy()
    }
    res.status(204).end()
})

router.put('/:id', tokenExtractor, blogFinder, async (req, res) => {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
})

module.exports = router