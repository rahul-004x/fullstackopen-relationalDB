const errorHandler = (error, request, response, next) => {
  console.error('Error:', error.message)

  if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = { errorHandler }
