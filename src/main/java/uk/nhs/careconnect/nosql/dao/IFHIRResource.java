package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import com.mongodb.DBObject;
import org.hl7.fhir.dstu3.model.IdType;
import org.hl7.fhir.dstu3.model.Resource;

public interface IFHIRResource {

    DBObject save(FhirContext ctx, Resource resource, IdType idType, SaveAction saveAction);

}
