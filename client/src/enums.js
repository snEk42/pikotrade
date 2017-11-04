const _ = require('lodash')

/**
 * HOW TO USE
 *
 * enums.TESTIMONIAL_STATUS.ids[testimonial.statusId].name
 *
 * enums.TESTIMONIAL_STATUS.WAITING_FOR_APPROVAL.name
 * enums.TESTIMONIAL_STATUS.WAITING_FOR_APPROVAL.id
 *
 * for (var key in enum.TESTIMONIAL_STATUS) {
 *     console.log(enum.TESTIMONIAL_STATUS[key]);
 * } OR USE LODASH
 *
 * @param {Object} enumDefinition Enum definition
 * @returns {*}
 */
function enumize(enumDefinition) {
  const byId = {}
  const idsAsEnum = []
  for (const key in enumDefinition) {
    if (enumDefinition.hasOwnProperty(key)) {
      const temp = _.assign({}, enumDefinition[key])
      delete temp.id
      temp.key = key
      idsAsEnum.push(enumDefinition[key].id)
      byId[enumDefinition[key].id] = temp
    }
  }
  enumDefinition.ids = byId
  enumDefinition.idsAsEnum = idsAsEnum
  return enumDefinition
}

exports.COMMODITIES = enumize({
  BANANAS: { id: 1, name: 'Banány', median: 10 },
  ROCK: { id: 2, name: 'Kámen', median: 20 },
  WOOD: { id: 3, name: 'Dřevo', median: 20 },
  DIAMONDS: { id: 4, name: 'Diamanty', median: 30 },
})
