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

    srv.on('A_FCT_SERVICE_ORDER', async (req) => {
        const events = Array.isArray(req.data.events) ? req.data.events : [req.data.events];
        for (let event of events) {

            event.serviceOrderId = (event.id);

            if (typeof event.appointment != "undefined") {
                event.startDate = (event.appointment.startDate);
                event.show = (event.appointment.show);
                event.showDate = (event.appointment.showDate);
                event.confirmationDate = (event.appointment.confirmationDate);
                event.plannedStartTimestamp = (event.appointment.plannedStartTimestamp);
                event.plannedStartDate = (event.appointment.plannedStartDate);
                event.endDate = (event.appointment.endDate);
            }

            if (typeof event.addtionalInformation != "undefined") {
                event.currentOdometer = (event.addtionalInformation.currentOdometer);
                event.vehicleIdentificationNumber = (event.addtionalInformation.vehicleIdentificationNumber);
                event.customerName = (event.addtionalInformation.customerName);
                event.totalServiceTime = (event.addtionalInformation.totalServiceTime);
                event.make = (event.addtionalInformation.make);
                event.model = (event.addtionalInformation.model);
                event.year = (event.addtionalInformation.year);
                event.variant = (event.addtionalInformation.variant);
            }

            if (typeof event.partners != "undefined") {
                event.partner = (event.partners[0].partner);
                event.partnerFunction = (event.partners[0].partnerFunction);
                event.partnerName = (event.partners[0].partnerName);
            }

            if (typeof event.address != "undefined") {
                event.customerFirstName = (event.address[0].customerFirstName);
                event.customerLastName = (event.address[0].customerLastName);
                event.postalCode = (event.address[0].postalCode);
                event.city = (event.address[0].city);
                event.region = (event.address[0].region);
                event.country = (event.address[0].country);
                event.countryCode = (event.address[0].countryCode);
                event.state = (event.address[0].state);
                event.streetAddress = (event.address[0].streetAddress);
                event.addressType = (event.address[0].addressType);
                event.phoneNumber = (event.address[0].phoneNumber);
            }

            if (typeof event.contactInfo != "undefined") {
                event.emailId = (event.contactInfo.emailId);
                event.phoneNumber = (event.contactInfo.phoneNumber);
            }
        }

        return await upsertEvents(events, {
            function: 'SERVICE_ORDER / UPSERT',
            table: 'FCT_SERVICE_ORDER',
            keyProperty: 'serviceOrderId'
        });
    });
};