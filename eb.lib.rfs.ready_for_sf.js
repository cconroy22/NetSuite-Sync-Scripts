# Ready for SF automation for Sales Orders

This bundle marks a Sales Order field as ready when fulfillment or billing activity occurs.

## What it does

- Runs after an Item Fulfillment is created or updated
- Runs after an Invoice is created or updated
- Sets a Sales Order body field to true once there is any fulfillment quantity or any billed quantity
- Skips updates when the Sales Order is already marked ready

## Files

- `FileCabinet/SuiteScripts/rfs/eb.lib.rfs.ready_for_sf.js`
- `FileCabinet/SuiteScripts/rfs/eb.ue.rfs.ready_for_sf_from_item_fulfillment.js`
- `FileCabinet/SuiteScripts/rfs/eb.ue.rfs.ready_for_sf_from_invoice.js`
- `FileCabinet/SuiteScripts/rfs/eb.mr.rfs.backfill_ready_for_sf.js` optional catch up

## Configuration

Update these constants in `eb.lib.rfs.ready_for_sf.js`.

- `READY_FIELD_ID` default `custbody_ready_for_sf`
- `SET_VALUE` default `true`

If your Ready for SF field is not a checkbox, change `SET_VALUE` to the internal value your field expects.

## Deployments

### User Event deployment 1

- Script: `eb.ue.rfs.ready_for_sf_from_item_fulfillment.js`
- Record type: Item Fulfillment
- Event types: Create, Edit, XEdit, Pack, Ship

### User Event deployment 2

- Script: `eb.ue.rfs.ready_for_sf_from_invoice.js`
- Record type: Invoice
- Event types: Create, Edit, XEdit

### Optional Map Reduce deployment

- Script: `eb.mr.rfs.backfill_ready_for_sf.js`
- Schedule: hourly or nightly

## Notes

This approach does not rely on Sales Order status text. It evaluates fulfilled and billed quantities.
