const cds = require("@sap/cds");
const generateUUID = require('@sap/cds-foss')('uuid');

module.exports = async (srv) => {
    const upsertAll = async (settings, items) => {
        var response = [];
        try {
            await UPSERT.into(settings.table).entries(items);
            for (let item of items) {
                console.log(`Successfully inserted data as bulk in ${settings.table} for ${item[settings.keyProperty]}.`);
                response.push({ success: true, message: `Successfully inserted data as bulk in ${settings.table} for ${item[settings.keyProperty]}.` });
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
    // checks if the 'item' is an array, if yes: take the first element of the array and add it to the main event. If no: add the element to the main event.
    const assignFirstChild = (target, item) => {
        if (Array.isArray(target[item]) && target[item].length >= 1) {
            Object.assign(target, target[item][0]);
            delete target[item];
        } else {
            Object.assign(target, target[item]);
            delete target[item];
        }
    };
    // gets all columns of all tables in the schema, so we know the table structures in HANA
    const getHANATableColumns = async (schemaName) => {
        const tableFields = {};
        const cols = await cds.run(`SELECT TABLE_NAME, COLUMN_NAME FROM SYS.TABLE_COLUMNS WHERE SCHEMA_NAME = '${schemaName}'`);
        for (c of cols) {
            if (tableFields[c.TABLE_NAME]) {
                tableFields[c.TABLE_NAME].push(c.COLUMN_NAME);
            } else {
                tableFields[c.TABLE_NAME] = [c.COLUMN_NAME];
            }
        }
        return tableFields;
    };
    // removes properties from the event if they don't fit in HANA, and logs the ones that are in HANA but not in the Event
    const mapToHANAStructure = (event, tableName) => {
        const deleted = [];
        for (k of Object.keys(event)) {
            if (!HANA_Tables[tableName].includes(k.toUpperCase())) {
                deleted.push(k);
                delete event[k];
            }
        }
        deleted.length > 0 && console.log(`WARNING for ${tableName}: Removed ${deleted.length} properties coming from Boomi: ${deleted.join(', ')}`);
        const upperCaseKeys = Object.keys(event).map(x => x.toUpperCase());
        const missing = HANA_Tables[tableName].filter(x => !upperCaseKeys.includes(x));
        missing.length > 0 && console.log(`WARNING for ${tableName}: Missing ${missing.length} properties HANA expects: ${missing.join(', ')}`);
    }

    // load HANA table structure when app starts
    const HANA_Tables = await getHANATableColumns('TECHDBUSER1');
    console.log(`Downloaded table structures of ${Object.keys(HANA_Tables).length} tables`);

    //done
    srv.on('A_FCT_SERVICE_ORDER_JOBS', async (req) => {
        const events = Array.isArray(req.data.events) ? req.data.events : [req.data.events];
        for (let event of events) {
            event.serviceOrderJobId = (event.id);
            delete event.id;
            delete event.creationDate;

            event.isDeferred = (event.isDeferred === true);
        }

        return await upsertEvents(events, {
            function: 'SERVICE_ORDER_JOBS / UPSERT',
            table: 'FCT_SERVICE_ORDER_JOBS',
            keyProperty: 'serviceOrderJobId'
        });
    });

    //done
    srv.on('A_FCT_CUST_ECO_SYSTEM', async (req) => {
        const events = Array.isArray(req.data.events) ? req.data.events : [req.data.events];

        return await upsertEvents(events, {
            function: 'ECO_SYSTEM / UPSERT',
            table: 'FCT_CUST_ECO_SYSTEM',
            keyProperty: 'mainTicketId'
        });
    });

    //mapping issue
    srv.on('A_FCT_ENQUIRY', async (req) => {
        const events = Array.isArray(req.data.events) ? req.data.events : [req.data.events];
        for (let event of events) {
            event.enquiryId = (event.id);

            // if (typeof event.vehicleInterests != "undefined") {
            //     event.variant_Code = (event.vehicleInterests[0].variantCode);
            //     event.modelGroup = (event.vehicleInterests[0].modelGroup);
            //     event.genericArticleCode = (event.vehicleInterests[0].genericArticleCode);
            //     event.testDriveDate = (event.vehicleInterests[0].testDriveDate);
            //     event.testDrive = (event.vehicleInterests[0].testDrive);
            //     event.vehicle_model = (event.vehicleInterests[0].model);
            //     event.tradeIn = (event.vehicleInterests[0].tradeIn);
            //     event.budgetLow = (event.vehicleInterests[0].budgetLow);
            //     event.budgetHigh = (event.vehicleInterests[0].budgetHigh);
            //     event.financeType = (event.vehicleInterests[0].financeType);
            //     event.currentMake = (event.vehicleInterests[0].currentMake);
            //     event.financeTerm = (event.vehicleInterests[0].financeTerm);
            //     event.testDriveRejection = (event.vehicleInterests[0].testDriveRejection);
            //     event.currentModel = (event.vehicleInterests[0].currentModel);
            //     event.sourceOfEnquiry = (event.vehicleInterests[0].sourceOfEnquiry);
            // }
            // if (typeof event.EnquiryDetails != "undefined") {
            //     event.EnquiryStatus = (event.EnquiryDetails.EnquiryStatus);
            //     event.QuotationID = (event.EnquiryDetails.QuotationID);
            //     event.EnquiryCreatedDate = (event.EnquiryDetails.EnquiryCreatedDate);
            //     event.OrderId = (event.EnquiryDetails.OrderId);
            // }

            // if (typeof event.enquiryInformation != "undefined") {
            //     event.salesManagerId = (event.enquiryInformation.salesManagerId);
            //     event.offerExpired = (event.enquiryInformation.offerExpired);
            //     event.businessManagerId = (event.enquiryInformation.businessManagerId);
            //     event.customerId = (event.enquiryInformation.customerId);
            //     event.enquiryType = (event.enquiryInformation.enquiryType);
            //     event.branchId = (event.enquiryInformation.branchId);
            //     event.saleType = (event.enquiryInformation.saleType);
            //     event.staffId = (event.enquiryInformation.staffId);
            //     event.distributionChannel = (event.enquiryInformation.distributionChannel);
            //     event.salesGroup = (event.enquiryInformation.salesGroup);
            //     event.division = (event.enquiryInformation.division);
            //     event.salesOffice = (event.enquiryInformation.salesOffice);
            //     event.leadId = (event.enquiryInformation.leadId);
            //     event.salesExecutiveId = (event.enquiryInformation.salesExecutiveId);
            //     event.orgId = (event.enquiryInformation.orgId);
            // }

            assignFirstChild(event, 'Partners');
            assignFirstChild(event, 'vehicleInterests');
            assignFirstChild(event, 'EnquiryDetails');
            assignFirstChild(event, 'customerDetail');
            assignFirstChild(event, 'enquiryInformation');

            mapToHANAStructure(event, 'FCT_ENQUIRY');
        }

        return await upsertEvents(events, {
            function: 'ENQUIRY / UPSERT',
            table: 'FCT_ENQUIRY',
            keyProperty: 'enquiryId'
        });
    });

    //dene
    srv.on('A_FCT_ENQUIRY_FOLLOWUP', async (req) => {
        const events = Array.isArray(req.data.events) ? req.data.events : [req.data.events];

        for (let event of events) {
            event.followUpId = (event.id);
            delete event.id
            delete event.creationDate

        }

        return await upsertEvents(events, {
            function: 'ENQUIRY_FOLLOWUP / UPSERT',
            table: 'FCT_ENQUIRY_FOLLOWUP',
            keyProperty: 'followUpId'
        });
    });

    //mapping issue
    srv.on('A_FCT_ENQUIRY_ITEMS', async (req) => {
        const events = Array.isArray(req.data.events) ? req.data.events : [req.data.events];
        for (let event of events) {
            event.enquiryItemId = (event.id);
            delete event.engineSize
            console.log("#######", typeof event.ProductDetails)

            if (typeof event.ProductDetails != "undefined") {
                event.productClassification = (event.ProductDetails[0].productClassification);
                event.productCost = (event.ProductDetails[0].productCost);
                event.isVatApplicable = (event.ProductDetails[0].isVatApplicable);
                event.productIdDescription = (event.ProductDetails[0].productIdDescription);

            }

            if (typeof event.financeDetails[0] != "undefined") {
                event.productCategory = (event.financeDetails[0].productCategory);
                event.productID = (event.financeDetails[0].productID);
                event.financeCompanyNumber = (event.financeDetails[0].financeCompanyNumber);
                event.financeSchemeName = (event.financeDetails[0].financeSchemeName);
                event.financeBalance = (event.financeDetails[0].financeBalance);
                event.financeRate = (event.financeDetails[0].financeRate);
                event.financeTerm = (event.financeDetails[0].financeTerm);
                event.financeType = (event.financeDetails[0].financeType);
                event.minimumGuaranteedFutureValue = (event.financeDetails[0].minimumGuaranteedFutureValue);
                event.pcpContractMileage = (event.financeDetails[0].pcpContractMileage);
                event.monthlyPayment = (event.financeDetails[0].monthlyPayment);
                event.cashInput = (event.financeDetails[0].cashInput);
                event.financeCompanyNumberSAP = (event.financeDetails[0].financeCompanyNumberSAP);
                event.quotationReferenceNumber = (event.financeDetails[0].quotationReferenceNumber);
            }


        }

        return await upsertEvents(events, {
            function: 'ENQUIRY_ITEMS / UPSERT',
            table: 'FCT_ENQUIRY_ITEMS',
            keyProperty: 'enquiryItemId'
        });
    });

    //done
    srv.on('A_FCT_LEAD', async (req) => {
        const events = Array.isArray(req.data.events) ? req.data.events : [req.data.events];
        for (let event of events) {
            delete event.salesExecutiveId
            delete event.creationDate
            delete event.removed
            delete event.salesManagerId
        }

        return await upsertEvents(events, {
            function: 'LEAD / UPSERT',
            table: 'FCT_LEAD',
            keyProperty: 'leadId'
        });
    });

    //done
    srv.on('A_FCT_LEAD_UPDATES', async (req) => {
        const events = Array.isArray(req.data.events) ? req.data.events : [req.data.events];
        for (let event of events) {
            event.leadUpdateId = (event.leadUpdatedId)
            delete event.leadUpdatedId
        }

        return await upsertEvents(events, {
            function: 'LEAD UPDATES / UPSERT',
            table: 'FCT_LEAD_UPDATES',
            keyProperty: 'leadUpdateId'
        });
    });

    //done
    srv.on('A_DIM_MATERIAL', async (req) => {
        const events = Array.isArray(req.data.events) ? req.data.events : [req.data.events];
        // for (let event of events) {

        // }

        return await upsertEvents(events, {
            function: 'MATERIAL / UPSERT',
            table: 'DIM_MATERIAL',
            keyProperty: 'material'
        });
    });

    //done
    srv.on('A_FCT_OPPORTUNITY', async (req) => {
        const events = Array.isArray(req.data.events) ? req.data.events : [req.data.events];
        // for (let event of events) {
        // }

        return await upsertEvents(events, {
            function: 'OPPORTUNITY / UPSERT',
            table: 'FCT_OPPORTUNITY',
            keyProperty: 'opportunityId'
        });
    });


    //done
    srv.on('A_FCT_ORDER_ITEMS', async (req) => {
        const events = Array.isArray(req.data.events) ? req.data.events : [req.data.events];
        for (let event of events) {
            event.orderItemId = (event.id);
            event.delivery_Time = (event.deliveryTime);
            delete event.id
            delete event.creationDate
            delete event.removed
            delete event.salesOffice
            delete event.deliveryTime
        }

        return await upsertEvents(events, {
            function: 'ORDER_ITEMS / UPSERT',
            table: 'FCT_ORDER_ITEMS',
            keyProperty: 'orderItemId'
        });
    });

    //mapping issue
    srv.on('A_FCT_ORDERS', async (req) => {
        const events = Array.isArray(req.data.events) ? req.data.events : [req.data.events];
        for (let event of events) {
            event.orderId = (event.id);

            if (typeof event.partners != "undefined") {
                event.partner = (event.partners[0].partner);
                event.partnerFunction = (event.partners[0].partnerFunction);
                event.partnerName = (event.partners[0].partnerName);
            }

            if (typeof event.finance != "undefined") {
                event.financeSchemeName = (event.finance[0].financeSchemeName);
                event.productCategory = (event.finance[0].productCategory);
                event.term = (event.finance[0].term);
                event.monthlyPayment = (event.finance[0].monthlyPayment);
                event.rate = (event.finance[0].rate);
                event.startDate = (event.finance[0].startDate);
                event.endDate = (event.finance[0].endDate);
                event.type = (event.finance[0].type);
                event.balance = (event.finance[0].balance);
                event.invoiceId = (event.finance[0].invoiceId);
                event.minimumGuaranteedFutureValue = (event.finance[0].minimumGuaranteedFutureValue);

            }
        }

        return await upsertEvents(events, {
            function: 'ORDERS / UPSERT',
            table: 'FCT_ORDERS',
            keyProperty: 'orderId'
        });
    });

    // mapping issue
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


    // done 
    srv.on('A_FCT_QUOTATIONS_ITEMS', async (req) => {
        const events = Array.isArray(req.data.events) ? req.data.events : [req.data.events];
        for (let event of events) {

            event.quotationsItemsId = (event.id);
            delete event.id
        }

        return await upsertEvents(events, {
            function: 'QUOTATIONS_ITEMS / UPSERT',
            table: 'FCT_QUOTATIONS_ITEMS',
            keyProperty: 'quotationsItemsId'
        });
    });

    //done
    srv.on('A_FCT_SERVICE_MAIN_CONT', async (req) => {
        const events = Array.isArray(req.data.events) ? req.data.events : [req.data.events];
        for (let event of events) {
            event.serviceMainContractId = (event.id);
            event.endDate = (event.contractEndDate);
            delete event.id
            delete event.removed
            delete event.contractEndDate
        }

        return await upsertEvents(events, {
            function: 'SERVICE_MAIN_CONT / UPSERT',
            table: 'FCT_SERVICE_MAIN_CONT',
            keyProperty: 'serviceMainContractId'
        });
    });

    // mapping issue
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

    // done
    srv.on('A_FCT_SERVICE_ORDER_JOB_LINES', async (req) => {
        const events = Array.isArray(req.data.events) ? req.data.events : [req.data.events];
        for (let event of events) {
            event.serviceOrderJoblinesId = (event.id);
            delete event.id
        }

        return await upsertEvents(events, {
            function: 'SERVICE_ORDER_JOB_LINES / UPSERT',
            table: 'FCT_SERVICE_ORDER_JOB_LINES',
            keyProperty: 'serviceOrderJoblinesId'
        });
    });

    srv.on('A_DIM_VEHICLE_GROUP', async (req) => {
        const events = Array.isArray(req.data.events) ? req.data.events : [req.data.events];
        for (let event of events) {
            event.vehicleIdentificationNumber = (event.id);
            event.engineCapacity = (event.engineSize);
            event.odometer = (event.currentOdometer);
            event.exteriorColours = (event.exteriorColor);
            event.interiorColours = (event.interiorColor);

            delete event.id
            delete event.engineSize
            delete event.itemStatus
            delete event.brandCode
            delete event.referenceDocumentItem
            delete event.currentOdometer
            delete event.exteriorColours
            delete event.interiorColors
            delete event.quantity
            delete event.deliveryDate
            delete event.customerId
            delete event.orgId
            delete event.salesOffice
            delete event.salesGroup
            delete event.division
            delete event.distributionChannel
            delete event.creationDate
        }

        return await upsertEvents(events, {
            function: 'VEHICLE_GROUP / UPSERT',
            table: 'DIM_VEHICLE_GROUP',
            keyProperty: 'vehicleIdentificationNumber'
        });
    });



};
