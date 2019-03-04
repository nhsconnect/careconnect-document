package uk.nhs.careconnect.nosql.steps;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.context.PerformanceOptionsEnum;
import ca.uhn.fhir.rest.client.api.IClientInterceptor;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import ca.uhn.fhir.rest.client.api.IHttpRequest;
import ca.uhn.fhir.rest.client.api.IHttpResponse;
import cucumber.api.java.en.And;
import cucumber.api.java.en.Given;
import org.apache.commons.io.IOUtils;
import org.hl7.fhir.dstu3.model.Binary;
import org.hl7.fhir.dstu3.model.Bundle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestOperations;
import sun.misc.BASE64Decoder;

import java.io.IOException;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Stream;

import static java.lang.String.format;

public class CommonSteps {

    private static final Logger log = LoggerFactory.getLogger(CommonSteps.class);

    protected static final String[] COLLECTION_NAMES = {"Bundle", "idxComposition", "idxPatient", "idxDocumentReference", "fs.files"};

    @Autowired
    protected MongoTemplate mongoTemplate;

    @Autowired
    protected FhirContext ctx;

    @LocalServerPort
    public String randomServerPort;

    private String serverBase;

    protected IGenericClient hapiClient;

    @Given("a clean mongo database")
    public void aCleanMongoDatabase() {
        Stream.of(COLLECTION_NAMES).forEach(collectionName -> mongoTemplate.dropCollection(collectionName));
    }

    @And("a fhir client connected to the document service")
    public void aFhirClientConnectedToTheDocumentService() {
        serverBase = format("http://localhost:%s/STU3/", randomServerPort);

        hapiClient = ctx.newRestfulGenericClient(serverBase);


//        hapiClient.registerInterceptor(
//                new IClientInterceptor() {
//                    int i = 0;
//                    @Override
//                    public void interceptRequest(IHttpRequest iHttpRequest) {
//
//                    }
//
//                    @Override
//                    public void interceptResponse(IHttpResponse iHttpResponse) throws IOException {
//
//                        if(i > 0) {
//
//                            String result = IOUtils.toString(iHttpResponse.readEntity(), StandardCharsets.UTF_8);
//
//
//                            log.info("Response from fhir server via HAPI Client {}", result);
//                        }
//                        i++;
//                    }
//                }
//
//        );




        //ctx.setPerformanceOptions(PerformanceOptionsEnum.DEFERRED_MODEL_SCANNING);
    }

    protected Bundle loadBundle(String fileName) {
        String filename = getClass().getClassLoader().getResource(fileName).getPath();

        try {
            String bundleJson = new String(Files.readAllBytes(Paths.get(filename)));
            bundleJson = bundleJson.replaceAll("(?s)<!--.*?-->", "");

            return ctx.newXmlParser().parseResource(Bundle.class, bundleJson);
        } catch (IOException e) {
            log.error("Unable to loadBundle", e);
        }

        return null;
    }


    @Autowired
    private RestOperations restOperations;

    public ResponseEntity<byte[]> getBinary(String id) {
        serverBase = format("http://localhost:%s/STU3", randomServerPort);

        String url = serverBase + "/Binary/" + id;
        ResponseEntity<byte[]> response = null;
        try {
            //response = restOperations.getForEntity(url, byte[].class);
            restOperations.exchange(url, HttpMethod.GET, response, byte[].class);

        } catch (HttpClientErrorException e) {
            e.printStackTrace();
        }
        return response;

    }

}
