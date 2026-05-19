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
        context.UserEventType.XEDIT
      ];

      if (!allowed.includes(t)) return;

      const rec = context.newRecord;
      const createdFrom = rec.getValue({ fieldId: 'createdfrom' });

      const result = rfs.markReadyForSf(createdFrom, {
        sourceRecordType: 'invoice',
        sourceRecordId: rec.id,
        triggerType: t
      });

      if (result.updated) {
        log.audit({ title: 'Ready for SF updated from Invoice', details: result });
      } else {
        log.debug({ title: 'Ready for SF not updated from Invoice', details: result });
      }

    } catch (e) {
      log.error({ title: 'Invoice UE error', details: e });
    }
  };

  return { afterSubmit };
});
