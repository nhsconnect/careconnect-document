package uk.nhs.careconnect.nosql.dao;

import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.OperationOutcome;

public class BundleResponse {

    private final OperationOutcome operationOutcome;
    private final Bundle bundle;

    public BundleResponse(OperationOutcome operationOutcome, Bundle bundle) {
        this.operationOutcome = operationOutcome;
        this.bundle = bundle;
    }

    public OperationOutcome getOperationOutcome() {
        return operationOutcome;
    }

    public Bundle getBundle() {
        return bundle;
    }

}
