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

    srv.on('A_FCT_ENQUIRY', async (req) => {
        const events = Array.isArray(req.data.events) ? req.data.events : [req.data.events];
        for (let event of events) {
            event.enquiryId = (event.id);

            if (typeof event.partners != "undefined") {
                event.partner = (event.partners[0].partner);
                event.partnerFunction = (event.partners[0].partnerFunction);
                event.partnerName = (event.partners[0].partnerName);
            }

            if (typeof event.vehicleInterests != "undefined") {
                event.variantCode = (event.vehicleInterests[0].variantCode);
                event.modelGroup = (event.vehicleInterests[0].modelGroup);
                event.genericArticleCode = (event.vehicleInterests[0].genericArticleCode);
                event.testDriveDate = (event.vehicleInterests[0].testDriveDate);
                event.testDrive = (event.vehicleInterests[0].testDrive);
                event.model = (event.vehicleInterests[0].model);
                event.tradeIn = (event.vehicleInterests[0].tradeIn);
                event.budgetLow = (event.vehicleInterests[0].budgetLow);
                event.budgetHigh = (event.vehicleInterests[0].budgetHigh);
                event.financeType = (event.vehicleInterests[0].financeType);
                event.currentMake = (event.vehicleInterests[0].currentMake);
                event.financeTerm = (event.vehicleInterests[0].financeTerm);
                event.testDriveRejection = (event.vehicleInterests[0].testDriveRejection);
                event.currentModel = (event.vehicleInterests[0].currentModel);
                event.sourceOfEnquiry = (event.vehicleInterests[0].sourceOfEnquiry);
            }
            if (typeof event.EnquiryDetails != "undefined") {
                event.EnquiryStatus = (event.EnquiryDetails.EnquiryStatus);
                event.QuotationID = (event.EnquiryDetails.QuotationID);
                event.EnquiryCreatedDate = (event.EnquiryDetails.EnquiryCreatedDate);
                event.OrderId = (event.EnquiryDetails.OrderId);
            }

            if (typeof event.enquiryInformation != "undefined") {
                event.salesManagerId = (event.enquiryInformation.salesManagerId);
                event.offerExpired = (event.enquiryInformation.offerExpired);
                event.businessManagerId = (event.enquiryInformation.businessManagerId);
                event.customerId = (event.enquiryInformation.customerId);
                event.enquiryType = (event.enquiryInformation.enquiryType);
                event.branchId = (event.enquiryInformation.branchId);
                event.saleType = (event.enquiryInformation.saleType);
                event.staffId = (event.enquiryInformation.staffId);
                event.distributionChannel = (event.enquiryInformation.distributionChannel);
                event.salesGroup = (event.enquiryInformation.salesGroup);
                event.division = (event.enquiryInformation.division);
                event.salesOffice = (event.enquiryInformation.salesOffice);
                event.leadId = (event.enquiryInformation.leadId);
                event.salesExecutiveId = (event.enquiryInformation.salesExecutiveId);
                event.orgId = (event.enquiryInformation.orgId);
            }
            
        
        }

        return await upsertEvents(events, {
            function: 'ENQUIRY / UPSERT',
            table: 'FCT_ENQUIRY',
            keyProperty: 'enquiryId'
        });
    });
};