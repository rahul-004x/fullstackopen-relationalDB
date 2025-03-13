const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Blog extends Model {}
Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: {
                args: 1991,
                msg: "Year must be at least 1991"
            },
            max: {
                args: new Date().getFullYear(),
                msg: `Year cannot be greater than ${new Date().getFullYear()}`
            }
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true, 
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'blogs'  
})
 module.exports = Blog