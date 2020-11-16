const node = require('./node-controller')
const avax = require('./avax-controller')
const platform = require('./platform-controller')
const validators = require('./validators-controller')

module.exports = {
    node,
    avax,
    platform,
    validators
}