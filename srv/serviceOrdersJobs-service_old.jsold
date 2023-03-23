const cds = require("@sap/cds");
const { SELECT, UPSERT } = cds;
const { FCT_SERVICE_ORDER_JOBS, API_LOG } = cds.entities;

module.exports = cds.service.impl(async (srv) => {
  srv.on("READ", FCT_SERVICE_ORDER_JOBS, async (req) => {
    const { SERVICEORDERJOBID } = req.params;

    const data = await srv.transaction().run(
      SELECT.from(FCT_SERVICE_ORDER_JOBS).where({ SERVICEORDERJOBID })
    );

    return data[0];
  });

  srv.on("POST", "FCT_SERVICE_ORDER_JOBS", async (req) => {
    const events = req.data;
  
    await Promise.all(
      events.map(async (event) => {
        const {
          SERVICEORDERJOBID: serviceOrderJobId,
          SERVICEORDERID: serviceOrderId = "",
          SOURCESYSTEM: sourceSystem = "",
          BRANDCODE: brandCode = "",
          CURRENCY: currency = "",
          SALESGROUP: salesGroup = "",
          QUANTITY: quantity = null,
          PRICE: price = null,
          DISCOUNT: discount = null,
          TOTAL: total = null,
          JOBDESCRIPTION: jobDescription = "",
          TAX: tax = null,
          LASTUPDATEDATE: lastUpdateDate = new Date(),
          VEHICLEIDENTIFICATIONNUMBER: vehicleIdentificationNumber = "",
          CUSTOMERCODE: customerCode = "",
          JOBID: jobId = "",
          PACKAGEID: packageId = "",
          PACKAGEDESCRIPTION: packageDescription = "",
          EXTERNALPACKAGEID: externalPackageId = "",
          SERVICETIME: serviceTime = "",
          UNITOFMEASURE: unitOfMeasure = "",
          ORDERAMOUNT: orderAmount = null,
          ORDERNUMBER: orderNumber = "",
          ISDEFERRED: isDeferred = false,
          DEFERREDREASON: deferredReason = "",
          DEFERREDCATEGORY: deferredCategory = "",
          DEFERREDJOBFOLLOWUPDATE: deferredJobFollowupDate = "",
          DEFFEREDJOBSCURRENCY: defferedJobsCurrency = "",
        } = event;
  
      
        if (event.ISDEFERRED === true) {
          isDeferred = true;
        }
  
        try {
          
          const statement = UPSERT.into(FCT_SERVICE_ORDER_JOBS).entries({
            SERVICEORDERJOBID: serviceOrderJobId,
            SERVICEORDERID: serviceOrderId,
            SOURCESYSTEM: sourceSystem,
            BRANDCODE: brandCode,
            CURRENCY: currency,
            SALESGROUP: salesGroup,
            QUANTITY: quantity,
            PRICE: price,
            DISCOUNT: discount,
            TOTAL: total,
            JOBDESCRIPTION: jobDescription,
            TAX: tax,
            LASTUPDATEDATE: lastUpdateDate,
            VEHICLEIDENTIFICATIONNUMBER: vehicleIdentificationNumber,
            CUSTOMERCODE: customerCode,
            JOBID: jobId,
            PACKAGEID: packageId,
            PACKAGEDESCRIPTION: packageDescription,
            EXTERNALPACKAGEID: externalPackageId,
            SERVICETIME: serviceTime,
            UNITOFMEASURE: unitOfMeasure,
            ORDERAMOUNT: orderAmount,
            ORDERNUMBER: orderNumber,
            ISDEFERRED: isDeferred,
            DEFERREDREASON: deferredReason,
            DEFERREDCATEGORY: deferredCategory,
            DEFERREDJOBFOLLOWUPDATE: deferredJobFollowupDate,
            DEFFEREDJOBSCURRENCY: defferedJobsCurrency,
          });
  
          await cds.run(statement);
          console.log(`Successfully inserted data for ${serviceOrderJobId}.`);
          return { success: true, message : `Successfully inserted data for ${serviceOrderJobId}.` };
        } catch (error) {
          console.error(`Failed to insert data for ${serviceOrderJobId}: ${error}`);
          const logData = {
            CALLED_FUNC: 'function_name',
            RESPONSE_CODE: 'response_code',
            BRANDCODE: 'brand_code',
            RESPONSE_STATUS: 'error',
            RESPONSE_TEXT: `Failed to insert data for ${serviceOrderJobId}: ${error}`,
            RESPONSE_TIME: 0,
            CAPTURE_DATE: new Date(),
            CAPTURE_TIME: new Date(),
            CAPTURED_BY: 'system',
            PAYLOAD: event,
            STATUS: 'new'
          };
          await INSERT.into(API_LOG).entries(logData);
        
          return { success: false, message : `Failed to insert data for ${serviceOrderJobId}.` , error: {error}};
        }
      })
    );
  
    return { message: "Data inserted successfully" };
  });
});