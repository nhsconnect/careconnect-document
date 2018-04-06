package uk.nhs.careconnect.edms.providers;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.model.valueset.BundleTypeEnum;
import ca.uhn.fhir.rest.annotation.*;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenParam;
import ca.uhn.fhir.rest.server.IResourceProvider;

import org.hl7.fhir.dstu3.model.*;
import org.hl7.fhir.instance.model.api.IBaseResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Component
public class DocumentReferenceProvider implements IResourceProvider {

    @Autowired
    FhirContext ctx;


    public Class<? extends IBaseResource> getResourceType() {
        return DocumentReference.class;
    }



    @Read
    public Composition getCompositionById(HttpServletRequest request, @IdParam IdType internalId) {

        // Composition composition = compositionDao.read(ctx,internalId);

        return null;
    }

    @Search
    public List<Resource> searchComposition(HttpServletRequest theRequest
            , @OptionalParam(name = DocumentReference.SP_RES_ID) TokenParam resid
            , @OptionalParam(name = DocumentReference.SP_PATIENT) ReferenceParam patient

    ) {

        List<Resource> results =  null; //compositionDao.search(ctx,resid,patient);


        return results;

    }
}
