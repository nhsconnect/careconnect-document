package uk.nhs.careconnect.nosql;

import ca.uhn.fhir.context.FhirContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import uk.nhs.careconnect.configuration.TestConfig;
import uk.nhs.careconnect.nosql.dao.IBundle;

@ContextConfiguration(classes = {TestConfig.class})
@TestPropertySource(properties = {"spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration, org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration"})
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class DocumentServiceApplicationRunner {

    @Autowired
    protected MongoTemplate mongoTemplate;

    @Autowired
    protected FhirContext ctx;

    @Autowired
    IBundle bundleDao;

    @LocalServerPort
    protected String randomServerPort;

}
