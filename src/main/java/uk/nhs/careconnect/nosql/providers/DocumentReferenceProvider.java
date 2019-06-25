package uk.nhs.careconnect.nosql.providers;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.model.valueset.BundleTypeEnum;
import ca.uhn.fhir.rest.annotation.*;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.api.server.RequestDetails;
import ca.uhn.fhir.rest.param.DateRangeParam;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenOrListParam;
import ca.uhn.fhir.rest.param.TokenParam;
import ca.uhn.fhir.rest.server.IResourceProvider;
import ca.uhn.fhir.rest.server.exceptions.ResourceNotFoundException;
import org.hl7.fhir.dstu3.model.DocumentReference;
import org.hl7.fhir.dstu3.model.IdType;
import org.hl7.fhir.dstu3.model.OperationOutcome;
import org.hl7.fhir.dstu3.model.Resource;
import org.hl7.fhir.instance.model.api.IBaseResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.nhs.careconnect.nosql.dao.IDocumentReference;
import uk.nhs.careconnect.nosql.support.OperationOutcomeFactory;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Component
public class DocumentReferenceProvider implements IResourceProvider {

    @Autowired
    IDocumentReference documentReferenceDao;

    @Autowired
    FhirContext ctx;

    @Override
    public Class<? extends IBaseResource> getResourceType() {
        return DocumentReference.class;
    }

    @Search
    public List<Resource> search(@OptionalParam(name = DocumentReference.SP_RES_ID) TokenParam resid,
                                 @OptionalParam(name = DocumentReference.SP_IDENTIFIER) TokenParam identifier,
                                 @OptionalParam(name = DocumentReference.SP_PATIENT) ReferenceParam patient,
                                 @OptionalParam(name = DocumentReference.SP_CREATED) DateRangeParam createdDate,
                                 @OptionalParam(name = DocumentReference.SP_TYPE) TokenOrListParam type,
                                 @OptionalParam(name = DocumentReference.SP_SETTING) TokenOrListParam setting,
                                 @OptionalParam(name = DocumentReference.SP_PERIOD) DateRangeParam period) {

        return documentReferenceDao.search(resid, identifier, patient, createdDate, type, setting, period);

    }

    @Read
    public DocumentReference read(@IdParam IdType internalId) throws Exception {


        DocumentReference documentReference = documentReferenceDao.read(internalId);
        if (documentReference == null) {
            throw OperationOutcomeFactory.buildOperationOutcomeException(
                    new ResourceNotFoundException("No documentReference details found for documentReference ID: " + internalId.getIdPart()),
                    OperationOutcome.IssueSeverity.ERROR, OperationOutcome.IssueType.NOTFOUND);
        }

        return documentReference;
    }

    @Delete
    public MethodOutcome delete(HttpServletRequest theRequest, @IdParam IdType theId, RequestDetails theRequestDetails)
            throws Exception {

        MethodOutcome outcome =  documentReferenceDao.delete(theId);

        return outcome;

    }

    @Operation(name = "$refresh", idempotent = true, bundleType= BundleTypeEnum.COLLECTION)
    public MethodOutcome refresh() throws Exception {

        documentReferenceDao.refresh(ctx);

        MethodOutcome retVal = new MethodOutcome();
        return retVal;

    }


}
