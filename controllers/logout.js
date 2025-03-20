const router = require('express').Router()
const { Session } = require('../models')
const { tokenExtractor } = require('../utils/middleware')

router.delete('/', tokenExtractor, async (req, res) => {
  try {
    // Find and delete the session based on the token
    await Session.destroy({
      where: {
        token: req.token
      }
    })
    
    res.status(204).end()
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

module.exports = router