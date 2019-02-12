package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.OperationOutcome;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import uk.nhs.careconnect.configuration.TestConfig;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.stream.Stream;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = {TestConfig.class})
@SpringBootTest
public abstract class AbstractDaoTest {

    protected static final String[] COLLECTION_NAMES = {"Bundle", "idxComposition", "idxPatient", "idxDocumentReference"};

    @Autowired
    MongoManager mongoManager;

    @Autowired
    protected MongoTemplate mongoTemplate;

    @Autowired
    protected FhirContext ctx;

    @Autowired
    IBundle bundleDao;

    @Before
    public void clearMongoCollections() {
        Stream.of(COLLECTION_NAMES).forEach(collectionName -> mongoTemplate.dropCollection(collectionName));
    }

    protected void createBundle(String fileName) {
        Bundle bundle = loadBundle(fileName);
        OperationOutcome operationOutcome = bundleDao.create(ctx, bundle, null, null);
        assertThat(operationOutcome.getId(), is(notNullValue()));
    }

    protected Bundle loadBundle() {
        return loadBundle("raw-bundle.xml");
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

}
