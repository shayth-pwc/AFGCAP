namespace FCT;


@cds.persistence.exists
entity SERVICE_ORDER_JOBS {
      creationDate                : Timestamp;
  key id                          : String; //use the CamelCaseName how Boomi will send it
      serviceOrderId              : String;
      sourceSystem                : String;
      brandCode                   : String;
      currency                    : String;
      salesGroup                  : String;
      quantity                    : Decimal default 0;
      price                       : Decimal default 0;
      discount                    : Decimal default 0;
      total                       : Decimal default 0;
      jobDescription              : String;
      tax                         : Decimal default 0;
      lastUpdateDate              : DateTime;
      vehicleIdentificationNumber : String;
      customerCode                : String;
      jobId                       : String;
      packageId                   : String;
      packageDescription          : String;
      externalPackageId           : String;
      serviceTime                 : String;
      unitOfMeasure               : String;
      orderAmount                 : Decimal default 0;
      orderNumber                 : String;
      isDeferred                  : Boolean default false;
      deferredReason              : String;
      deferredCategory            : String;
      deferredJobFollowupDate     : DateTime;
      defferedJobsCurrency        : String;
};

@cds.persistence.exists
entity WARRANTIES {
  key warrantieSid               : String;
      sourceSystem               : String;
      brandcode                  : String;
      lastupdatedate             : DateTime;
      status                     : String;
      description                : String;
      endDate                    : String;
      vehicleidentifcationnumber : String;
      warrantyinfo               : String;
      period                     : Decimal default 0;
      months                     : String;
      startDate                  : DateTime;
      startMileage               : Decimal default 0;
      endMileage                 : Decimal default 0;
};

@cds.persistence.exists
entity RECALLS {
  key recallSid                   : String;
      sourceSystem                : String;
      brandCode                   : String;
      lastupdatedate              : DateTime;
      vehicleidentificationnumber : String;
      recallNumber                : String;
      vehicleRecallStatus         : String;
      claimType                   : String;
      referenceDate               : DateTime;
      referenceNumber             : String;
      recallStatusDescription     : String;
      recallPriorityDescription   : String;
      recallValidFrom             : String;
      recallValidTo               : String;
      claimTypeDescription        : String;
      createdBy                   : String;
      createdByName               : String;
      recallInfo                  : String;
      externalRecallNumber        : String;
      partnerDescription          : String;
      partner                     : String;
      customerCode                : String;
      created_On                  : DateTime;
};

@cds.persistence.exists
entity SERVICE_ORDER_JOB_LINES {
  //
  id : String;
  //
  key serviceOrderJoblinesId : String;
      serviceOrderJobId      : String;
      sourceSystem           : String;
      brandCode              : String;
      currency               : String;
      salesGroup             : String;
      item                   : String;
      material               : String;
      description            : String;
      quantity               : Decimal default 0;
      uom                    : String;
      batch                  : String;
      price                  : Decimal default 0;
      discount               : Decimal default 0;
      total                  : Decimal default 0;
      jobNumber              : String;
      jobDescription         : String;
      itemCategory           : String;
      laborPartValue         : String;
      laborPartDescription   : String;
      orderType              : String;
      orderTypeDesc          : String;
      lastupdatedate         : DateTime;
      creationDate           : DateTime;
};

@cds.persistence.exists
entity SERVICE_MAIN_CONT {
    //
  id : String;
  removed : Boolean default false;
  contractEndDate : DateTime;
  //
  key serviceMainContractId       : String;
      sourceSystem                : String;
      brandCode                   : String;
      lastupdatedate              : DateTime;
      vehicleIdentificationNumber : String;
      currency                    : String;
      amount                      : Decimal default 0;
      orgId                       : String;
      division                    : String;
      salesGroup                  : String;
      distributionchannel         : String;
      branchcode                  : String;
      customerCode                : String;
      serviceContractNumber       : String;
      serviceContractItem         : Decimal default 0;
      contractStartDate           : DateTime;
      coverageItemNumber          : Decimal default 0;
      initialContractOdometer     : Decimal default 0;
      packageHeaderIdentification : String;
      counterReadingMileageFrom   : Decimal default 0;
      counterReadingMileageTo     : Decimal default 0;
      fleetCounterUnit            : String;
      coverageCounter             : Integer default 0;
      coverageConsumption         : Integer default 0;
      contractStatus              : String;
      endDate                     : DateTime;
      startDate                   : DateTime;
      contractType                : String;
      serviceAdvisorId            : String;
      contractServiceAdvisor      : String;
      salesOffice                 : String;
      creationDate                : DateTime;
};

