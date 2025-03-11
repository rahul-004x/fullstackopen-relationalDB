const router = require('express').Router()

const { User, Blog } = require('../models') // Fixed to properly import Blog

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
        model: Blog,
        attributes: { exclude: ['userId']}
    }
  })
  res.json(users)
})

router.get('/', async (req, res) => {
    const users = await User.findAll()
    res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.params.username
            }
        })
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }
        
        user.username = req.body.username
        await user.save()
        
        res.json(user)
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})

module.exports = router