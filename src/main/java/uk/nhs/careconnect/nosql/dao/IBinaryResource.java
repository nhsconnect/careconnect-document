package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import org.hl7.fhir.dstu3.model.Binary;
import org.hl7.fhir.dstu3.model.IdType;


public interface IBinaryResource {

    Binary save(FhirContext ctx, Binary binary);

    Binary read(FhirContext ctx, IdType theId);
}
