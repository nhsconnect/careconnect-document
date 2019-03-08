package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.rest.server.exceptions.ResourceVersionConflictException;
import com.mongodb.DBObject;
import com.mongodb.DBRef;
import com.mongodb.gridfs.GridFS;
import com.mongodb.gridfs.GridFSDBFile;
import org.apache.commons.io.IOUtils;
import org.bson.types.ObjectId;
import org.hl7.fhir.dstu3.model.Binary;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.DocumentReference;
import org.hl7.fhir.dstu3.model.IdType;
import org.hl7.fhir.dstu3.model.OperationOutcome;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import uk.nhs.careconnect.nosql.dao.transform.CompositionTransformer;
import uk.nhs.careconnect.nosql.entities.CompositionEntity;
import uk.nhs.careconnect.nosql.entities.DocumentReferenceEntity;
import uk.nhs.careconnect.nosql.entities.PatientEntity;
import uk.nhs.careconnect.nosql.support.assertions.DocumentReferenceAssertions;

import java.io.IOException;
import java.time.Clock;
import java.util.Date;
import java.util.List;

import static java.util.stream.Collectors.toList;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.hamcrest.MatcherAssert.assertThat;
import static uk.nhs.careconnect.nosql.providers.support.assertions.ResourceAssertions.assertPatientIdentifiersAreEqual;
import static uk.nhs.careconnect.nosql.support.assertions.BinaryAssertions.assertThatBinaryIsEqual;
import static uk.nhs.careconnect.nosql.support.assertions.BundleAssertions.assertThatBundleIsEqual;
import static uk.nhs.careconnect.nosql.support.assertions.CompositionAssertions.assertThatCompositionsAreEqual;
import static uk.nhs.careconnect.nosql.support.testdata.BundleTestData.aBinary;
import static uk.nhs.careconnect.nosql.support.testdata.BundleTestData.aBundle;
import static uk.nhs.careconnect.nosql.support.testdata.BundleTestData.aBundleWithBinary;
import static uk.nhs.careconnect.nosql.support.testdata.BundleTestData.aBundleWithDocumentReference;
import static uk.nhs.careconnect.nosql.support.testdata.BundleTestData.aPatientIdentifier;
import static uk.nhs.careconnect.nosql.support.testdata.CompositionTestData.aComposition;
import static uk.nhs.careconnect.nosql.support.testdata.CompositionTestData.aCompositionEntity;
import static uk.nhs.careconnect.nosql.support.testdata.DocumentReferenceTestData.aDocumentReference;
import static uk.nhs.careconnect.nosql.support.testdata.DocumentReferenceTestData.anUpdatedDocumentReference;
import static uk.nhs.careconnect.nosql.util.BundleUtils.bsonBundleToBundle;
import static uk.nhs.careconnect.nosql.util.BundleUtils.extractFirstResourceOfType;
import static uk.nhs.careconnect.nosql.util.BundleUtils.resourceOfType;

public class BundleDaoTest extends AbstractDaoTest {

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Autowired
    IBundle bundleDao;

    @Autowired
    Clock clock;

    @Test
    public void givenABundle_whenCreateIsCalled_aBundleCompositionPatientAndDocumentReferenceArePersistedInMongo() {
        //setup
        Bundle bundle = aBundleWithDocumentReference();
        CompositionEntity expectedCompositionEntity = aCompositionEntity();
        DocumentReference expectedDocumentReferenceEntity = aDocumentReference();

        //when
        Bundle responseBundle = bundleDao.create(bundle, null, null);
        Bundle createdBundle = extractFirstResourceOfType(Bundle.class, responseBundle).get();

        OperationOutcome operationOutcome = extractFirstResourceOfType(OperationOutcome.class, responseBundle).get();

        //then
        DBObject retrievedBsonBundle = loadBsonBundle(createdBundle);
        Bundle retrievedBundle = bsonBundleToBundle(ctx, retrievedBsonBundle);

        CompositionEntity savedCompositionEntity = loadComposition(retrievedBsonBundle);

        PatientEntity savedPatient = loadPatient(savedCompositionEntity);

        DocumentReferenceEntity savedDocumentReferenceEntity = loadDocumentReference(savedPatient.getId());

        assertThatBundleIsEqual(bundle, retrievedBundle);
        assertThatCompositionIsEqual(expectedCompositionEntity, operationOutcome, savedCompositionEntity);
        assertPatientIdentifiersAreEqual(savedPatient.getIdentifiers(), aPatientIdentifier());
        assertThatDocumentReferenceEntityIsEqual(savedPatient, savedDocumentReferenceEntity, expectedDocumentReferenceEntity);
    }

