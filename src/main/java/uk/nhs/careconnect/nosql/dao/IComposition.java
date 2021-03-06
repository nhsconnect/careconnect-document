package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.param.DateRangeParam;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenOrListParam;
import ca.uhn.fhir.rest.param.TokenParam;
import org.hl7.fhir.dstu3.model.*;

import java.util.List;

public interface IComposition {

    Composition read(FhirContext ctx, IdType theId);

    Bundle readDocument(FhirContext ctx, IdType theId);

    List<Resource> search(FhirContext ctx, TokenParam resid, TokenParam identifier, ReferenceParam patient, DateRangeParam date, TokenOrListParam type);
}
