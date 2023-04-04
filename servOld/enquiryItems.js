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
                STATUS: 'Failed'
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

    srv.on('A_FCT_ENQUIRY_ITEMS', async (req) => {
        const events = Array.isArray(req.data.events) ? req.data.events : [req.data.events];
        for (let event of events) {
            event.enquiryItemId = (event.id);

            if (typeof event.ProductDetails != "undefined") {
                event.productClassification = (event.ProductDetails[0].productClassification);
                event.productCost = (event.ProductDetails[0].productCost);
                event.isVatApplicable = (event.ProductDetails[0].isVatApplicable);
                event.productIdDescription = (event.ProductDetails[0].productIdDescription);
               
            }

            if (typeof event.financeDetails != "undefined") {
                event.productCategory = (event.financeDetails [0].productCategory);
                event.productID = (event.financeDetails [0].productID);
                event.financeCompanyNumber = (event.financeDetails [0].financeCompanyNumber);
                event.financeSchemeName = (event.financeDetails [0].financeSchemeName);
                event.financeBalance = (event.financeDetails [0].financeBalance);
                event.financeRate = (event.financeDetails [0].financeRate);
                event.financeTerm = (event.financeDetails [0].financeTerm);
                event.financeType = (event.financeDetails [0].financeType);
                event.minimumGuaranteedFutureValue = (event.financeDetails [0].minimumGuaranteedFutureValue);
                event.pcpContractMileage = (event.financeDetails [0].pcpContractMileage);
                event.monthlyPayment = (event.financeDetails [0].monthlyPayment);
                event.cashInput = (event.financeDetails [0].cashInput);
                event.financeCompanyNumberSAP = (event.financeDetails [0].financeCompanyNumberSAP);
                event.quotationReferenceNumber = (event.financeDetails [0].quotationReferenceNumber);
            }
            
        
        }

        return await upsertEvents(events, {
            function: 'ENQUIRY_ITEMS / UPSERT',
            table: 'FCT_ENQUIRY_ITEMS',
            keyProperty: 'enquiryItemId'
        });
    });
};