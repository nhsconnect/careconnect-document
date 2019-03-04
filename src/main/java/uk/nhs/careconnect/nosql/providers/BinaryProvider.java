package uk.nhs.careconnect.nosql.providers;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.annotation.Create;
import ca.uhn.fhir.rest.annotation.IdParam;
import ca.uhn.fhir.rest.annotation.Read;
import ca.uhn.fhir.rest.annotation.ResourceParam;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.server.IResourceProvider;
import org.hl7.fhir.dstu3.model.Binary;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.IdType;
import org.hl7.fhir.dstu3.model.OperationOutcome;
import org.hl7.fhir.instance.model.api.IBaseResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.nhs.careconnect.nosql.dao.IBinaryResource;
import uk.nhs.careconnect.nosql.dao.IComposition;

import javax.servlet.http.HttpServletRequest;

@Component
public class BinaryProvider implements IResourceProvider {

    private final FhirContext fhirContext;
    private final IBinaryResource binaryDao;
    private final IComposition compositionDao;

    @Autowired
    public BinaryProvider(FhirContext fhirContext, IBinaryResource binaryDao, IComposition compositionDao) {
        this.fhirContext = fhirContext;
        this.binaryDao = binaryDao;
        this.compositionDao = compositionDao;
    }

    public Class<? extends IBaseResource> getResourceType() {
        return Binary.class;
    }

    private static final Logger log = LoggerFactory.getLogger(BinaryProvider.class);

    @Read
    public Binary getBinaryById(@IdParam IdType internalId) {
        Binary binary = null;
        // Assume this is a file

        binary = binaryDao.read(fhirContext, internalId);

        if (binary == null) {
            log.info("Binary was null");
            // if no file return check it is not a composition

            Bundle bundle = compositionDao.readDocument(fhirContext, internalId);
            if (bundle != null) {
                binary = new Binary();
                String resource = fhirContext.newXmlParser().encodeResourceToString(bundle);
                log.debug("Resource returned from composition.readDocument as {}", resource);
                binary.setId(internalId.getIdPart());
                binary.setContentType("application/fhir+xml");
                binary.setContent(resource.getBytes());
            }
        } else {
            String resource = fhirContext.newXmlParser().encodeResourceToString(binary);
            log.debug("Resource returned from binary.read as " + resource);
        }

        return binary;
    }

    @Create
    public MethodOutcome create(HttpServletRequest httpRequest, @ResourceParam Binary binary) {

        OperationOutcome operationOutcome = new OperationOutcome();
        operationOutcome.setId("Binary/" + binaryDao.save(fhirContext, binary));

        MethodOutcome method = new MethodOutcome();
        method.setCreated(true);

        method.setOperationOutcome(operationOutcome);
        method.setId(operationOutcome.getIdElement());

        return method;
    }
}
