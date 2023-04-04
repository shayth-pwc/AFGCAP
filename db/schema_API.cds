namespace API;

@cds.persistence.skip
entity ResponseMessages {
  success : Boolean default false;
  message : String;
  error   : String;
};

@cds.persistence.exists
entity LOG {
  key ID              : UUID @Core.Computed;
      CALLED_FUNC     : String;
      RESPONSE_CODE   : String;
      BRANDCODE       : String;
      RESPONSE_STATUS : String;
      RESPONSE_TEXT   : String;
      RESPONSE_TIME   : String;
      CAPTURE_DATE    : Date;
      CAPTURE_TIME    : Time;
      CAPTURED_BY     : String;
      PAYLOAD         : String;
      STATUS          : String;
};
