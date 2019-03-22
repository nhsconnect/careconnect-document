package uk.nhs.careconnect.nosql.dao;

import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.IdType;

public interface IBundle {

    BundleResponse create(Bundle bundle, IdType theId, String theConditional);

    BundleResponse update(Bundle bundle, IdType theId, String theConditional);

}
