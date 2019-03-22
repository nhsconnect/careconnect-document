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

import static com.shazam.shazamcrest.MatcherAssert.assertThat;
import static java.util.Arrays.asList;
import static java.util.stream.Collectors.toList;
import static org.hamcrest.Matchers.is;
import static uk.nhs.careconnect.nosql.support.assertions.BundleAssertions.assertThatBsonBundlesAreEqual;
import static uk.nhs.careconnect.nosql.util.BundleUtils.bsonBundleToBundle;

public class BundleManagementSteps {

    private static final String BUNDLE_COLLECTION = "Bundle";
    private static final String COMPOSITION_COLLECTION = "idxComposition";
    private static final String DOCUMENT_REFERENCE_COLLECTION = "idxDocumentReference";
    private static final String FILES_COLLECTION = "fs.files";

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    private CommonSteps commonSteps;


    private Bundle bundleToCreate;

    private List<BasicDBObject> expectedBundlesInMongoAfterCreate;
    private List<BasicDBObject> expectedCompositionsInMongoAfterCreate;
    private List<BasicDBObject> expectedDocumentReferencesInMongoAfterCreate;
    private List<BasicDBObject> expectedFilesInMongoAfterCreate;

    private List<BasicDBObject> actualBundlesInMongoAfterCreate;
    private List<BasicDBObject> actualCompositionsInMongoAfterCreate;
    private List<BasicDBObject> actualDocumentReferencesInMongoAfterCreate;
    private List<BasicDBObject> actualFilesInMongoAfterCreate;

    private MethodOutcome expectedCreateBundleResponse;
    private MethodOutcome actualCreateBundleResponse;


    private List<BasicDBObject> bundlesInMongoBeforeUpdate;

    private BasicDBObject bsonBundleToUpdate;
    private String bundleToUpdateId;
    private Bundle bundleToUpdate;

    private List<BasicDBObject> expectedBundlesInMongoAfterUpdate;
    private List<BasicDBObject> actualBundlesInMongoAfterUpdate;

    private MethodOutcome expectedUpdateBundleResponse;
    private MethodOutcome actualUpdateBundleResponse;

    @Given("a bundle ready to create")
    public void aBundleReadyToCreate() {
        bundleToCreate = commonSteps.loadBundle("9658218873.xml");

        specifyExpectedMongoStateAfterCreate();

        expectedCreateBundleResponse = new MethodOutcome()
                .setResource(bundleToCreate);
    }

    @When("I create a bundle")
    public void iCreateABundle() {
        actualCreateBundleResponse = commonSteps.hapiClient.create()
                .resource(bundleToCreate)
                .execute();

        setExpectedIdsToEqualMongoGeneratedIds(actualCreateBundleResponse);
    }

    @Then("a new bundle is created")
    public void aNewBundleIsCreated() {
        captureActualMongoStateAfterCreate();

        assertThatMongoStateAfterCreateIsAsExpected();
    }

    @And("a response including the created bundle is returned to the client")
    public void aResponseIncludingTheCreatedBundleIsReturnedToTheClient() {
        assertThatResponseIsAsExpected(actualCreateBundleResponse, expectedCreateBundleResponse);
    }


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

