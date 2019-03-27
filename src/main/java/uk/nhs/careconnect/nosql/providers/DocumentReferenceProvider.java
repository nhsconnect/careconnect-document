package uk.nhs.careconnect.nosql.providers;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.annotation.OptionalParam;
import ca.uhn.fhir.rest.annotation.Search;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.client.interceptor.BearerTokenAuthInterceptor;
import ca.uhn.fhir.rest.client.interceptor.SimpleRequestHeaderInterceptor;
import ca.uhn.fhir.rest.gclient.ICriterion;
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
import uk.nhs.careconnect.nosql.dao.IDocumentReference;

import static java.lang.String.format;

@Component
public class DocumentReferenceProvider implements IResourceProvider {

    @Autowired
    IDocumentReference documentReferenceDao;

    @Autowired
    protected FhirContext fhirContext;

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

        //TODO: Put the fhir request here
        String serverBase = "http://192.168.100.15:443/";
        IGenericClient hapiClient = fhirContext.newRestfulGenericClient(serverBase);

        String jwt = "eyAiYWxnIjoibm9uZSIsICJ0eXAiOiJKV1QifQ==.eyJpc3MiOiAiaHR0cHM6Ly93d3cuZXhhbXBsZS5jb20iLCAic3ViIjogImh0dHBzOi8vZmhpci5uaHMudWsvSWQvc2RzLXJvbGUtcHJvZmlsZS1pZHwyMzQ3NjM0NjM3NiIsICJhdWQiOiAiaHR0cHM6Ly9wc2lzLXN5bmMubmF0aW9uYWwubmNycy5uaHMudWsvRG9jdW1lbnRSZWZlcmVuY2UiLCAiZXhwIjogMTQ2OTQzNjk4NywgImlhdCI6IDE0Njk0MzY2ODcsICJyZWFzb25fZm9yX3JlcXVlc3QiOiAiZGlyZWN0Y2FyZSIsICJzY29wZSI6ICJwYXRpZW50L0RvY3VtZW50UmVmZXJlbmNlLndyaXRlIiwgInJlcXVlc3Rpbmdfc3lzdGVtIjogImh0dHBzOi8vZmhpci5uaHMudWsvSWQvYWNjcmVkaXRlZC1zeXN0ZW18MDc1ODgzNzUwNTQxIiwgInJlcXVlc3Rpbmdfb3JnYW5pemF0aW9uIjogImh0dHBzOi8vZmhpci5uaHMudWsvSWQvb2RzLW9yZ2FuaXphdGlvbi1jb2RlfFNDUkEwMSIsICJyZXF1ZXN0aW5nX3VzZXIiOiAiaHR0cHM6Ly9maGlyLm5ocy51ay9JZC9zZHMtcm9sZS1wcm9maWxlLWlkfDIzNDc2MzQ2Mzc2In0=.";
        BearerTokenAuthInterceptor authInterceptor = new BearerTokenAuthInterceptor(jwt);
        hapiClient.registerInterceptor(authInterceptor);

        SimpleRequestHeaderInterceptor fromASIDHeaderInterceptor = new SimpleRequestHeaderInterceptor();
        fromASIDHeaderInterceptor.setHeaderName("fromASID");
        fromASIDHeaderInterceptor.setHeaderValue("075883750541");
        hapiClient.registerInterceptor(fromASIDHeaderInterceptor);

        SimpleRequestHeaderInterceptor toASIDHeaderInterceptor = new SimpleRequestHeaderInterceptor();
        toASIDHeaderInterceptor.setHeaderName("toASID");
        toASIDHeaderInterceptor.setHeaderValue("999999999999");
        hapiClient.registerInterceptor(toASIDHeaderInterceptor);

        ICriterion<?> iCriterion = null;

        if(resid != null && !resid.isEmpty()){
            iCriterion = DocumentReference.RES_ID.exactly().code(resid.getValue());
        } else {
            String patientId = patient.getIdPart();
            iCriterion = DocumentReference.SUBJECT.hasAnyOfIds(format("https://demographics.spineservices.nhs.uk/STU3/Patient/%s", patientId));

        }

        Bundle response = hapiClient.search()
                .forResource(DocumentReference.class)
                .where(iCriterion)
                .accept("application/xml+fhir")
                .returnBundle(Bundle.class)
                .execute();

        return response;

        //return documentReferenceDao.search(resid, identifier, patient, createdDate, type, setting, period);

    }

}
