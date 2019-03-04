package uk.nhs.careconnect.nosql.steps;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.api.MethodOutcome;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.hl7.fhir.dstu3.model.Binary;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.DocumentReference;
import org.hl7.fhir.dstu3.model.IdType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import uk.nhs.careconnect.nosql.dao.IComposition;

import java.util.Optional;

import static uk.nhs.careconnect.nosql.support.assertions.BinaryAssertions.assertThatBinaryIsEqual;
import static uk.nhs.careconnect.nosql.support.assertions.BinaryAssertions.assertThatFhirResourceIsEqual;
import static uk.nhs.careconnect.nosql.util.BundleUtils.extractFirstResourceOfType;

public class BinaryManagementSteps {

    private static final Logger log = LoggerFactory.getLogger(BinaryManagementSteps.class);

    @Autowired
    IComposition compositionDao;

    @Autowired
    private CommonSteps commonSteps;

    Binary expectedBinaryResponse;

    MethodOutcome savedBinaryResponse;

    Binary actualBinaryResponse;

    @Given("a binary bundle saved in mongo")
    public void aBundleBinaryBundleSavedInMongo() {
        Bundle bundleToCreate = commonSteps.loadBundle("9658218873.xml");

        expectedBinaryResponse = extractFirstResourceOfType(Binary.class, bundleToCreate).get();

        savedBinaryResponse = commonSteps.hapiClient.create()
                .resource(bundleToCreate)
                .execute();
    }

    @When("I request a binary")
    public void iRequestABinary() {
        Optional<DocumentReference> optionalDocumentReference = extractFirstResourceOfType(DocumentReference.class, (Bundle) savedBinaryResponse.getResource());

        IdType binaryId = optionalDocumentReference
                .map(documentReference -> new IdType().setValue(documentReference.getContent().get(0).getAttachment().getUrl()))
                .orElse((IdType) savedBinaryResponse.getId());

        actualBinaryResponse = commonSteps.hapiClient.read()
                .resource(Binary.class)
                .withId(binaryId)
                .execute();
    }

    @Then("a binary is returned")
    public void aBinaryIsReturned() {
        assertThatBinaryIsEqual(actualBinaryResponse, expectedBinaryResponse);
    }

    @Then("a fhir document is returned")
    public void aFhirDocumentIsReturned() {
        assertThatFhirResourceIsEqual(actualBinaryResponse, expectedBinaryResponse);
    }

    @Given("a fhir document bundle saved in mongo")
    public void aFhirDocumentBundleSavedInMongo() {
        Bundle bundleToCreate = commonSteps.loadBundle("ITK3-10001.dat");

        savedBinaryResponse = commonSteps.hapiClient.create()
                .resource(bundleToCreate)
                .execute();

        Bundle bundle = compositionDao.readDocument(FhirContext.forDstu3(), (IdType) savedBinaryResponse.getId());

        String resource = commonSteps.ctx.newXmlParser().encodeResourceToString(bundle);

        log.debug("Resource returned from composition.readDocument as {}", resource);

        expectedBinaryResponse = new Binary();
        expectedBinaryResponse.setId(savedBinaryResponse.getId().getIdPart());
        expectedBinaryResponse.setContentType("application/fhir+xml");
        expectedBinaryResponse.setContent(resource.getBytes());
    }

}
