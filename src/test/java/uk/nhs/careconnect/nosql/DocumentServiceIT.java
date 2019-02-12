package uk.nhs.careconnect.nosql;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.DocumentReference;
import org.hl7.fhir.dstu3.model.OperationOutcome;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import uk.nhs.careconnect.nosql.dao.IBundle;
import uk.nhs.careconnect.nosql.dao.MongoManager;
import uk.nhs.careconnect.configuration.TestITConfig;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.stream.Stream;

import static java.lang.String.format;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = {TestITConfig.class})
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class DocumentServiceIT {

    protected static final String[] COLLECTION_NAMES = {"Bundle", "idxComposition", "idxPatient", "idxDocumentReference"};

    @Autowired
    MongoManager mongoManager;

    @Autowired
    protected MongoTemplate mongoTemplate;

    @Autowired
    protected FhirContext ctx;

    @Autowired
    IBundle bundleDao;

    @LocalServerPort
    protected String randomServerPort;

    private String serverBase;

    @Before
    public void eachTest() {
        Stream.of(COLLECTION_NAMES).forEach(collectionName -> mongoTemplate.dropCollection(collectionName));
        serverBase = format("http://localhost:%s/STU3/", randomServerPort);
    }

    protected void createBundle(String fileName) {
        Bundle bundle = loadBundle(fileName);
        OperationOutcome operationOutcome = bundleDao.create(ctx, bundle, null, null);
        assertThat(operationOutcome.getId(), is(notNullValue()));
    }

    protected Bundle loadBundle(String fileName) {
        String filename = getClass().getClassLoader().getResource(fileName).getPath();

        try {
            String bundleJson = new String(Files.readAllBytes(Paths.get(filename)));
            return ctx.newXmlParser().parseResource(Bundle.class, bundleJson);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    @Test
    public void makeFhirRequestTODocumentReferenceProvider() {
        createBundle("9658218873.xml");

        FhirContext ctx = FhirContext.forDstu3();
        IGenericClient client = ctx.newRestfulGenericClient(serverBase);

        LocalDate startDateInclusive = LocalDate.parse("2018-11-29");

        Bundle bundle = client.search()
                .forResource(DocumentReference.class)
                .where(DocumentReference.PERIOD.after().day(localDateToDate(startDateInclusive)))
                .and(DocumentReference.SETTING.exactly().systemAndCode("http://snomed.info/sct", "103735009"))
                .returnBundle(Bundle.class)
                .execute();
    }

    private Date localDateToDate(LocalDate localDate) {
        return Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
    }

}
