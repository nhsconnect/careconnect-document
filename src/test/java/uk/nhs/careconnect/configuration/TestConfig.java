package uk.nhs.careconnect.configuration;

import ca.uhn.fhir.context.FhirContext;
import com.mongodb.MongoClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.DependsOn;
import org.springframework.data.mongodb.core.MongoTemplate;
import uk.nhs.careconnect.nosql.dao.MongoManager;

import static uk.nhs.careconnect.nosql.dao.MongoManager.TEST_MONGO_HOST;
import static uk.nhs.careconnect.nosql.dao.MongoManager.TEST_MONGO_PORT;

@TestConfiguration()
public class TestConfig {

    @Value("${ccri.software.version}")
    String softwareVersion;

    @Value("${ccri.software.name}")
    String softwareName;

    @Value("${ccri.server}")
    String server;

    @Value("${ccri.guide}")
    String guide;

    @Value("${ccri.server.base}")
    String serverBase;

    private static final String DATABASE_NAME = "test-mongo-db";

    @Bean
    public FhirContext getFhirContext() {
        System.setProperty("ccri.server.base", this.serverBase);
        System.setProperty("ccri.software.name", this.softwareName);
        System.setProperty("ccri.software.version", this.softwareVersion);
        System.setProperty("ccri.guide", this.guide);
        System.setProperty("ccri.server", this.server);
        return FhirContext.forDstu3();
    }

    @Bean(name = "mongoManager")
    public MongoManager getMongoManager() {
        return MongoManager.getInstance();
    }

    @Bean
    @DependsOn({"mongoManager"})
    public MongoTemplate getMongoClient() {
        return new MongoTemplate(new MongoClient(TEST_MONGO_HOST, TEST_MONGO_PORT), DATABASE_NAME);
    }

}
