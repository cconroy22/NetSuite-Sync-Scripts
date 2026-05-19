/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */

define(['N/search', 'N/record', 'N/log'], (search, record, log) => {

  const READY_FIELD_ID = 'custbody_ready_for_sf';

  const getInputData = () => {
    return search.create({
      type: search.Type.SALES_ORDER,
      filters: [
        ['mainline', 'is', 'T'],
        'AND',
        [READY_FIELD_ID, 'is', 'F'],
        'AND',
        [
          ['quantityfulfilled', 'greaterthan', '0'],
          'OR',
          ['quantitybilled', 'greaterthan', '0']
        ]
      ],
      columns: [
        'internalid'
      ]
    });
  };

  const map = (context) => {
    const row = JSON.parse(context.value);
    const id = row.id || (row.values && row.values.internalid && row.values.internalid.value);

    if (!id) return;

    try {
      record.submitFields({
        type: record.Type.SALES_ORDER,
        id: id,
        values: {
          [READY_FIELD_ID]: true
        },
        options: {
          enableSourcing: true,
          ignoreMandatoryFields: true
        }
      });
      log.audit({ title: 'Backfill Ready for SF updated', details: { salesOrderId: id } });
    } catch (e) {
      log.error({ title: 'Backfill update failed', details: { salesOrderId: id, error: e } });
    }
  };

  return { getInputData, map };
});
