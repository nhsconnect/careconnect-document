package uk.nhs.careconnect.nosql.dao;

import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.IdType;

public interface IBundle {

    Bundle create(Bundle bundle, IdType theId, String theConditional);

    Bundle update(Bundle bundle, IdType theId, String theConditional);

}
