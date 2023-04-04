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

    srv.on('A_FCT_ORDERS', async (req) => {
        const events = Array.isArray(req.data.events) ? req.data.events : [req.data.events];
        for (let event of events) {
            event.orderId = (event.id);

            if (typeof event.partners != "undefined") {
                event.partner = (event.partners[0].partner);
                event.partnerFunction = (event.partners[0].partnerFunction);
                event.partnerName = (event.partners[0].partnerName);
            }

            if (typeof event.financeDetails != "undefined") {
                event.financeSchemeName = (event.financeDetails[0].financeSchemeName);
                event.productCategory = (event.financeDetails[0].productCategory);
                event.term = (event.financeDetails[0].term);
                event.monthlyPayment = (event.financeDetails[0].monthlyPayment);
                event.rate = (event.financeDetails[0].rate);
                event.startDate = (event.financeDetails[0].startDate);
                event.endDate = (event.financeDetails[0].endDate);
                event.type = (event.financeDetails[0].type);
                event.balance = (event.financeDetails[0].balance);
                event.invoiceId = (event.financeDetails[0].invoiceId);
            }
        }

        return await upsertEvents(events, {
            function: 'ORDERS / UPSERT',
            table: 'FCT_ORDERS',
            keyProperty: 'orderId'
        });
    });
};