    @Test
    public void givenABundleIsAlreadySaved_whenCreateIsCalled_anExceptionIsThrown() {
        expectedException.expect(ResourceVersionConflictException.class);
        expectedException.expectMessage("FHIR Document already exists.");

        //setup
        Bundle bundle = aBundleWithDocumentReference();

        //when
        bundleDao.create(bundle, null, null);
        bundleDao.create(bundle, null, null);
    }

    @Test
    public void givenABundleWithBinaryContent_whenCreateIsCalled_aBundleCompositionPatientAndDocumentReferenceArePersistedInMongo() throws IOException {
        //setup
        Bundle bundle = aBundleWithBinary();
        CompositionEntity expectedCompositionEntity = aCompositionEntity();
        DocumentReference expectedDocumentReferenceEntity = aDocumentReference();
        Binary expectedBinary = aBinary();

        //when
        Bundle responseBundle = bundleDao.create(bundle, null, null);
        Bundle createdBundle = extractFirstResourceOfType(Bundle.class, responseBundle).get();

        OperationOutcome operationOutcome = extractFirstResourceOfType(OperationOutcome.class, responseBundle).get();

        //then
        DBObject retrievedBsonBundle = loadBsonBundle(createdBundle);
        Bundle retrievedBundle = bsonBundleToBundle(ctx, retrievedBsonBundle);

        CompositionEntity savedCompositionEntity = loadComposition(retrievedBsonBundle);

        PatientEntity savedPatient = loadPatient(savedCompositionEntity);

        DocumentReferenceEntity savedDocumentReferenceEntity = loadDocumentReference(savedPatient.getId());

        Binary savedBinary = loadBinary(savedDocumentReferenceEntity);

        assertThatBundleIsEqual(bundle, retrievedBundle);
        assertThatCompositionIsEqual(expectedCompositionEntity, operationOutcome, savedCompositionEntity);
        assertPatientIdentifiersAreEqual(savedPatient.getIdentifiers(), aPatientIdentifier());
        assertThatDocumentReferenceEntityIsEqual(savedPatient, savedDocumentReferenceEntity, expectedDocumentReferenceEntity);
        assertThatBinaryIsEqual(expectedBinary, savedBinary);
    }

    @Test
    public void givenABundleWithoutBinaryContentAndDocumentReference_whenCreateIsCalled_aBundleCompositionPatientAndDocumentReferenceArePersistedInMongo() throws IOException {
        //setup
        Bundle bundle = aBundle();
        CompositionEntity expectedCompositionEntity = aCompositionEntity();
        DocumentReference expectedDocumentReferenceEntity = CompositionTransformer.transformToDocumentReference(aComposition());
        expectedDocumentReferenceEntity.setCreated(Date.from(clock.instant()));

        //when
        Bundle responseBundle = bundleDao.create(bundle, null, null);
        Bundle createdBundle = extractFirstResourceOfType(Bundle.class, responseBundle).get();

        OperationOutcome operationOutcome = extractFirstResourceOfType(OperationOutcome.class, responseBundle).get();

        //then
        DBObject retrievedBsonBundle = loadBsonBundle(createdBundle);
        Bundle retrievedBundle = bsonBundleToBundle(ctx, retrievedBsonBundle);

        CompositionEntity savedCompositionEntity = loadComposition(retrievedBsonBundle);

        PatientEntity savedPatient = loadPatient(savedCompositionEntity);

        DocumentReferenceEntity savedDocumentReferenceEntity = loadDocumentReference(savedPatient.getId());

        assertThatBundleIsEqual(bundle, retrievedBundle);
        assertThatCompositionIsEqual(expectedCompositionEntity, operationOutcome, savedCompositionEntity);
        assertPatientIdentifiersAreEqual(savedPatient.getIdentifiers(), aPatientIdentifier());
        assertThatDocumentReferenceEntityIsEqual(savedPatient, savedDocumentReferenceEntity, expectedDocumentReferenceEntity);
    }

