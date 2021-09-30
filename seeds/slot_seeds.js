const slotConstant = require('../src/slot/slot.constant');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex(slotConstant.SLOT_TABLE).del()
    .then(function () {
      // Inserts seed entries
      return knex(slotConstant.SLOT_TABLE).insert([
        { status: slotConstant.STATUS_DEACTICE },
        { status: slotConstant.STATUS_DEACTICE },
        { status: slotConstant.STATUS_DEACTICE },
        { status: slotConstant.STATUS_DEACTICE },
        { status: slotConstant.STATUS_DEACTICE },
        { status: slotConstant.STATUS_DEACTICE },
        { status: slotConstant.STATUS_DEACTICE },
        { status: slotConstant.STATUS_DEACTICE },
        { status: slotConstant.STATUS_DEACTICE },
        { status: slotConstant.STATUS_DEACTICE },
      ]);
    });
};