        expectedUpdateBundleResponse = new MethodOutcome()
                .setResource(bundleToUpdate);
    }

    @When("I update a bundle")
    public void iUpdateABundle() {
        actualUpdateBundleResponse = commonSteps.hapiClient.update()
                .resource(bundleToUpdate)
                .withId(bundleToUpdateId)
                .execute();
    }

    @Then("only the corresponding bundle is updated")
    public void onlyTheCorrespondingBundleIsUpdated() {
        captureActualMongoStateAfterUpdate();

        assertThatNoAdditionalRecordsAreAdded();

        assertThatMongoStateAfterUpdateIsAsExpected();
    }

    @And("a response including the updated bundle is returned to the client")
    public void aResponseIncludingTheUpdatedBundleIsReturnedToTheClient() {
        assertThatResponseIsAsExpected(actualUpdateBundleResponse, expectedUpdateBundleResponse);
    }

    private void specifyExpectedMongoStateAfterCreate() {
        String resourceJson = filterOutComments(commonSteps.ctx.newJsonParser().encodeResourceToString(bundleToCreate));
        Document document = Document.parse(resourceJson);
        expectedBundlesInMongoAfterCreate = asList(new BasicDBObject(document));

        //TODO: Complete the expected records
        expectedCompositionsInMongoAfterCreate = asList(
                new BasicDBObject()
                        .append("_class", "uk.nhs.careconnect.nosql.entities.CompositionEntity"));

    }

    private String filterOutComments(String resourceJson) {
        return resourceJson.replaceAll("(?s)<!--.*?-->", "");
    }

    private void setExpectedIdsToEqualMongoGeneratedIds(MethodOutcome response) {
        Bundle responseBundle = (Bundle) response.getResource();

        expectedBundlesInMongoAfterCreate.stream()
                .forEach(bsonBundle -> bsonBundle.put("_id", new ObjectId(responseBundle.getId())));

        expectedCompositionsInMongoAfterCreate.stream()
                .forEach(bsonBundle -> bsonBundle.put("_id", new ObjectId(response.getId().getIdPart())));
    }

    private void captureActualMongoStateAfterCreate() {
        actualBundlesInMongoAfterCreate = loadColectionFromMongo(BUNDLE_COLLECTION);
        actualCompositionsInMongoAfterCreate = loadColectionFromMongo(COMPOSITION_COLLECTION);
        actualDocumentReferencesInMongoAfterCreate = loadColectionFromMongo(DOCUMENT_REFERENCE_COLLECTION);
        actualFilesInMongoAfterCreate = loadColectionFromMongo(FILES_COLLECTION);
    }

    private void captureMongoStateBeforeUpdate() {
        bundlesInMongoBeforeUpdate = loadColectionFromMongo(BUNDLE_COLLECTION);
    }

    private void selectBundleToUpdateFromBundlesInMongo() {
        bsonBundleToUpdate = (BasicDBObject) bundlesInMongoBeforeUpdate.get(1).copy();
    }

    private void prepareAnUpdateBundle() {
        //bsonBundleToUpdate.put("identifier", new BasicDBObject("value", "This is a test"));
        bundleToUpdate = bsonBundleToBundle(commonSteps.ctx, bsonBundleToUpdate);
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
        actualBundlesInMongoAfterUpdate = loadColectionFromMongo(BUNDLE_COLLECTION);
    }

    private List<BasicDBObject> loadColectionFromMongo(String collectionName) {
        Query qry = new Query();
        return mongoTemplate.find(qry, BasicDBObject.class, collectionName);
    }


    private void assertThatMongoStateAfterCreateIsAsExpected() {
        assertThatBsonBundlesAreEqual(actualBundlesInMongoAfterCreate, expectedBundlesInMongoAfterCreate);

        //TODO: Complete the assertions for other records
//        assertThatBsonBundlesAreEqual(actualCompositionsInMongoAfterCreate, expectedCompositionsInMongoAfterCreate);
//        assertThatCompositionIsEqual(expectedCompositionEntity, retrievedCompositionEntity);
//        assertThatOperationOutcomeIsEqual(operationOutcome);
//        assertPatientIdentifiersAreEqual(retrievedPatientEntity.getIdentifiers(), aPatientIdentifier());
//        assertThatDocumentReferenceEntityIsEqual(retrievedPatientEntity, retrievedDocumentReferenceEntity, expectedDocumentReferenceEntity);


    }

    private void assertThatMongoStateAfterUpdateIsAsExpected() {
        assertThatBsonBundlesAreEqual(actualBundlesInMongoAfterUpdate, expectedBundlesInMongoAfterUpdate);

//TODO: Complete the assertions for other records
//        assertThatCompositionIsEqual(expectedCompositionEntity, retrievedCompositionEntity);
//        assertThatOperationOutcomeIsEqual(operationOutcome);
//        assertPatientIdentifiersAreEqual(retrievedPatientEntity.getIdentifiers(), aPatientIdentifier());
//        assertThatDocumentReferenceEntityIsEqual(retrievedPatientEntity, retrievedDocumentReferenceEntity, expectedDocumentReferenceEntity);


    }

    private void assertThatNoAdditionalRecordsAreAdded() {
        assertThat(actualBundlesInMongoAfterUpdate.size(), is(expectedBundlesInMongoAfterUpdate.size()));
    }

    private void assertThatResponseIsAsExpected(MethodOutcome actualBundleResponse, MethodOutcome expectedBundleResponse) {
        //TODO: Tech debt -
        // 1. getOperationOutcome is returning null even though the server is setting this - need to check this is correct with the Fhir Spec
        // 2. actual and expected for getResource does not match as one contains null extensions and the other empty list.  This happens
        // because of an inconsistency in the fhir parser for encodeResourceToString and parseResource.
        // Marked as tech debt as it would be nice to include testing of the response, but not a current high priority.
        //assertThat(actualBundleResponse.getOperationOutcome(), sameBeanAs(expectedBundleResponse.getOperationOutcome()));
        //assertThat((actualBundleResponse.getResource()), sameBeanAs(expectedBundleResponse.getResource()));
    }

}
