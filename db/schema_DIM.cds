namespace DIM;

@cds.persistence.exists
entity MATERIAL {
    key material            : String;
        derivative          : String;
        make                : String;
        makeCode            : String;
        model               : String;
        modelCode           : String;
        modelYear           : Integer default 0;
        bodyType            : String;
        fuelType            : String;
        modelGrade          : String;
        modelGroup          : String;
        engineCapacity      : String;
        numberOfDoors       : Decimal default 0;
        numberOfSeats       : String;
        transmissionType    : String;
        vehicleType         : String;
        countryOfOrigin     : String;
        yearOfManufature    : Decimal default 0;
        torque              : String;
        tireSize            : String;
        trimType            : String;
        engineType          : String;
        finalDrive          : String;
        specificationRegion : String;
        typeOfWheel         : String;
        cubicCapacity       : String;
        numberOfAxles       : Integer default 0;
        numberOfGears       : Integer default 0;
        numberOfTyres       : Integer default 0;
        numberOfValves      : Integer default 0;
        fuelTankCapacity    : String;
        numberOfCylinders   : Integer default 0;
};

@cds.persistence.exists
entity VEHICLE_GROUP {
        //
        id                          : String;
        engineSize                  : String;
        itemStatus                  : String;
        referenceDocumentItem       : String;
        brandCode                   : String;
        interiorColours            : String;
        exteriorColours           : String;
        currentOdometer             : Decimal default 0;
        quantity                    : String;
        deliveryDate                : DateTime;
        customerId                  : String;
        orgId                       : String;
        salesOffice                 : String;
        salesGroup                  : String;
        division                    : String;
        distributionChannel         : String;
        creationDate                : DateTime;
        //
        accountId                   : String;
        accountName                 : String;
    key vehicleIdentificationNumber : String;
        make                        : String;
        makeCode                    : String;
        model                       : String;
        modelCode                   : String;
        derivative                  : String;
        material                    : String;
        vehicleStatus               : String;
        odometer                    : Decimal default 0;
        modelYear                   : Decimal default 0;
        variantCode                 : String;
        bodyType                    : String;
        fuelType                    : String;
        modelGrade                  : String;
        modelGroup                  : String;
        engineCapacity              : String;
        numberOfDoors               : Decimal default 0;
        numberOfSeats               : String;
        transmissionType            : String;
        genericExteriorColours      : String;
        genericInteriorColours      : String;
        exteriorColourCode          : String;
        interiorColourCode          : String;
        vehicleInternalNumber       : String;
        location                    : String;
        vehicleAllocation           : String;
        grossPrice                  : Decimal default 0;
        interior                    : String;
        exterior                    : String;
        safety                      : String;
        warranty                    : String;
        consumerOffers              : String;
        audioAndEntertainment       : String;
        boeDate                     : DateTime;
        acquisitionDate             : DateTime;
        engineNumber                : String;
        lvMainType                  : String;
        nextServiceDueDate          : DateTime;
        modelServiceCode            : String;
        licensePlateNumber          : String;
        countryOfOrgin              : String;
        registrationDate            : DateTime;
        registrationAuthority       : String;
        registrationType            : String;
        registrationCountry         : String;
        registrationOdometer        : Decimal default 0;
        lastServiceDate             : DateTime;
        yearOfManufacture           : Decimal default 0;
        activeCustomerId            : String;
        exteriorAttributes          : String;
        interiorAttributes          : String;
};

@cds.persistence.exists
entity CUST_UCPID_MAP {
     crmId : many String;
    UCPID : String;
    sourceSystem : String;
}
