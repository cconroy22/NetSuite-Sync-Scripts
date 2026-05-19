/**
 * @NApiVersion 2.1
 */

define(['N/record', 'N/search'], (record, search) => {

  const READY_FIELD_ID = 'custbody_ready_for_sf';
  const SET_VALUE = true;

  const asBoolean = (v) => {
    if (v === true) return true;
    if (v === false) return false;
    if (v === 'T') return true;
    if (v === 'F') return false;
    return !!v;
  };

  const toNumber = (v) => {
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };

  const safeLookupSalesOrder = (salesOrderId) => {
    return search.lookupFields({
      type: search.Type.SALES_ORDER,
      id: salesOrderId,
      columns: [
        READY_FIELD_ID,
        'quantityfulfilled',
        'quantitybilled'
      ]
    });
  };

  const shouldMarkReady = (soFields) => {
    const alreadyReady = asBoolean(soFields[READY_FIELD_ID]);
    if (alreadyReady) return false;

    const qtyFulfilled = toNumber(soFields.quantityfulfilled);
    const qtyBilled = toNumber(soFields.quantitybilled);

    return qtyFulfilled > 0 || qtyBilled > 0;
  };

  const markReadyForSf = (salesOrderId, source) => {
    if (!salesOrderId) return { updated: false, reason: 'missing_sales_order_id' };

    let soFields;
    try {
      soFields = safeLookupSalesOrder(salesOrderId);
    } catch (e) {
      return { updated: false, reason: 'lookup_failed', error: e };
    }

    if (!shouldMarkReady(soFields)) {
      return { updated: false, reason: 'not_eligible_or_already_ready' };
    }

    try {
      record.submitFields({
        type: record.Type.SALES_ORDER,
        id: salesOrderId,
        values: {
          [READY_FIELD_ID]: SET_VALUE
        },
        options: {
          enableSourcing: true,
          ignoreMandatoryFields: true
        }
      });
      return { updated: true, reason: 'updated', source };
    } catch (e) {
      return { updated: false, reason: 'submit_failed', error: e, source };
    }
  };

  return {
    markReadyForSf,
    READY_FIELD_ID
  };
});
