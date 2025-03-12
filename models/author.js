const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Author extends Model {}
Author.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    articles: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'authors'
})

module.exports = Author