package uk.nhs.careconnect.nosql.providers;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.model.valueset.BundleTypeEnum;
import ca.uhn.fhir.rest.annotation.*;
import ca.uhn.fhir.rest.param.DateRangeParam;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenOrListParam;
import ca.uhn.fhir.rest.param.TokenParam;
import ca.uhn.fhir.rest.server.IResourceProvider;
import ca.uhn.fhir.rest.server.exceptions.InvalidRequestException;
import org.bson.types.ObjectId;
import org.hl7.fhir.dstu3.model.*;
import org.hl7.fhir.instance.model.api.IBaseResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.nhs.careconnect.nosql.dao.IComposition;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Component
public class CompositionProvider implements IResourceProvider {

    @Autowired
    FhirContext ctx;

    @Autowired
    IComposition compositionDao;

    public Class<? extends IBaseResource> getResourceType() {
        return Composition.class;
    }

    @Operation(name = "document", idempotent = true, bundleType = BundleTypeEnum.DOCUMENT)
    public Bundle compositionDocumentOperation(
            @IdParam IdType internalId,
            @OperationParam(name = "persist") TokenParam persist
    ) {
        HttpServletRequest request = null;

        return compositionDao.readDocument(ctx, internalId);

    }

    @Read
    public Composition getCompositionById(HttpServletRequest request, @IdParam IdType internalId) {

        Composition composition = compositionDao.read(ctx, internalId);

        return composition;
    }

    @Search
    public List<Resource> searchComposition(
            @OptionalParam(name = Composition.SP_RES_ID) TokenParam resid,
            @OptionalParam(name = Composition.SP_IDENTIFIER) TokenParam identifier,
            @OptionalParam(name = Composition.SP_PATIENT) ReferenceParam patient,
            @OptionalParam(name= Composition.SP_DATE) DateRangeParam date,
            @OptionalParam(name= Composition.SP_TYPE) TokenOrListParam type
    ) {

        validateRequestId(resid);

        List<Resource> results = compositionDao.search(ctx, resid, identifier, patient, date, type);

        return results;
    }

    private void validateRequestId(TokenParam resid) {
        if (resid != null && !ObjectId.isValid(resid.getValue()))
            throw new InvalidRequestException("_id must be 24 characters");
    }

}
