package uk.nhs.careconnect.ri.extranet.providers;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.model.api.Include;
import ca.uhn.fhir.model.valueset.BundleTypeEnum;
import ca.uhn.fhir.rest.annotation.*;
import ca.uhn.fhir.rest.api.EncodingEnum;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.param.DateRangeParam;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenParam;
import ca.uhn.fhir.rest.server.IResourceProvider;
import ca.uhn.fhir.rest.server.exceptions.InternalErrorException;
import org.apache.camel.*;
import org.hl7.fhir.dstu3.model.*;
import org.hl7.fhir.instance.model.api.IBaseResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
public class ObservationExtranetProvider implements IResourceProvider {

    @Autowired
    CamelContext context;

    @Autowired
    FhirContext ctx;

    @Autowired
    IComposition compositionDao;

    private static final Logger log = LoggerFactory.getLogger(ObservationExtranetProvider.class);

    @Override
    public Class<Observation> getResourceType() {
        return Observation.class;
    }



    @Search
    public List<Observation> searchObservation(HttpServletRequest httpRequest,
                                               @OptionalParam(name= Observation.SP_CATEGORY) TokenParam category,
                                               @OptionalParam(name= Observation.SP_CODE) TokenParam code,
                                               @OptionalParam(name= Observation.SP_DATE) DateRangeParam effectiveDate,
                                               @OptionalParam(name = Observation.SP_PATIENT) ReferenceParam patient
            , @OptionalParam(name = Observation.SP_RES_ID) TokenParam resid
    ) {

        List<Observation> results = new ArrayList<Observation>();

        ProducerTemplate template = context.createProducerTemplate();

        InputStream inputStream = null;
        if (httpRequest != null) {
            inputStream =(InputStream) template.sendBody("direct:FHIRObservation",
                    ExchangePattern.InOut,httpRequest);
        } else {
            Exchange exchange = template.send("direct:FHIRObservation",ExchangePattern.InOut, new Processor() {
                public void process(Exchange exchange) throws Exception {
                    exchange.getIn().setHeader(Exchange.HTTP_QUERY, "?patient="+patient.getIdPart());
                    exchange.getIn().setHeader(Exchange.HTTP_METHOD, "GET");
                    exchange.getIn().setHeader(Exchange.HTTP_PATH, "Observation");
                }
            });
            inputStream = (InputStream) exchange.getIn().getBody();
        }

        Bundle bundle = null;

        Reader reader = new InputStreamReader(inputStream);
        IBaseResource resource = null;
        try {
            resource = ctx.newJsonParser().parseResource(reader);
        } catch(Exception ex) {
            log.error("JSON Parse failed " + ex.getMessage());
            throw new InternalErrorException(ex.getMessage());
        }
        if (resource instanceof Bundle) {
            bundle = (Bundle) resource;
            for (Bundle.BundleEntryComponent entry : bundle.getEntry()) {
                Observation observation = (Observation) entry.getResource();
                results.add(observation);
            }
        }
        else if (resource instanceof OperationOutcome)
        {

            OperationOutcome operationOutcome = (OperationOutcome) resource;
            log.info("Sever Returned: "+ctx.newJsonParser().encodeResourceToString(operationOutcome));

            OperationOutcomeFactory.convertToException(operationOutcome);
        } else {
            throw new InternalErrorException("Server Error",(OperationOutcome) resource);
        }

        return results;

    }




}
