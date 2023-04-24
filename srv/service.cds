using from '../db/schema_FCT';
using from '../db/schema_DIM';
using from '../db/schema_API';

service API {}
service FCT {}
service DIM {}

service UpsertService @(impl: './upsertService.js', protocol: 'rest') {
  entity ResponseMessages       as projection on API.ResponseMessages;

  entity FCT_SERVICE_ORDER_JOBS as projection on FCT.SERVICE_ORDER_JOBS;

  action A_FCT_SERVICE_ORDER_JOBS(events : many FCT_SERVICE_ORDER_JOBS) returns many ResponseMessages;

  entity FCT_WARRANTIES as projection on FCT.WARRANTIES;

  action A_FCT_WARRANTIES(events : many FCT_WARRANTIES) returns many ResponseMessages;

  entity FCT_RECALLS as projection on FCT.RECALLS;

  action A_FCT_RECALLS(events : many FCT_RECALLS) returns many ResponseMessages;

  entity FCT_SERVICE_ORDER_JOB_LINES as projection on FCT.SERVICE_ORDER_JOB_LINES;

  action A_FCT_SERVICE_ORDER_JOB_LINES(events : many FCT_SERVICE_ORDER_JOB_LINES) returns many ResponseMessages;

  entity FCT_SERVICE_MAIN_CONT as projection on FCT.SERVICE_MAIN_CONT;

  action A_FCT_SERVICE_MAIN_CONT(events : many FCT_SERVICE_MAIN_CONT) returns many ResponseMessages;

  entity FCT_ORDER_ITEMS as projection on FCT.ORDER_ITEMS;

  action A_FCT_ORDER_ITEMS(events : many FCT_ORDER_ITEMS) returns many ResponseMessages;

  entity FCT_QUOTATIONS_ITEMS as projection on FCT.QUOTATIONS_ITEMS;

  action A_FCT_QUOTATIONS_ITEMS(events : many FCT_QUOTATIONS_ITEMS) returns many ResponseMessages;

  entity FCT_OPPORTUNITY as projection on FCT.OPPORTUNITY;

  action A_FCT_OPPORTUNITY(events : many FCT_OPPORTUNITY) returns many ResponseMessages;

  entity FCT_LEAD_UPDATES as projection on FCT.LEAD_UPDATES;

  action A_FCT_LEAD_UPDATES(events : many FCT_LEAD_UPDATES) returns many ResponseMessages;

  entity FCT_LEAD as projection on FCT.LEAD;

  action A_FCT_LEAD(events : many FCT_LEAD) returns many ResponseMessages;

  entity FCT_ENQUIRY_FOLLOWUP as projection on FCT.ENQUIRY_FOLLOWUP;

  action A_FCT_ENQUIRY_FOLLOWUP(events : many FCT_ENQUIRY_FOLLOWUP) returns many ResponseMessages;

  entity FCT_CUST_ECO_SYSTEM as projection on FCT.CUST_ECO_SYSTEM;

  action A_FCT_CUST_ECO_SYSTEM(events : many FCT_CUST_ECO_SYSTEM) returns many ResponseMessages;

  entity FCT_ENQUIRY_ITEMS as projection on FCT.ENQUIRY_ITEMS;

  action A_FCT_ENQUIRY_ITEMS(events : many FCT_ENQUIRY_ITEMS) returns many ResponseMessages;

  entity FCT_ENQUIRY as projection on FCT.ENQUIRY;

  action A_FCT_ENQUIRY(events : many FCT_ENQUIRY) returns many ResponseMessages;

   entity FCT_QUOTATIONS as projection on FCT.QUOTATIONS;

  action A_FCT_QUOTATIONS(events : many FCT_QUOTATIONS) returns many ResponseMessages;

  entity FCT_ORDERS as projection on FCT.ORDERS;

  action A_FCT_ORDERS(events : many FCT_ORDERS) returns many ResponseMessages;

  entity FCT_SERVICE_ORDER as projection on FCT.SERVICE_ORDER;

  action A_FCT_SERVICE_ORDER(events : many FCT_SERVICE_ORDER) returns many ResponseMessages;

  entity DIM_MATERIAL as projection on DIM.MATERIAL;

  action A_DIM_MATERIAL(events : many DIM_MATERIAL) returns many ResponseMessages;

  entity DIM_VEHICLE_GROUP as projection on DIM.VEHICLE_GROUP;

  action A_DIM_VEHICLE_GROUP(events : many DIM_VEHICLE_GROUP) returns many ResponseMessages;

  entity DIM_CUST_UCPID_MAP as projection on DIM.CUST_UCPID_MAP;

  action A_DIM_CUST_UCPID_MAP(events : many DIM_CUST_UCPID_MAP) returns many ResponseMessages;




};
