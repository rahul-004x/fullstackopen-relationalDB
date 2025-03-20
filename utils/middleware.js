const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')

const errorHandler = (error, request, response, next) => {
  console.error('Error:', error.message)

  if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'Invalid token' })
  }

  next(error)
}

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      const decodedToken = jwt.verify(token, SECRET)
      
      // Store the token for use in logout route
      req.token = token
      
      // Import models inside function to avoid circular dependencies
      const { User, Session } = require('../models')
      
      // Check if the session exists in the database
      const session = await Session.findOne({
        where: { token }
      })
      
      if (!session) {
        return res.status(401).json({ error: 'Session expired or invalid' })
      }
      
      // Check if user is disabled
      const user = await User.findByPk(decodedToken.id)
      if (!user || user.disabled) {
        return res.status(401).json({ error: 'User account disabled' })
      }
      
      req.decodedToken = decodedToken
    } catch (error) {
      return res.status(401).json({ error: 'Token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'Token missing' })
  }
  
  next()
}

module.exports = { errorHandler, tokenExtractor }
