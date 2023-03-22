using {
  Country,
  managed
} from '@sap/cds/common';
using {db} from '../db/schema';

service ServiceOrderJobsService {

  entity FCT_SERVICE_ORDER_JOBS as projection on db.FCT_SERVICE_ORDER_JOBS {}

}
