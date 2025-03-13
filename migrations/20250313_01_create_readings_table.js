const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('readings', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      blog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'blogs',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
    });
    
    // unique constraint to prevent duplicate entries
    await queryInterface.addConstraint('readings', {
      fields: ['user_id', 'blog_id'],
      type: 'unique',
      name: 'unique_user_blog_constraint'
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('readings');
  }
};
