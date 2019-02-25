package uk.nhs.careconnect.nosql;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.api.MethodOutcome;
import ca.uhn.fhir.rest.client.api.IGenericClient;
import com.mongodb.BasicDBObject;
import cucumber.api.java.en.And;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.hl7.fhir.dstu3.model.Bundle;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.query.Query;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Stream;

import static java.lang.String.format;
import static java.util.stream.Collectors.toList;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static uk.nhs.careconnect.nosql.support.assertions.BundleAssertions.assertThatBsonBundlesAreEqual;
import static uk.nhs.careconnect.nosql.util.BundleUtils.bsonBundleToBundle;

public class DocumentServiceSteps extends DocumentServiceApplicationRunner {

    protected static final Logger log = LoggerFactory.getLogger(DocumentServiceSteps.class);

    protected static final String[] COLLECTION_NAMES = {"Bundle", "idxComposition", "idxPatient", "idxDocumentReference"};

    private String serverBase;

    private IGenericClient client;

    private List<BasicDBObject> bundlesInMongoBeforeUpdate;

    private BasicDBObject bsonBundleToUpdate;
    //private Bundle bundleToUpdate;
    private String bundleToUpdateId;
    private Bundle updateBundle;

    private List<BasicDBObject> expectedBundlesInMongoAfterUpdate;

    private MethodOutcome methodOutcome;

    private List<BasicDBObject> bundlesInMongoAfterUpdate;

    @Given("a clean mongo database")
    public void aCleanMongoDatabase() {
        Stream.of(COLLECTION_NAMES).forEach(collectionName -> mongoTemplate.dropCollection(collectionName));
    }

    @And("a fhir client connected to the document service")
    public void aFhirClientConnectedToTheDocumentService() {
        serverBase = format("http://localhost:%s/STU3/", randomServerPort);

        FhirContext ctx = FhirContext.forDstu3();
        client = ctx.newRestfulGenericClient(serverBase);
    }

    @Given("a number of bundles in mongo")
    public void aNumberOfBundlesAreSavedInMongo() {
        //createBundle("9658218873.xml");
        //createBundle("raw-bundle.xml");

        Bundle bundle1 = loadBundle("9658218873.xml");
        Bundle bundle2 = loadBundle("raw-bundle.xml");


        client.create()
                .resource(bundle1)
                //.withId(bundleToUpdateId)
                .execute();

        bundleToUpdateId = client.create()
                .resource(bundle2)
                //.withId(bundleToUpdateId)
                .execute().getResource().getIdElement().getIdPart();

        captureMongoStateBeforeUpdate();

        selectBundleToUpdateFromBundlesInMongo();
        prepareAnUpdateBundle();

        specifyExpectedMongoStateAfterUpdate();
    }

    @When("I update a bundle")
    public void iUpdateABundle() {
        methodOutcome = client.update()
                .resource(updateBundle)
                .withId(bundleToUpdateId)
                .execute();
    }

    @Then("only the corresponding bundle is updated")
    public void onlyTheCorrespondingBundleIsUpdated() {
        captureActualMongoStateAfterUpdate();

        assertThatNoAdditionalRecordsAreAdded();

        assertThatMongoStateIsAsExpected(bundlesInMongoAfterUpdate, expectedBundlesInMongoAfterUpdate);
    }

    @And("a response including the updated bundle is returned to the client")
    public void aResponseIncludingTheUpdatedBundleIsReturnedToTheClient() {
        Bundle expectedResponse = bsonBundleToBundle(ctx, expectedBundlesInMongoAfterUpdate.get(1));

        //assertThatBundleIsEqual((Bundle)methodOutcome.getResource(), expectedResponse);
    }

    protected void createBundle(String fileName) {
        Bundle bundle = loadBundle(fileName);

        bundleDao.create(ctx, bundle, null, null);
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

    private void captureMongoStateBeforeUpdate() {
        bundlesInMongoBeforeUpdate = loadBundlesFromMongo();
    }

    private void selectBundleToUpdateFromBundlesInMongo() {
        bsonBundleToUpdate = (BasicDBObject) bundlesInMongoBeforeUpdate.get(1).copy();

        //bundleToUpdateId = bsonBundleToUpdate.get("id").toString();
    }

    private void prepareAnUpdateBundle() {
        bsonBundleToUpdate.put("identifier", new BasicDBObject("value", "This is a test"));
        updateBundle = bsonBundleToBundle(ctx, bsonBundleToUpdate);
    }

    private void specifyExpectedMongoStateAfterUpdate() {
        expectedBundlesInMongoAfterUpdate = new ArrayList<>(bundlesInMongoBeforeUpdate).stream()
                .map(replaceWithExpectedUpdateBundle())
                .collect(toList());
    }

    private Function<BasicDBObject, BasicDBObject> replaceWithExpectedUpdateBundle() {
        return bundle -> bundle.get("_id").equals(bsonBundleToUpdate.get("_id")) ? bsonBundleToUpdate : bundle;
    }

    private void captureActualMongoStateAfterUpdate() {
        bundlesInMongoAfterUpdate = loadBundlesFromMongo();
    }

    private List<BasicDBObject> loadBundlesFromMongo() {
        Query qry = new Query();
        return mongoTemplate.find(qry, BasicDBObject.class, "Bundle");
    }

    private void assertThatNoAdditionalRecordsAreAdded() {
        assertThat(bundlesInMongoAfterUpdate.size(), is(expectedBundlesInMongoAfterUpdate.size()));
    }

    private void assertThatMongoStateIsAsExpected(List<BasicDBObject> bundlesInMongoAfterUpdate, List<BasicDBObject> expectedBundlesInMongoAfterUpdate) {
        assertThatBsonBundlesAreEqual(bundlesInMongoAfterUpdate, expectedBundlesInMongoAfterUpdate);
    }

}
