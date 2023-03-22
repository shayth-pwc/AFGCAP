using { Country, managed } from '@sap/cds/common';

service API_LOG {

  entity API_LOG {
    
    key ID : String;
    CALLED_FUNC  : String;
    RESPONSE_CODE : String;
    BRANDCODE  : String;
    RESPONSE_STATUS : String;
    RESPONSE_TEXT : String;
    RESPONSE_TIME : Decimal;
    CAPTURE_DATE : Date;
    CAPTURE_TIME : Time;
    CAPTURED_BY : String;
    PAYLOAD : String;
    STATUS : String;

  }
}