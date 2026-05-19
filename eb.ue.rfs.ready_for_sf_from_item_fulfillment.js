/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */

define(['N/log', './eb.lib.rfs.ready_for_sf'], (log, rfs) => {

  const afterSubmit = (context) => {
    try {
      const t = context.type;

      const allowed = [
        context.UserEventType.CREATE,
        context.UserEventType.EDIT,
        context.UserEventType.XEDIT,
        context.UserEventType.PACK,
        context.UserEventType.SHIP
      ];

      if (!allowed.includes(t)) return;

      const rec = context.newRecord;
      const createdFrom = rec.getValue({ fieldId: 'createdfrom' });

      const result = rfs.markReadyForSf(createdFrom, {
        sourceRecordType: 'itemfulfillment',
        sourceRecordId: rec.id,
        triggerType: t
      });

      if (result.updated) {
        log.audit({ title: 'Ready for SF updated from Item Fulfillment', details: result });
      } else {
        log.debug({ title: 'Ready for SF not updated from Item Fulfillment', details: result });
      }

    } catch (e) {
      log.error({ title: 'Item Fulfillment UE error', details: e });
    }
  };

  return { afterSubmit };
});
