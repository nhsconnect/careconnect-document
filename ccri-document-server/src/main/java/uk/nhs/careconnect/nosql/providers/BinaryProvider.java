package uk.nhs.careconnect.nosql.providers;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.annotation.IdParam;
import ca.uhn.fhir.rest.annotation.Read;
import ca.uhn.fhir.rest.server.IResourceProvider;
import org.hl7.fhir.dstu3.model.Binary;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.Composition;
import org.hl7.fhir.dstu3.model.IdType;
import org.hl7.fhir.instance.model.api.IBaseResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.nhs.careconnect.nosql.dao.CompositionDao;
import uk.nhs.careconnect.nosql.dao.IComposition;
import uk.nhs.careconnect.nosql.dao.IFHIRResource;

import javax.servlet.http.HttpServletRequest;

@Component
public class BinaryProvider implements IResourceProvider {
    @Autowired
    FhirContext ctx;

    @Autowired
    IComposition compositionDao;

    @Autowired
    IFHIRResource resourceDao;

    public Class<? extends IBaseResource> getResourceType() {
        return Binary.class;
    }

    private static final Logger log = LoggerFactory.getLogger(BinaryProvider.class);

    @Read
    public Binary getBinaryById(HttpServletRequest request, @IdParam IdType internalId) {

        Bundle bundle = compositionDao.readDocument(ctx,internalId);
        Binary binary = new Binary();
        String resource = ctx.newXmlParser().encodeResourceToString(bundle);
        log.debug("Resource returned from composition.readDocument as "+resource);
        binary.setId(internalId.getIdPart());
        binary.setContentType("application/fhir+xml");
        binary.setContent(resource.getBytes());

        return binary;
    }
}