@cds.persistence.exists
entity ORDER_ITEMS {
  //
  creationDate : DateTime;
  removed : Boolean  default false;
  salesOffice : String;
  id : String(500);
  deliveryTime : DateTime;
  //
  key orderItemId                 : String(500);
      orderId                     : String;
      sourceSystem                : String;
      brandCode                   : String;
      salesGroup                  : String;
      customerId                  : String;
      lastUpdateDate              : DateTime;
      item                        : String;
      vehicleIdentificationNumber : String;
      material                    : String;
      derivative                  : String;
      quantity                    : Decimal default 0;
      itemStatus                  : String;
      deliveryDate                : DateTime;
      itemAmount                  : Decimal default 0;
      orderNumber                 : String;
      orderAmount                 : Decimal default 0;
      rejectionReason             : String;
      productIdDescription        : String;
      vehicleDetails              : String;
      productClassification       : String;
      productCategory             : String;
      productId                   : String;
      delivery_Time               : DateTime;
      invoiceDate                 : DateTime;
};

@cds.persistence.exists
entity QUOTATIONS_ITEMS {
  //
  id : String;
  //
  key quotationsItemsId           : String;
      quotationId                 : String;
      sourceSystem                : String;
      brandCode                   : String;
      salesGroup                  : String;
      customerId                  : String;
      item                        : String;
      vehicleIdentificationNumber : String;
      material                    : String;
      derivative                  : String;
      quantity                    : Decimal default 0;
      itemStatus                  : String;
      deliveryDate                : DateTime;
      itemAmount                  : Decimal default 0;
      rejectionReason             : String;
      productIdDescription        : String;
      vehicleDetails              : String;
      productClassification       : String;
      productCategory             : String;
      productId                   : String;
      lastUpdateDate              : DateTime;
      quotationNumber             : String;
      quotationAmount             : Decimal default 0;

};

@cds.persistence.exists
entity OPPORTUNITY {
  key opportunityId       : String;
      sourceSystem        : String;
      status              : String;
      createdDate         : DateTime;
      type                : String;
      salesOffice         : String;
      lostReason          : String;
      lostDate            : DateTime;
      currentVehicleMake  : String;
      currentVehicleModel : String;
      salesExecutiveId    : String;
      brandCode           : String;
};

@cds.persistence.exists
entity LEAD_UPDATES {
  leadUpdatedId : String;
  key leadUpdateId : String;
      sourceSystem : String;
      leadId       : String;
      leadStatus   : String;
      status       : String;
      customerId   : String;
};

@cds.persistence.exists
entity LEAD {
      //
      salesExecutiveId            : String;
      creationDate                : DateTime;
      removed                     : Boolean default false;
      salesManagerId              : String;
      //
      lastUpdateDate              : DateTime;
      salesGroup                  : String;
      division                    : String;
      sourceSystem                : String;
      salesOffice                 : String;
      distributionChannel         : String;
      brandCode                   : String;
      type                        : String;
  key leadId                      : String;
      c4cLeadId                   : String;
      salesOrg                    : String;
      closedReason                : String;
      closedDate                  : DateTime;
      createdDate                 : DateTime;
      webSourceUrl                : String;
      googleClientId              : String;
      language                    : String;
      leadStatus                  : String;
      tradeInMake                 : String;
      tradeInModel                : String;
      usedCarVin                  : String;
      source                      : String;
      branch                      : String;
      sourceCode                  : String;
      statusCode                  : String;
      closedReasonCode            : String;
      webSource                   : String;
      tradeInModelYear            : String;
      leadCampaign                : String;
      vehicleInterestMake         : String;
      vehicleInterestModelGroup   : String;
      leadChannel                 : String;
      webFormName                 : String;
      enquiryId                   : String;
      leadReceivedDate            : DateTime;
      leadPassedToBranchTimestamp : String;
      leadPassedByEmpId           : String;
      leadReceivedDateTime        : String;
      manualLeadCreatedBy         : String;
      customerId                  : String;

};

