package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.IdType;

public interface IBundle {

    Bundle create(FhirContext ctx, Bundle bundle, IdType theId, String theConditional);

    Bundle update(FhirContext ctx, Bundle bundle, IdType theId, String theConditional);

}
