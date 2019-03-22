package uk.nhs.careconnect.nosql.providers;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.annotation.ConditionalUrlParam;
import ca.uhn.fhir.rest.annotation.Create;
import ca.uhn.fhir.rest.annotation.IdParam;
import ca.uhn.fhir.rest.annotation.ResourceParam;
import ca.uhn.fhir.rest.annotation.Update;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.server.IResourceProvider;
import ca.uhn.fhir.rest.server.exceptions.UnclassifiedServerFailureException;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.IdType;
import org.hl7.fhir.dstu3.model.OperationOutcome;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import uk.nhs.careconnect.nosql.dao.BundleResponse;
import uk.nhs.careconnect.nosql.dao.IBundle;

import static uk.nhs.careconnect.nosql.util.BundleUtils.extractFirstResourceOfType;

@Component
public class BundleProvider implements IResourceProvider {

    private static final Boolean CREATED = true;
    private static final Boolean UPDATED = false;

    @Autowired
    FhirContext ctx;

    @Autowired
    IBundle bundleDao;

    @Override
    public Class<Bundle> getResourceType() {
        return Bundle.class;
    }


    @Create
    public MethodOutcome create(@ResourceParam Bundle bundle) {
        BundleResponse bundleResponse = bundleDao.create(bundle, null, null);

        return aMethodOutcomeResponse(bundleResponse, CREATED);
    }

    @Update
    public MethodOutcome update(@ResourceParam Bundle bundle, @IdParam IdType bundleId, @ConditionalUrlParam String conditional) {
        BundleResponse bundleResponse = bundleDao.update(bundle, bundleId, conditional);

        return aMethodOutcomeResponse(bundleResponse, UPDATED);
    }

    private MethodOutcome aMethodOutcomeResponse(BundleResponse bundleResponse, Boolean created) {
        MethodOutcome method = new MethodOutcome();
        method.setCreated(created);

        OperationOutcome operationOutcome = bundleResponse.getOperationOutcome();

        method.setOperationOutcome(operationOutcome);
        method.setId(operationOutcome.getIdElement());

        method.setResource(bundleResponse.getBundle());

        return method;
    }

}