@cds.persistence.exists
entity ENQUIRY_FOLLOWUP {
      creationDate         : DateTime;
      id                   : String;
  key followUpId           : String;
      enquiryid            : String;
      lastupdatedate       : DateTime;
      salesGroup           : String;
      division             : String;
      customerId           : String;
      sourceSystem         : String;
      salesOffice          : String;
      distributionChannel  : String;
      brandCode            : String;
      opportunityId        : String;
      type                 : String;
      status               : String;
      action               : String;
      comments             : String;
      assignedToSEId       : String;
      passToBranchId       : String;
      leadId               : String;
      c4cLeadId            : String;
      assignedToSEDate     : String;
      passedToBranchDate   : String;
      appointmentDate      : String;
      followUpDate         : DateTime;
      activityStart        : DateTime;
      activityEnd          : DateTime;
      salesOrg             : String;
      salesExecId          : String;
      activityChangedDate  : DateTime;
      customerName         : String;
      subject              : String;
      organizer            : String;
      location             : String;
      allDayEvent          : String;
      category             : String;
      priority             : String;
      primaryContactId     : String;
      primaryContactName   : String;
      createdBy            : String;
      createdOn            : DateTime;
      processor            : String;
      dateCompleted        : DateTime;
      completionPercentage : String;
      transmissionStatus   : String;
      direction            : String;
      sentOn               : DateTime;
      owner                : String;
      senderEmailId        : String;
      senderName           : String;
      receiverEmailId      : String;
      phoneNumber          : String;
      subType              : String;
      reason               : String;
      channel              : String;
      associatedObject     : String;
      associatedObjectId   : String;
      activityTimeStamp    : String;
      chatText             : String;
      mobileNumber         : String;
};

@cds.persistence.exists
entity CUST_ECO_SYSTEM {
      initialReviewCompletedDateTime : DateTime;
      additionDetails                : String;
      priority                       : String;
      sourceSystem                   : String;
      VIN                            : String;
      employeeResponsible            : String;
      source                         : String;
      complaintSubCategory           : String;
      unclearStatusReason            : String;
      customerId                     : String;
      originId                       : String;
      customerExpectation            : String;
      sourceObjectType               : String;
      acquisitionDate                : DateTime;
      communicationMedium            : String;
      reportedBy                     : String;
      brand                          : String;
      processingTypeCode             : String;
      contactPersonName              : String;
      approvalStatus                 : String;
      lastName                       : String;
      complaintCategory              : String;
      showroomName                   : String;
      creationDateTime               : DateTime;
      saleDate                       : DateTime;
      assignedTo                     : String;
      complaintId                    : String;
      status                         : String;
      callType                       : String;
      plateNumber                    : String;
      firstReactionDueDateTime       : DateTime;
      vehicleModel                   : String;
      contactPersonEmail             : String;
      serviceCenterName              : String;
      odometerReading                : String;
      relatedTo                      : String;
  key mainTicketId                   : String;
      completedCaseStatus            : String;
      escalationStatus               : String;
      firstName                      : String;
      vehicleMake                    : String;
      complaintTitle                 : String;
      completionDueDateTime          : DateTime;
      isConsumer                     : Boolean default false;
      contactPersonMobileNo          : String;
      resolvedOnDateTime             : String;

}

@cds.persistence.exists

