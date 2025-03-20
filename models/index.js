const Blog = require('./blog')
const User = require('./user')
const Reading = require('./reading')
const Author = require('./author')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: Reading, as: 'readingList' })
Blog.belongsToMany(User, { through: Reading, as: 'readers' })

User.hasMany(Reading)
Reading.belongsTo(User)
Blog.hasMany(Reading)
Reading.belongsTo(Blog)

User.hasMany(Session)
Session.belongsTo(User)

module.exports = {
  Blog, User, Reading, Author, Session
}