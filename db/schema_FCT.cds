namespace FCT;

@cds.persistence.exists
entity SERVICE_ORDER_JOBS {
  key serviceOrderJobId           : String; //use the CamelCaseName how Boomi will send it
      SERVICEORDERID              : String;
      SOURCESYSTEM                : String;
      brandCode                   : String;
      CURRENCY                    : String;
      SALESGROUP                  : String;
      QUANTITY                    : Decimal;
      price                       : Decimal default 0;
      DISCOUNT                    : Decimal;
      TOTAL                       : Decimal;
      JOBDESCRIPTION              : String;
      TAX                         : Decimal;
      LASTUPDATEDATE              : Date;
      VEHICLEIDENTIFICATIONNUMBER : String;
      CUSTOMERCODE                : String;
      JOBID                       : String;
      PACKAGEID                   : String;
      PACKAGEDESCRIPTION          : String;
      EXTERNALPACKAGEID           : String;
      SERVICETIME                 : String;
      UNITOFMEASURE               : String;
      ORDERAMOUNT                 : Decimal;
      ORDERNUMBER                 : String;
      ISDEFERRED                  : Boolean;
      DEFERREDREASON              : String;
      DEFERREDCATEGORY            : String;
      DEFERREDJOBFOLLOWUPDATE     : Date;
      DEFFEREDJOBSCURRENCY        : String;
};
