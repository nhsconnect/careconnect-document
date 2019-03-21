package uk.nhs.careconnect.nosql.steps;

import ca.uhn.fhir.context.FhirContext;
import cucumber.api.java.Before;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import uk.nhs.careconnect.configuration.TestConfig;

@ContextConfiguration(classes = {TestConfig.class})
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(value = "classpath:application.properties", properties = {"spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration, org.springframework.boot.autoconfigure.data.mongo.MongoDataAutoConfiguration"})
public class CucumberSpringContextConfiguration {

    @Autowired
    protected MongoTemplate mongoTemplate;

    @Autowired
    protected FhirContext ctx;

    @LocalServerPort
    public static String randomServerPort;

    @Before
    public void setup_cucumber_spring_context(){
        // Dummy method so cucumber will recognize this class as glue
        // and use its context configuration.
    }

}