    @Test
    public void givenABundle_whenUpdateIsCalled_aBundleCompositionPatientAndDocumentReferenceAreUpdatedInMongo() {
        //setup
        Bundle savedBundleResponse = givenASavedBundle();
        Bundle savedBundle = extractFirstResourceOfType(Bundle.class, savedBundleResponse).get();
        IdType savedBundleId = new IdType().setValue(savedBundle.getId());

        Bundle updateBundle = savedBundle;
        List<Bundle.BundleEntryComponent> entryList = updateBundle.getEntry().stream()
                .map(Bundle.BundleEntryComponent::getResource)
                .map(resource -> resourceOfType(DocumentReference.class).test(resource) ?
                        ((DocumentReference) resource).setSubject(anUpdatedDocumentReference().getSubject()) : resource)
                .map(resource -> new Bundle.BundleEntryComponent().setResource(resource))
                .collect(toList());

        updateBundle.setEntry(entryList);

        CompositionEntity expectedCompositionEntity = aCompositionEntity();
        DocumentReference expectedDocumentReferenceEntity = anUpdatedDocumentReference();

        //when

        Bundle responseBundle = bundleDao.update(updateBundle, savedBundleId, null);


        Bundle updatedBundle = extractFirstResourceOfType(Bundle.class, responseBundle).get();

        OperationOutcome operationOutcome = extractFirstResourceOfType(OperationOutcome.class, responseBundle).get();

        //then
        DBObject retrievedBsonBundle = loadBsonBundle(updatedBundle);
        Bundle retrievedBundle = bsonBundleToBundle(ctx, retrievedBsonBundle);

        CompositionEntity savedCompositionEntity = loadComposition(retrievedBsonBundle);

        PatientEntity savedPatient = loadPatient(savedCompositionEntity);

        DocumentReferenceEntity savedDocumentReferenceEntity = loadDocumentReference(savedPatient.getId());

        assertThatBundleIsEqual(updateBundle, retrievedBundle);
        assertThatCompositionIsEqual(expectedCompositionEntity, operationOutcome, savedCompositionEntity);
        assertPatientIdentifiersAreEqual(savedPatient.getIdentifiers(), aPatientIdentifier());
        assertThatDocumentReferenceEntityIsEqual(savedPatient, savedDocumentReferenceEntity, expectedDocumentReferenceEntity);
    }

    private Bundle givenASavedBundle() {
        Bundle bundle = aBundleWithDocumentReference();
        return saveBundle(bundle);
    }

    private void assertThatCompositionIsEqual(CompositionEntity expectedCompositionEntity, OperationOutcome operationOutcome, CompositionEntity savedCompositionEntity) {
        assertThatCompositionsAreEqual(savedCompositionEntity, expectedCompositionEntity);
        assertThat(savedCompositionEntity.getFhirDocument(), is(notNullValue()));
        assertThat(savedCompositionEntity.getFhirDocumentlId(), is(notNullValue()));
        assertThat(savedCompositionEntity.getDate(), is(notNullValue()));
        assertThat(operationOutcome.getId(), startsWith("Composition/"));
    }

    private void assertThatDocumentReferenceEntityIsEqual(PatientEntity savedPatient, DocumentReferenceEntity savedDocumentReferenceEntity, DocumentReference expectedDocumentReferenceEntity) {
        assertThat(savedDocumentReferenceEntity.getIdxPatient().getId().toString(), is(savedPatient.getId().toString()));

        DocumentReferenceAssertions.assertThatDocumentReferenceEntityIsEqual(savedDocumentReferenceEntity, expectedDocumentReferenceEntity);
    }

    private DBObject loadBsonBundle(Bundle bundle) {
        Query qry = Query.query(Criteria.where("_id").is(bundle.getId()));
        return mongoTemplate.findOne(qry, DBObject.class, "Bundle");
    }

    private CompositionEntity loadComposition(DBObject savedBsonBundle) {
        ObjectId bundleId = (ObjectId) savedBsonBundle.get("_id");

        Query qry = Query.query(Criteria.where("fhirDocumentlId").is(bundleId.toHexString()));
        return mongoTemplate.findOne(qry, CompositionEntity.class);
    }

    private PatientEntity loadPatient(CompositionEntity savedCompositionEntity) {
        ObjectId patientId = savedCompositionEntity.getIdxPatient().getId();

        Query qry = Query.query(Criteria.where("_id").is(patientId.toHexString()));
        return mongoTemplate.findOne(qry, PatientEntity.class);
    }

    private DocumentReferenceEntity loadDocumentReference(ObjectId patientId) {
        Query qry = Query.query(Criteria.where("idxPatient").is(new DBRef("idxPatient", patientId)));

        return mongoTemplate.findOne(qry, DocumentReferenceEntity.class);
    }

    private Binary loadBinary(DocumentReferenceEntity savedDocumentReferenceEntity) throws IOException {

        String binaryId = savedDocumentReferenceEntity.getFhirDocumentReference().getContent().stream()
                .map(content -> content.getAttachment().getUrl().replaceAll("Binary/", ""))
                .findFirst().get();

        GridFS gridFS = new GridFS(mongoTemplate.getDb());
        GridFSDBFile gridFSDBFile = gridFS.find(new ObjectId(binaryId));

        return new Binary()
                .setContentType(gridFSDBFile.getContentType())
                .setContent(IOUtils.toByteArray(gridFSDBFile.getInputStream()));
    }

    private Bundle saveBundle(Bundle bundle) {
        return bundleDao.create(bundle, null, null);
    }

}