entity ENQUIRY_ITEMS {

      //ProductDetails : String @assert.range enum{productClassification;};
      engineSize                   : String;
      //
      vehicleInterestModel         : String;
      vehicleInterestMake          : String;
      vehicleInterestModelGroup    : String;
  key enquiryItemId                : String;
      lastUpdateDate               : DateTime;
      salesGroup                   : String;
      division                     : String;
      customerId                   : String;
      sourceSystem                 : String;
      salesOffice                  : String;
      deliveryDate                 : DateTime;
      orgId                        : String;
      enquiryId                    : String;
      vehicleInternalNumber        : String;
      quantity                     : Decimal default 0;
      campaignId                   : String;
      rejectReasonCode             : String;
      referencedocument            : String;
      referencedocumentItem        : Decimal default 0;
      itemStatus                   : String;
      engineNumber                 : String;
      productionDate               : DateTime;
      campaignDescription          : String;
      addOnFlag                    : String;
      productClassification        : String;
      productCategory              : String;
      productID                    : String;
      productIdDescription         : String;
      productCost                  : Decimal default 0;
      isVatApplicable              : String;
      financeCompanyNumber         : String;
      financeSchemeName            : String;
      financeBalance               : Decimal default 0;
      financeRate                  : Decimal default 0;
      financeTerm                  : String;
      financeType                  : String;
      minimumGuaranteedFutureValue : Decimal default 0;
      pcpContractMileage           : String;
      monthlyPayment               : Decimal default 0;
      cashInput                    : Decimal default 0;
      financeCompanyNumberSAP      : String;
      quotationReferenceNumber     : String;
      distributionChannel          : String;
      negotiatedValue              : Decimal default 0;
      revenueStartDate             : DateTime;
      revenueEndDate               : DateTime;

}

@cds.persistence.exists
entity ENQUIRY {

  key enquiryId               : String;
      salesManagerId          : Decimal default 0;
      offerExpired            : String;
      businessManagerId       : Decimal default 0;
      customerId              : String;
      enquiryType             : String;
      branchId                : String;
      saleType                : String;
      staffId                 : Decimal default 0;
      distributionChannel     : String;
      lastupdatedate          : DateTime;
      partner                 : String;
      partnerName             : String;
      partnerFunction         : String;
      sourceOfEnquiry         : String;
      currentModel            : String;
      testDriveRejection      : String;
      financeTerm             : String;
      currentMake             : String;
      financeType             : String;
      budgetHigh              : String;
      budgetLow               : String;
      tradeIn                 : String;
      testDriveDate           : DateTime;
      genericArticleCode      : String;
      modelGroup              : String;
      testDrive               : String;
      vehicle_model           : String;
      variant_Code            : String;
      brandCode               : String;
      CRMID                   : String;
      EnquiryStatus           : String;
      QuotationID             : String;
      EnquiryCreatedDate      : DateTime;
      OrderId                 : String;
      category                : String;
      salesGroup              : String;
      division                : String;
      sourceSystem            : String;
      salesOffice             : String;
      leadId                  : String;
      salesExecutiveId        : Decimal default 0;
      orgId                   : String;
      lostTimestamp           : String;
      lostReason              : String;
      noOfCarsInHousehold     : String;
      timeOfNextAppointment   : DateTime;
      deliveryTimestamp       : DateTime;
      orderedDate             : DateTime;
      lastContactTime         : DateTime;
      firstVisitDate          : DateTime;
      deliveryDate            : DateTime;
      totalNegotiatedValue    : Decimal default 0;
      weightedValue           : Decimal default 0;
      expectedValue           : Decimal default 0;
      closeDate               : DateTime;
      name                    : String;
      reasonForStatus         : String;
      salesCycle              : String;
      salesPhase              : String;
      probability             : String;
      startDate               : DateTime;
      forecastCategory        : String;
      natureOfBusiness        : String;
      tenderFee               : String;
      tenderRegistrationStart : DateTime;
      tenderRegistrationEnd   : DateTime;
      modeOfPayment           : String;
      fAndIIntroduction       : String;
      accesories              : String;
      fabrication             : String;
      documentType            : String;
      customization           : String;
      payment_Type            : String;
}

