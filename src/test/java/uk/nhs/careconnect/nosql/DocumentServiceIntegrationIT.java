package uk.nhs.careconnect.nosql;

import cucumber.api.CucumberOptions;
import cucumber.api.junit.Cucumber;
import org.junit.runner.RunWith;

@RunWith(Cucumber.class)
@CucumberOptions(features = "src/test/resources/features/document-service.feature", plugin = {"pretty", "html:target/cucumber"})
public class DocumentServiceIntegrationIT {
}
