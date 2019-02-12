package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.param.DateRangeParam;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenOrListParam;
import ca.uhn.fhir.rest.param.TokenParam;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.DocumentReference;
import org.hl7.fhir.dstu3.model.IdType;

public interface IDocumentReference {

    Bundle search(TokenParam resid, TokenParam identifier, ReferenceParam patient,
                  DateRangeParam date, TokenOrListParam type, TokenOrListParam setting, DateRangeParam period);

    DocumentReference create(FhirContext ctx, DocumentReference documentReference, IdType theId, String theConditional);

}
