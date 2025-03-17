const router = require('express').Router()
const { Reading, User, Blog } = require('../models')
const { tokenExtractor } = require('../utils/middleware')

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

router.put('/:id', tokenExtractor, async (req, res) => {
  const { read } = req.body
  
  // Verify that a token was found and the user is authenticated
  if (!req.decodedToken || !req.decodedToken.id) {
    return res.status(401).json({ error: 'Token missing or invalid' })
  }
  
  const userId = req.decodedToken.id
  const reading = await Reading.findByPk(req.params.id)

  if (!reading) {
    return res.status(404).end()
  }
  
  // Verify that the user is the owner of the reading list entry
  if (reading.userId !== userId) {
    return res.status(403).json({ error: 'You can only mark your own readings as read' })
  }

  reading.read = read
  await reading.save()

  res.json(reading)
})

module.exports = router
