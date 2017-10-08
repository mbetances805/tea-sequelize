'use strict'

const Sequelize = require('sequelize')
const Op = Sequelize.Op

const db = new Sequelize('postgres://localhost/teas', { logging: false });

const Tea = db.define('tea', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  price: Sequelize.INTEGER,
  category: Sequelize.ENUM('green', 'black', 'herbal')
}, {
    getterMethods: {
      dollarPrice () {
        let price = '$' + (this.price/100).toFixed(2).toString()
        return price
      }
    },
    hooks: {
      beforeCreate: (instance, options) => {
       instance.title = instance.title.split(' ').map((word) => {
         return (word.charAt(0).toUpperCase() + word.substr(1))
       }).join(' ')
      }
    }
  })

Tea.findByCategory = (type) => {
  return Tea.findAll({
    where: {
      category: type
    }
  })
}

Tea.prototype.findSimilar = function() {
  return Tea.findAll({
    where: {
      category: this.category,
      title: {
        [Op.ne]: this.title
      }
    }
  })
}

module.exports = { db, Tea };
