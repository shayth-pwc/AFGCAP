const cds = require("@sap/cds");
const generateUUID = require('@sap/cds-foss')('uuid');

module.exports = async (srv) => {
    const upsertAll = async (settings, items) => {
        var response = [];
        try {
            await UPSERT.into(settings.table).entries(items);
            for (let item of items) {
                console.log(`Successfully inserted data in ${settings.table} for ${item[settings.keyProperty]}.`);
                response.push({ success: true, message: `Successfully inserted data in ${settings.table} for ${item[settings.keyProperty]}.` });
            };
        } catch (error) {
            console.log(`Failed to insert data in ${settings.table} in bulk for ${items.length} items. Switching to individual queries.`);
        }
        return response;
    };
    const upsertOne = async (settings, item) => {
        var response = {};
        try {
            await UPSERT.into(settings.table).entries(item);
            console.log(`Successfully inserted data in ${settings.table} for ${item[settings.keyProperty]}.`);
            response = { success: true, message: `Successfully inserted data in ${settings.table} for ${item[settings.keyProperty]}.` };
        } catch (error) {
            console.log(`Failed to insert data for ${item[settings.keyProperty]}.`, JSON.stringify(error));
            response = { success: false, message: `Failed to insert data in ${settings.table} for ${item[settings.keyProperty]}.`, error: JSON.stringify(error) };

            const uuid = generateUUID.v4();
            const logData = {
                ID: uuid,
                CALLED_FUNC: settings.function,
                RESPONSE_CODE: error.code.toString(),
                RESPONSE_STATUS: 'error',
                RESPONSE_TEXT: `Failed to insert data in ${settings.table} for ${item[settings.keyProperty]}: ${JSON.stringify(error)}`.slice(0, 5000),
                RESPONSE_TIME: 'NA',
                CAPTURE_DATE: new Date(),
                CAPTURE_TIME: new Date(),
                CAPTURED_BY: 'system',
                PAYLOAD: JSON.stringify(item).slice(0, 5000),
                STATUS: 'new'
            };
            await INSERT.into('API_LOG').entries(logData);
        }
        return response;
    };
    const upsertEvents = async (events, settings) => {
        const response = await upsertAll(settings, events);
        if (response.length == 0) {
            for (let item of events) {
                response.push(await upsertOne(settings, item));
            };
        }
        return response;
    };

    srv.on('A_FCT_QUOTATIONS', async (req) => {
        const events = Array.isArray(req.data.events) ? req.data.events : [req.data.events];
        for (let event of events) {

            serviceOrderJoblinesIdserviceOrderJoblinesId
            if (typeof event.partners != "undefined") {
                event.partner = (event.partners[0].partner);
                event.partnerFunction = (event.partners[0].partnerFunction);
                event.partnerName = (event.partners[0].partnerName);
            }

            if (typeof event.finance != "undefined") {
                event.invoiceId = (event.finance.invoiceId);
                event.rate = (event.finance.rate);
                event.minimumGuranteedFutureValue = (event.finance.minimumGuranteedFutureValue);
                event.type = (event.finance.type);
                event.startDate = (event.finance.startDate);
                event.endDate = (event.finance.endDate);
                event.balance = (event.finance.balance);
                event.monthlyPayment = (event.finance.monthlyPayment);
                event.productCategory = (event.finance.productCategory);
                event.term = (event.finance.term);
            }
        }

        return await upsertEvents(events, {
            function: 'QUOTATIONS / UPSERT',
            table: 'FCT_QUOTATIONS',
            keyProperty: 'quotationsItemsId'
        });
    });
};