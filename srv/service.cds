using from '../db/schema_FCT';
using from '../db/schema_DIM';
using from '../db/schema_API';

service API {}
service FCT {}
service DIM {}

service UpsertService {
  entity ResponseMessages       as projection on API.ResponseMessages;

  entity FCT_SERVICE_ORDER_JOBS as projection on FCT.SERVICE_ORDER_JOBS;

  action A_FCT_SERVICE_ORDER_JOBS(events : many FCT_SERVICE_ORDER_JOBS) returns many ResponseMessages;
};
