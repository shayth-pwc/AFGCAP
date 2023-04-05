const cds = require("@sap/cds");
const generateUUID = require("@sap/cds-foss")("uuid");

module.exports = async (srv) => {
  const upsertAll = async (settings, items) => {
    var response = [];
    try {
      await UPSERT.into(settings.table).entries(items);
      for (let item of items) {
        console.log(
          `Successfully inserted data as bulk in ${settings.table} for ${
            item[settings.keyProperty]
          }.`
        );
        response.push({
          success: true,
          message: `Successfully inserted data as bulk in ${
            settings.table
          } for ${item[settings.keyProperty]}.`,
        });
      }
    } catch (error) {
      console.log(
        `Failed to insert data in ${settings.table} in bulk for ${items.length} items. Switching to individual queries.`
      );
    }
    return response;
  };
  const upsertOne = async (settings, item) => {
    var response = {};
    try {
      await UPSERT.into(settings.table).entries(item);
      console.log(
        `Successfully inserted data in ${settings.table} for ${
          item[settings.keyProperty]
        }.`
      );
      response = {
        success: true,
        message: `Successfully inserted data in ${settings.table} for ${
          item[settings.keyProperty]
        }.`,
      };
    } catch (error) {
      console.log(
        `Failed to insert data for ${item[settings.keyProperty]}.`,
        JSON.stringify(error)
      );
      response = {
        success: false,
        message: `Failed to insert data in ${settings.table} for ${
          item[settings.keyProperty]
        }.`,
        error: JSON.stringify(error),
      };

      const uuid = generateUUID.v4();
      const logData = {
        ID: uuid,
        CALLED_FUNC: settings.function,
        RESPONSE_CODE: error.code?.toString().slice(0, 50),
        RESPONSE_STATUS: "error",
        RESPONSE_TEXT: `Failed to insert data in ${settings.table} for ${
          item[settings.keyProperty]
        }: ${JSON.stringify(error)}`.slice(0, 5000),
        RESPONSE_TIME: "NA",
        CAPTURE_DATE: new Date(),
        CAPTURE_TIME: new Date(),
        CAPTURED_BY: "system",
        PAYLOAD: JSON.stringify(item).slice(0, 5000),
        STATUS: "new",
      };
      await INSERT.into("API_LOG").entries(logData);
    }
    return response;
  };
  const upsertEvents = async (events, settings) => {
    const response = await upsertAll(settings, events);
    if (response.length == 0) {
      for (let item of events) {
        response.push(await upsertOne(settings, item));
      }
    }
    return response;
  };
  // checks if the 'item' is an array, if yes: take the first element of the array and add it to the main event. If no: add the element to the main event.
  const assignFirstChild = (target, itemName) => {
    if (Array.isArray(target[itemName]) && target[itemName].length >= 1) {
      Object.assign(target, target[itemName][0]);
      delete target[itemName];
    } else {
      Object.assign(target, target[itemName]);
      delete target[itemName];
    }
  };
  // gets all columns of all tables in the schema, so we know the table structures in HANA
  const getHANATableColumns = async (schemaName) => {
    const tableFields = {};
    const cols = await cds.run(
      `SELECT TABLE_NAME, COLUMN_NAME FROM SYS.TABLE_COLUMNS WHERE SCHEMA_NAME = '${schemaName}'`
    );
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
    deleted.length > 0 &&
      console.log(
        `WARNING for ${tableName}: Removed ${
          deleted.length
        } properties coming from Boomi: ${deleted.join(", ")}`
      );
    const upperCaseKeys = Object.keys(event).map((x) => x.toUpperCase());
    const missing = HANA_Tables[tableName].filter(
      (x) => !upperCaseKeys.includes(x)
    );
    missing.length > 0 &&
      console.log(
        `WARNING for ${tableName}: Missing ${
          missing.length
        } properties HANA expects: ${missing.join(", ")}`
      );
  };

  // load HANA table structure when app starts
  const HANA_Tables = await getHANATableColumns("TECHDBUSER1");
  console.log(
    `Downloaded table structures of ${Object.keys(HANA_Tables).length} tables`
  );

  //done - UPSERT Tested
  srv.on("A_FCT_SERVICE_ORDER_JOBS", async (req) => {
    const events = Array.isArray(req.data.events)
      ? req.data.events
      : [req.data.events];
    for (let event of events) {
      event.serviceOrderJobId = event.id;
      event.isDeferred = event.isDeferred === true;
      delete event.id
      mapToHANAStructure(event, "FCT_SERVICE_ORDER_JOBS");
      
    }

    return await upsertEvents(events, {
      function: "SERVICE_ORDER_JOBS / UPSERT",
      table: "FCT_SERVICE_ORDER_JOBS",
      keyProperty: "serviceOrderJobId",
    });
  });

  //done - UPSERT Tested
  srv.on("A_FCT_CUST_ECO_SYSTEM", async (req) => {
    const events = Array.isArray(req.data.events)
      ? req.data.events
      : [req.data.events];
    for (let event of events) {
      mapToHANAStructure(event, "FCT_CUST_ECO_SYSTEM");
    }

    return await upsertEvents(events, {
      function: "ECO_SYSTEM / UPSERT",
      table: "FCT_CUST_ECO_SYSTEM",
      keyProperty: "mainTicketId",
    });
  });

  //done - UPSERT Tested
  srv.on("A_FCT_ENQUIRY", async (req) => {
    const events = Array.isArray(req.data.events)
      ? req.data.events
      : [req.data.events];
    for (let event of events) {
      event.enquiryId = event.id;

      assignFirstChild(event, "Partners");
      assignFirstChild(event, "vehicleInterests");
      assignFirstChild(event, "EnquiryDetails");
      assignFirstChild(event, "customerDetail");
      assignFirstChild(event, "enquiryInformation");

      event.PAYMENT_TYPE = event.paymentType;

      event.VARIANT_CODE = event.variantCode;

      event.VEHICLE_MODEL = event.model;

      mapToHANAStructure(event, "FCT_ENQUIRY");
    }

    return await upsertEvents(events, {
      function: "ENQUIRY / UPSERT",
      table: "FCT_ENQUIRY",
      keyProperty: "enquiryId",
    });
  });

  //dene - UPSERT Tested
  srv.on("A_FCT_ENQUIRY_FOLLOWUP", async (req) => {
    const events = Array.isArray(req.data.events)
      ? req.data.events
      : [req.data.events];
    for (let event of events) {
      event.followUpId = event.id;
      event.LASTUPDATEDATE = event.lastUpdatedDate;
      mapToHANAStructure(event, "FCT_ENQUIRY_FOLLOWUP");
    }

    return await upsertEvents(events, {
      function: "ENQUIRY_FOLLOWUP / UPSERT",
      table: "FCT_ENQUIRY_FOLLOWUP",
      keyProperty: "followUpId",
    });
  });

  //dene - UPSERT Tested
  srv.on("A_FCT_ENQUIRY_ITEMS", async (req) => {
    const events = Array.isArray(req.data.events)
      ? req.data.events
      : [req.data.events];
    for (let event of events) {
      event.enquiryItemId = event.id;
      assignFirstChild(event, "ProductDetails");
      assignFirstChild(event, "financeDetails");
      mapToHANAStructure(event, "FCT_ENQUIRY_ITEMS");
    }

    return await upsertEvents(events, {
      function: "ENQUIRY_ITEMS / UPSERT",
      table: "FCT_ENQUIRY_ITEMS",
      keyProperty: "enquiryItemId",
    });
  });

  //done - UPSERT Tested
  srv.on("A_FCT_LEAD", async (req) => {
    const events = Array.isArray(req.data.events)
      ? req.data.events
      : [req.data.events];
    for (let event of events) {

      mapToHANAStructure(event, "FCT_LEAD");
    }

    return await upsertEvents(events, {
      function: "LEAD / UPSERT",
      table: "FCT_LEAD",
      keyProperty: "leadId",
    });
  });

  //done - UPSERT Tested
  srv.on("A_FCT_LEAD_UPDATES", async (req) => {
    const events = Array.isArray(req.data.events)
      ? req.data.events
      : [req.data.events];
    for (let event of events) {
      mapToHANAStructure(event, "FCT_LEAD_UPDATES");
    }

    return await upsertEvents(events, {
      function: "LEAD UPDATES / UPSERT",
      table: "FCT_LEAD_UPDATES",
      keyProperty: "leadUpdateId",
    });
  });

  //done - UPSERT Tested
  srv.on("A_DIM_MATERIAL", async (req) => {
    const events = Array.isArray(req.data.events)
      ? req.data.events
      : [req.data.events];
    for (let event of events) {
      mapToHANAStructure(event, "DIM_MATERIAL");
    }

    return await upsertEvents(events, {
      function: "MATERIAL / UPSERT",
      table: "DIM_MATERIAL",
      keyProperty: "material",
    });
  });

  //done - UPSERT Tested
  srv.on("A_FCT_OPPORTUNITY", async (req) => {
    const events = Array.isArray(req.data.events)
      ? req.data.events
      : [req.data.events];
    for (let event of events) {
      mapToHANAStructure(event, "FCT_OPPORTUNITY");
    }

    return await upsertEvents(events, {
      function: "OPPORTUNITY / UPSERT",
      table: "FCT_OPPORTUNITY",
      keyProperty: "opportunityId",
    });
  });

  //done - UPSERT Tested
  srv.on("A_FCT_ORDER_ITEMS", async (req) => {
    const events = Array.isArray(req.data.events)
      ? req.data.events
      : [req.data.events];
    for (let event of events) {
      event.orderItemId = event.id;
      event.delivery_Time = event.deliveryTime;
      mapToHANAStructure(event, "FCT_ORDER_ITEMS");
    }

    return await upsertEvents(events, {
      function: "ORDER_ITEMS / UPSERT",
      table: "FCT_ORDER_ITEMS",
      keyProperty: "orderItemId",
    });
  });

  //done - UPSERT Tested
  srv.on("A_FCT_ORDERS", async (req) => {
    const events = Array.isArray(req.data.events)
      ? req.data.events
      : [req.data.events];
    for (let event of events) {

      event.orderId = event.id;
      
      assignFirstChild(event, "finance");
      assignFirstChild(event, "partners");
      mapToHANAStructure(event, "FCT_ORDERS");
    }

    return await upsertEvents(events, {
      function: "ORDERS / UPSERT",
      table: "FCT_ORDERS",
      keyProperty: "orderId",
    });
  });

//done - UPSERT Tested
  srv.on("A_FCT_QUOTATIONS", async (req) => {
    const events = Array.isArray(req.data.events)
      ? req.data.events
      : [req.data.events];
    for (let event of events) {
        event.quotationId = event.id
        assignFirstChild(event, "finance");
        assignFirstChild(event, "partners");
        mapToHANAStructure(event, "FCT_QUOTATIONS");
    }

    return await upsertEvents(events, {
      function: "QUOTATIONS / UPSERT",
      table: "FCT_QUOTATIONS",
      keyProperty: "quotationId",
    });
  });

  //done - UPSERT Tested
  srv.on("A_FCT_QUOTATIONS_ITEMS", async (req) => {
    const events = Array.isArray(req.data.events)
      ? req.data.events
      : [req.data.events];
    for (let event of events) {
      event.quotationsItemsId = event.id;
      mapToHANAStructure(event, "FCT_QUOTATIONS_ITEMS");
    }

    return await upsertEvents(events, {
      function: "QUOTATIONS_ITEMS / UPSERT",
      table: "FCT_QUOTATIONS_ITEMS",
      keyProperty: "quotationsItemsId",
    });
  });

  //done - UPSERT Tested
  srv.on("A_FCT_SERVICE_MAIN_CONT", async (req) => {
    const events = Array.isArray(req.data.events)
      ? req.data.events
      : [req.data.events];
    for (let event of events) {
      event.serviceMainContractId = event.id;
      event.endDate = event.contractEndDate;
      mapToHANAStructure(event, "FCT_SERVICE_MAIN_CONT");
    }

    return await upsertEvents(events, {
      function: "SERVICE_MAIN_CONT / UPSERT",
      table: "FCT_SERVICE_MAIN_CONT",
      keyProperty: "serviceMainContractId",
    });
  });

  //done - UPSERT Tested
  srv.on("A_FCT_SERVICE_ORDER", async (req) => {
    const events = Array.isArray(req.data.events)
      ? req.data.events
      : [req.data.events];
    for (let event of events) {
      event.serviceOrderId = event.id;

      event.vehicleOnsite = event.vehicleOnsite ? "Y" : "N";
      assignFirstChild(event, "addtionalInformation");
      assignFirstChild(event, "appointment");
      assignFirstChild(event, "Partners");
      mapToHANAStructure(event, "FCT_SERVICE_ORDER");
    }

    return await upsertEvents(events, {
      function: "SERVICE_ORDER / UPSERT",
      table: "FCT_SERVICE_ORDER",
      keyProperty: "serviceOrderId",
    });
  });

  //done - UPSERT Tested
  srv.on("A_FCT_SERVICE_ORDER_JOB_LINES", async (req) => {
    const events = Array.isArray(req.data.events)
      ? req.data.events
      : [req.data.events];
    for (let event of events) {
      event.serviceOrderJoblinesId = event.id;
      mapToHANAStructure(event, "FCT_SERVICE_ORDER_JOB_LINES");
    }

    return await upsertEvents(events, {
      function: "SERVICE_ORDER_JOB_LINES / UPSERT",
      table: "FCT_SERVICE_ORDER_JOB_LINES",
      keyProperty: "serviceOrderJoblinesId",
    });
  });

  //done - UPSERT Tested

  srv.on("A_DIM_VEHICLE_GROUP", async (req) => {
    const events = Array.isArray(req.data.events)
      ? req.data.events
      : [req.data.events];
    for (let event of events) {
      event.vehicleIdentificationNumber = event.id;
      event.engineCapacity = event.engineSize;
      event.odometer = event.currentOdometer;

      mapToHANAStructure(event, "DIM_VEHICLE_GROUP");
    }

    return await upsertEvents(events, {
      function: "VEHICLE_GROUP / UPSERT",
      table: "DIM_VEHICLE_GROUP",
      keyProperty: "vehicleIdentificationNumber",
    });
  });

   //done - UPSERT Tested

   srv.on("A_FCT_WARRANTIES", async (req) => {
    const events = Array.isArray(req.data.events)
      ? req.data.events
      : [req.data.events];
    for (let event of events) {
      event.warrantieSid = event.id;
     

      mapToHANAStructure(event, "FCT_WARRANTIES");
    }

    return await upsertEvents(events, {
      function: "WARRANTIES / UPSERT",
      table: "FCT_WARRANTIES",
      keyProperty: "warrantieSid",
    });
  });

  //done - UPSERT Tested

  srv.on("A_FCT_RECALLS", async (req) => {
    const events = Array.isArray(req.data.events)
      ? req.data.events
      : [req.data.events];
    for (let event of events) {
      event.recallSid = event.id;
     event.created_On = event.creationDate
     event.claim_Type_Description = event.claimTypeDescription
      assignFirstChild(event, "partners");
      mapToHANAStructure(event, "FCT_RECALLS");
    }

    return await upsertEvents(events, {
      function: "RECALLS / UPSERT",
      table: "FCT_RECALLS",
      keyProperty: "recallSid",
    });
  });
};
