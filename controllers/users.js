const router = require('express').Router()

const { User, Blog } = require('../models') 

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: [
      {
        model: Blog,
        attributes: { exclude: ['userId'] }
      },
      {
        model: Blog,
        as: 'readingList',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: []
        }
      }
    ]
  })
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
  const user = await User.findByPk(req.params.id, {
    attributes: ['name', 'username'],
    include: [
      {
        model: Blog,
        as: 'readingList',
        attributes: ['id', 'url', 'title', 'author', 'likes', 'year'],
        through: {
          attributes: [] 
        }
      }
    ]
  })
  
  if (!user) {
    return res.status(404).end()
  }

  const formattedUser = {
    name: user.name,
    username: user.username,
    readings: user.readingList
  }

  res.json(formattedUser)
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