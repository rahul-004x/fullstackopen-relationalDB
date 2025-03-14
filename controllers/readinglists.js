const router = require('express').Router()
const { Reading, User, Blog } = require('../models')

router.post('/', async (req, res) => {
  try {
    const { userId, blogId } = req.body

    const user = await User.findByPk(userId)
    const blog = await Blog.findByPk(blogId)

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    const reading = await Reading.create({
      userId,
      blogId
    })

    res.status(201).json(reading)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = router
