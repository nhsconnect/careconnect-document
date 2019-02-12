package uk.nhs.careconnect.nosql.providers;

import ca.uhn.fhir.rest.annotation.OptionalParam;
import ca.uhn.fhir.rest.annotation.Search;
import ca.uhn.fhir.rest.param.DateRangeParam;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenOrListParam;
import ca.uhn.fhir.rest.param.TokenParam;
import ca.uhn.fhir.rest.server.IResourceProvider;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.DocumentReference;
import org.hl7.fhir.instance.model.api.IBaseResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.nhs.careconnect.nosql.dao.DocumentReferenceDao;
import uk.nhs.careconnect.nosql.dao.IDocumentReference;

@Component
public class DocumentReferenceProvider implements IResourceProvider {

    @Autowired
    IDocumentReference documentReferenceDao;

    @Override
    public Class<? extends IBaseResource> getResourceType() {
        return DocumentReference.class;
    }

    @Search
    public Bundle search(@OptionalParam(name = DocumentReference.SP_RES_ID) TokenParam resid,
                         @OptionalParam(name = DocumentReference.SP_IDENTIFIER) TokenParam identifier,
                         @OptionalParam(name = DocumentReference.SP_PATIENT) ReferenceParam patient,
                         @OptionalParam(name = DocumentReference.SP_CREATED) DateRangeParam createdDate,
                         @OptionalParam(name = DocumentReference.SP_TYPE) TokenOrListParam type,
                         @OptionalParam(name = DocumentReference.SP_SETTING) TokenOrListParam setting,
                         @OptionalParam(name = DocumentReference.SP_PERIOD) DateRangeParam period) {

            return documentReferenceDao.search(resid, identifier, patient, createdDate, type, setting, period);

        }

}