entity QUOTATIONS {
  key quotationId                 : String;
      tax                         : Decimal default 0;
      customerId                  : String;
      currency                    : String;
      branchCode                  : String;
      orgId                       : String;
      opportunityId               : String;
      distributionChannel         : String;
      salesGroup                  : String;
      amount                      : Decimal default 0;
      division                    : String;
      brandCode                   : String;
      expectedDeliveryDate        : DateTime;
      sourceSystem                : String;
      quotationType               : String;
      lastUpdateDate              : DateTime;
      salesManagerId              : String;
      salesExecutiveId            : String;
      partnerFuction              : String;
      partnerName                 : String;
      partner                     : String;
      invoiceId                   : String;
      rate                        : Decimal default 0;
      minimumGuranteedFutureValue : Decimal default 0;
      type                        : String;
      startDate                   : DateTime;
      endDate                     : DateTime;
      balance                     : Decimal default 0;
      monthlyPayment              : Decimal default 0;
      productCategory             : String;
      term                        : String;
}

entity ORDERS {
  key orderId                      : String;
      tax                          : Decimal default 0;
      orderStatus                  : String;
      customerId                   : String;
      currency                     : String;
      branchcode                   : String;
      orgId                        : String;
      opportunityId                : String;
      distributionchannel          : String;
      salesGroup                   : String;
      amount                       : Decimal default 0;
      division                     : String;
      brandCode                    : String;
      expectedDeliveryDate         : DateTime;
      sourceSystem                 : String;
      quotationId                  : String;
      orderType                    : String;
      lastUpdateDate               : DateTime;
      salesManagerId               : String;
      salesExecutiveId             : String;
      partnerFunction              : String;
      partnerName                  : String;
      partner                      : String;
      minimumGuaranteedFutureValue : Decimal default 0;
      financeSchemeName            : String;
      productCategory              : String;
      term                         : String;
      monthlyPayment               : Decimal default 0;
      rate                         : Decimal default 0;
      startDate                    : DateTime;
      endDate                      : DateTime;
      type                         : String;
      balance                      : Decimal default 0;
      invoiceId                    : String;
}

entity SERVICE_ORDER {
  key serviceOrderId              : String;
      orderType                   : String;
      amount                      : Decimal default 0;
      orderNumber                 : String;
      serviceDate                 : DateTime;
      salesGroup                  : String;
      invoiceDate                 : DateTime;
      vehicleOnsite               : String;
      isVehicleOnSite             : Boolean default false;
      orgId                       : String;
      division                    : String;
      distributionchannel         : String;
      status                      : String;
      brandCode                   : String;
      tax                         : Decimal default 0;
      currency                    : String;
      branchcode                  : String;
      invoiceId                   : String;
      closeDate                   : DateTime;
      description                 : String;
      material                    : String;
      customerArriveDate          : DateTime;
      customerCode                : String;
      serviceAdvisorId            : Decimal default 0;
      addInfoAmount               : Decimal default 0;
      lastUpdateDate              : DateTime;
      sourceSystem                : String;
      appointmentEndDate          : DateTime;
      startDate                   : DateTime;
      show                        : String;
      showDate                    : DateTime;
      confirmationDate            : DateTime;
      plannedStartTimestamp       : DateTime;
      plannedStartDate            : DateTime;
      endDate                     : DateTime;
      currentOdometer             : Decimal default 0;
      vehicleIdentificationNumber : String;
      customerName                : String;
      totalServiceTime            : String;
      make                        : String;
      model                       : String;
      year                        : Decimal default 0;
      variant                     : String;
      partnerName                 : String;
      partnerFunction             : String;
      partner                     : String;
      emailId                     : String;
      phoneNumber                 : String;
      customerFirstName           : String;
      customerLastName            : String;
      postalCode                  : String;
      city                        : String;
      region                      : String;
      country                     : String;
      countryCode                 : String;
      state                       : String;
      streetAddress               : String;
      addressType                 : String;

}
