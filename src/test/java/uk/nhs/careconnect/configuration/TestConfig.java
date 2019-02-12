package uk.nhs.careconnect.configuration;

import ca.uhn.fhir.context.FhirContext;
import com.mongodb.MongoClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import uk.nhs.careconnect.nosql.dao.MongoManager;

import java.io.IOException;

@Configuration
@ComponentScan(basePackages = "uk.nhs.careconnect.nosql.dao")
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

    @Bean
    public MongoTemplate getMongoClient() throws IOException {
        String bindIp = "localhost";
        int port = 12345;
        return new MongoTemplate(new MongoClient(bindIp, port), DATABASE_NAME);
    }

    @Bean
    public MongoManager getMongoManager() throws IOException {
        return MongoManager.getInstance();
    }

}
