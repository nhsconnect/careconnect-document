package uk.nhs.careconnect.nosql.steps;

import ca.uhn.fhir.rest.api.MethodOutcome;
import com.mongodb.BasicDBObject;
import cucumber.api.java.en.And;
import cucumber.api.java.en.Given;
import cucumber.api.java.en.Then;
import cucumber.api.java.en.When;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.hl7.fhir.dstu3.model.Bundle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

import static java.util.Arrays.asList;
import static java.util.stream.Collectors.toList;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.is;
import static uk.nhs.careconnect.nosql.support.assertions.BundleAssertions.assertThatBsonBundlesAreEqual;
import static uk.nhs.careconnect.nosql.util.BundleUtils.bsonBundleToBundle;

public class BundleManagementSteps {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private CommonSteps commonSteps;

    private Bundle expectedCreatedBundle;

    private List<BasicDBObject> expectedBundlesInMongoAfterUpdate;
    private List<BasicDBObject> expectedBundlesInMongoAfterCreate;

    private List<BasicDBObject> bundlesInMongoBeforeUpdate;

    private BasicDBObject bsonBundleToUpdate;
    private String bundleToUpdateId;
    private Bundle updateBundle;

    private MethodOutcome methodOutcome;

    private List<BasicDBObject> bundlesInMongoAfterUpdate;
    private List<BasicDBObject> bundlesInMongoAfterCreate;

    @Given("a number of bundles in mongo")
    public void aNumberOfBundlesAreSavedInMongo() {
        commonSteps.hapiClient.create()
                .resource(commonSteps.loadBundle("9658218873.xml"))
                .execute();

        bundleToUpdateId = commonSteps.hapiClient.create()
                .resource(commonSteps.loadBundle("raw-bundle.xml"))
                .execute().getResource().getIdElement().getIdPart();

        captureMongoStateBeforeUpdate();

        selectBundleToUpdateFromBundlesInMongo();
        prepareAnUpdateBundle();

        specifyExpectedMongoStateAfterUpdate();
    }

    @When("I update a bundle")
    public void iUpdateABundle() {
        methodOutcome = commonSteps.hapiClient.update()
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
        Bundle expectedResponse = bsonBundleToBundle(commonSteps.ctx, expectedBundlesInMongoAfterUpdate.get(1));

        //assertThatBundleIsEqual((Bundle)methodOutcome.getResource(), expectedResponse);
    }

    @Given("a bundle ready to update")
    public void aBundleReadyToUpdate() {
        expectedCreatedBundle = commonSteps.loadBundle("9658218873.xml");

        specifyExpectedMongoStateAfterCreate();
    }

    @When("I create a bundle")
    public void iCreateABundle() {
        MethodOutcome response = commonSteps.hapiClient.create()
                .resource(expectedCreatedBundle)
                .execute();

        setExpectedBundleIdToEqualCreateBundleId(response);
    }

    private void setExpectedBundleIdToEqualCreateBundleId(MethodOutcome response) {
        Bundle responseBundle = (Bundle) response.getResource();

        expectedBundlesInMongoAfterCreate.stream()
                .forEach(bsonBundle -> bsonBundle.put("_id", new ObjectId(responseBundle.getId())));
    }

    @Then("a new bundle is created")
    public void aNewBundleIsCreated() {
        captureActualMongoStateAfterCreate();

        assertThatMongoStateIsAsExpected(bundlesInMongoAfterCreate, expectedBundlesInMongoAfterCreate);
    }

    @And("a response including the created bundle is returned to the client")
    public void aResponseIncludingTheCreatedBundleIsReturnedToTheClient() {
    }

    private void captureMongoStateBeforeUpdate() {
        bundlesInMongoBeforeUpdate = loadBundlesFromMongo();
    }

    private void selectBundleToUpdateFromBundlesInMongo() {
        bsonBundleToUpdate = (BasicDBObject) bundlesInMongoBeforeUpdate.get(1).copy();
    }

    private void prepareAnUpdateBundle() {
        bsonBundleToUpdate.put("identifier", new BasicDBObject("value", "This is a test"));
        updateBundle = bsonBundleToBundle(commonSteps.ctx, bsonBundleToUpdate);
    }

    private void specifyExpectedMongoStateAfterUpdate() {
        expectedBundlesInMongoAfterUpdate = new ArrayList<>(bundlesInMongoBeforeUpdate).stream()
                .map(replaceWithExpectedUpdateBundle())
                .collect(toList());
    }

    private void specifyExpectedMongoStateAfterCreate() {
        String resourceJson = filterOutComments(commonSteps.ctx.newJsonParser().encodeResourceToString(expectedCreatedBundle));
        Document doc = Document.parse(resourceJson);
        expectedBundlesInMongoAfterCreate = asList(new BasicDBObject(doc));
    }

    private Function<BasicDBObject, BasicDBObject> replaceWithExpectedUpdateBundle() {
        return bundle -> bundle.get("_id").equals(bsonBundleToUpdate.get("_id")) ? bsonBundleToUpdate : bundle;
    }

    private void captureActualMongoStateAfterUpdate() {
        bundlesInMongoAfterUpdate = loadBundlesFromMongo();
    }

    private void captureActualMongoStateAfterCreate() {
        bundlesInMongoAfterCreate = loadBundlesFromMongo();
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

    private String filterOutComments(String resourceJson) {
        return resourceJson.replaceAll("(?s)<!--.*?-->", "");
    }

}
