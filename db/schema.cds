namespace db;



entity FCT_SERVICE_ORDER_JOBS {
    
    key SERVICEORDERJOBID : String;
    SERVICEORDERID  : String;
    SOURCESYSTEM : String;
    BRANDCODE  : String;
    CURRENCY : String;
    SALESGROUP : String;
    QUANTITY : Decimal;
    PRICE : Decimal;
    DISCOUNT : Decimal;
    TOTAL : Decimal;
    JOBDESCRIPTION : String;
    TAX : Decimal;
    LASTUPDATEDATE : Date;
    VEHICLEIDENTIFICATIONNUMBER : String;
    CUSTOMERCODE: String;
    JOBID : String;
    PACKAGEID : String;
    PACKAGEDESCRIPTION : String;
    EXTERNALPACKAGEID : String;
    SERVICETIME : String;
    UNITOFMEASURE : String;
    ORDERAMOUNT : Decimal;
    ORDERNUMBER : String;
    ISDEFERRED : Boolean;
    DEFERREDREASON : String;
    DEFERREDCATEGORY : String;
    DEFERREDJOBFOLLOWUPDATE : Date;
    DEFFEREDJOBSCURRENCY : String;

  }