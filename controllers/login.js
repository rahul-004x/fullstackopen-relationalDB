const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../utils/config')
const { User, Session } = require('../models')

router.post('/', async (req, res) => {
    const body = req.body
    const user = await User.findOne({
        where: {
            username: body.username
        }
    })   

    const passwordCorrect = body.password === 'secret'
    
    if(!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'invalid username or password'
        })
    }

    // Check if user is disabled
    if (user.disabled) {
        return res.status(401).json({
            error: 'account disabled'
        })
    }

    const userForToken = {
        username: user.username,
        id: user.id
    }

    const token = jwt.sign(userForToken, SECRET)

    // Store the session in the database
    await Session.create({
        userId: user.id,
        token
    })

    res
        .status(200)
        .send({ token, username: user.username, name: user.name })
})

module.exports = router