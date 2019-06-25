package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.param.DateRangeParam;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenOrListParam;
import ca.uhn.fhir.rest.param.TokenParam;
import org.hl7.fhir.dstu3.model.DocumentReference;
import org.hl7.fhir.dstu3.model.IdType;
import org.hl7.fhir.dstu3.model.Resource;

import java.util.List;

public interface IDocumentReference {

    List<Resource> search(TokenParam resid, TokenParam identifier, ReferenceParam patient,
                          DateRangeParam date, TokenOrListParam type, TokenOrListParam setting, DateRangeParam period);

    DocumentReference read(IdType internalId) throws Exception;

    MethodOutcome delete(IdType internalId) throws Exception;

    MethodOutcome refresh(FhirContext ctxFHIR) throws Exception;

}
