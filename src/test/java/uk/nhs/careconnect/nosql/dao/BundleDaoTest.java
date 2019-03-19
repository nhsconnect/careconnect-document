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
import org.hl7.fhir.dstu3.model.Resource;
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
import java.util.Optional;

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
    public void givenABundle_whenCreateIsCalled_aBundleCompositionPatientAndDocumentReferenceArePersistedInMongo() throws IOException {
        //setup
        Bundle bundle = aBundleWithDocumentReference();
        CompositionEntity expectedCompositionEntity = aCompositionEntity();
        DocumentReference expectedDocumentReferenceEntity = aDocumentReference();

        testCreateBundle(bundle, expectedCompositionEntity, expectedDocumentReferenceEntity, null);
    }

    @Test
    public void givenABundleWithBinaryContent_whenCreateIsCalled_aBundleCompositionPatientAndDocumentReferenceArePersistedInMongo() throws IOException {
        //setup
        Bundle bundle = aBundleWithBinary();
        CompositionEntity expectedCompositionEntity = aCompositionEntity();
        DocumentReference expectedDocumentReferenceEntity = aDocumentReference();

        testCreateBundle(bundle, expectedCompositionEntity, expectedDocumentReferenceEntity, null);
    }

    @Test
    public void givenABundleWithoutBinaryContentAndDocumentReference_whenCreateIsCalled_aBundleCompositionPatientAndDocumentReferenceArePersistedInMongo() throws IOException {
        //setup
        Bundle bundle = aBundle();
        CompositionEntity expectedCompositionEntity = aCompositionEntity();
        DocumentReference expectedDocumentReferenceEntity = CompositionTransformer.transformToDocumentReference(aComposition());
        expectedDocumentReferenceEntity.setCreated(Date.from(clock.instant()));

        testCreateBundle(bundle, expectedCompositionEntity, expectedDocumentReferenceEntity, null);
    }

    private void testCreateBundle(Bundle bundle, CompositionEntity expectedCompositionEntity, DocumentReference expectedDocumentReferenceEntity, Binary expectedBinary) throws IOException {
        //when
        Bundle responseBundle = bundleDao.create(bundle, null, null);

        Bundle createdBundle = extractFirstResourceOfType(Bundle.class, responseBundle).get();
        OperationOutcome operationOutcome = extractFirstResourceOfType(OperationOutcome.class, responseBundle).get();

        //then
        BundlePersistenceResult bundlePersistenceResult = new BundlePersistenceResult(createdBundle);

        Bundle retrievedBundle = bundlePersistenceResult.retrieveBundle();
        CompositionEntity retrievedCompositionEntity = bundlePersistenceResult.retrieveCompositionEntity();
        PatientEntity retrievedPatientEntity = bundlePersistenceResult.retrievePatientEntity();
        DocumentReferenceEntity retrievedDocumentReferenceEntity = bundlePersistenceResult.retrieveDocumentReferenceEntity();

        if (expectedBinary != null) {
            Binary savedBinary = bundlePersistenceResult.retrieveBinary();
            assertThatBinaryIsEqual(expectedBinary, savedBinary);
        }

        assertThatBundleIsEqual(bundle, retrievedBundle);
        assertThatCompositionIsEqual(expectedCompositionEntity, retrievedCompositionEntity);
        assertThatOperationOutcomeIsEqual(operationOutcome);
        assertPatientIdentifiersAreEqual(retrievedPatientEntity.getIdentifiers(), aPatientIdentifier());
        assertThatDocumentReferenceEntityIsEqual(retrievedPatientEntity, retrievedDocumentReferenceEntity, expectedDocumentReferenceEntity);

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
    public void givenABundle_whenUpdateIsCalled_aBundleCompositionPatientAndDocumentReferenceAreUpdatedInMongo() throws IOException {
        //setup
        Bundle savedBundle = givenASavedBundle();
        IdType savedBundleId = new IdType().setValue(savedBundle.getId());

        Bundle updateBundle = updateTheSavedBundle(savedBundle);

        CompositionEntity expectedCompositionEntity = aCompositionEntity();
        DocumentReference expectedDocumentReferenceEntity = anUpdatedDocumentReference();

        testUpdateBundle(updateBundle, savedBundleId, expectedCompositionEntity, expectedDocumentReferenceEntity, null);
    }

    private Bundle updateTheSavedBundle(Bundle savedBundle) {
        Bundle updateBundle = savedBundle;
        List<Bundle.BundleEntryComponent> entryList = updateBundle.getEntry().stream()
                .map(Bundle.BundleEntryComponent::getResource)
                .map(resource -> isDocumentReference(resource) ?
                        ((DocumentReference) resource).setSubject(anUpdatedDocumentReference().getSubject()) : resource)
                .map(resource -> new Bundle.BundleEntryComponent().setResource(resource))
                .collect(toList());

        updateBundle.setEntry(entryList);
        return updateBundle;
    }

    private boolean isDocumentReference(Resource resource) {
        return resourceOfType(DocumentReference.class).test(resource);
    }

    private void testUpdateBundle(Bundle bundle, IdType savedBundleId, CompositionEntity expectedCompositionEntity, DocumentReference expectedDocumentReferenceEntity, Binary expectedBinary) throws IOException {
        //when
        Bundle responseBundle = bundleDao.update(bundle, savedBundleId, null);

        Bundle updatedBundle = extractFirstResourceOfType(Bundle.class, responseBundle).get();
        OperationOutcome operationOutcome = extractFirstResourceOfType(OperationOutcome.class, responseBundle).get();

        //then
        BundlePersistenceResult bundlePersistenceResult = new BundlePersistenceResult(updatedBundle);

        Bundle retrievedBundle = bundlePersistenceResult.retrieveBundle();
        CompositionEntity retrievedCompositionEntity = bundlePersistenceResult.retrieveCompositionEntity();
        PatientEntity retrievedPatientEntity = bundlePersistenceResult.retrievePatientEntity();
        DocumentReferenceEntity retrievedDocumentReferenceEntity = bundlePersistenceResult.retrieveDocumentReferenceEntity();

        if (expectedBinary != null) {
            Binary savedBinary = bundlePersistenceResult.retrieveBinary();
            assertThatBinaryIsEqual(expectedBinary, savedBinary);
        }

        assertThatBundleIsEqual(bundle, retrievedBundle);
        assertThatCompositionIsEqual(expectedCompositionEntity, retrievedCompositionEntity);
        assertThatOperationOutcomeIsEqual(operationOutcome);
        assertPatientIdentifiersAreEqual(retrievedPatientEntity.getIdentifiers(), aPatientIdentifier());
        assertThatDocumentReferenceEntityIsEqual(retrievedPatientEntity, retrievedDocumentReferenceEntity, expectedDocumentReferenceEntity);

    }

    private Bundle givenASavedBundle() {
        Bundle bundle = aBundleWithDocumentReference();
        return extractFirstResourceOfType(Bundle.class, saveBundle(bundle)).get();
    }

    private void assertThatCompositionIsEqual(CompositionEntity expectedCompositionEntity, CompositionEntity savedCompositionEntity) {
        assertThatCompositionsAreEqual(savedCompositionEntity, expectedCompositionEntity);
        assertThat(savedCompositionEntity.getFhirDocument(), is(notNullValue()));
        assertThat(savedCompositionEntity.getFhirDocumentlId(), is(notNullValue()));
        assertThat(savedCompositionEntity.getDate(), is(notNullValue()));
    }

    private void assertThatOperationOutcomeIsEqual(OperationOutcome operationOutcome) {
        assertThat(operationOutcome.getId(), startsWith("Composition/"));
    }

    private void assertThatDocumentReferenceEntityIsEqual(PatientEntity savedPatient, DocumentReferenceEntity savedDocumentReferenceEntity, DocumentReference expectedDocumentReferenceEntity) {
        assertThat(savedDocumentReferenceEntity.getIdxPatient().getId().toString(), is(savedPatient.getId().toString()));

        DocumentReferenceAssertions.assertThatDocumentReferenceEntityIsEqual(savedDocumentReferenceEntity, expectedDocumentReferenceEntity);
    }

    private Bundle saveBundle(Bundle bundle) {
        return bundleDao.create(bundle, null, null);
    }

    private class BundlePersistenceResult {

        private final Bundle createdBundle;

        private BundlePersistenceResult(Bundle createdBundle) {
            this.createdBundle = createdBundle;
        }

        private Bundle retrieveBundle() {
            DBObject retrievedBsonBundle = loadBsonBundle(createdBundle);
            return bsonBundleToBundle(ctx, retrievedBsonBundle);
        }

        private CompositionEntity retrieveCompositionEntity() {
            DBObject retrievedBsonBundle = loadBsonBundle(createdBundle);
            return loadComposition(retrievedBsonBundle);
        }

        private PatientEntity retrievePatientEntity() {
            ObjectId patientId = retrieveCompositionEntity().getIdxPatient().getId();

            Query qry = Query.query(Criteria.where("_id").is(patientId.toHexString()));
            return mongoTemplate.findOne(qry, PatientEntity.class);
        }

        private DocumentReferenceEntity retrieveDocumentReferenceEntity() {
            Query qry = Query.query(Criteria.where("idxPatient").is(new DBRef("idxPatient", retrievePatientEntity().getId())));

            return mongoTemplate.findOne(qry, DocumentReferenceEntity.class);
        }

        private Binary retrieveBinary() throws IOException {
            return retrieveBinary(retrieveDocumentReferenceEntity());
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

        private Binary retrieveBinary(DocumentReferenceEntity savedDocumentReferenceEntity) throws IOException {

            Optional<String> optionalBinaryId = savedDocumentReferenceEntity.getFhirDocumentReference().getContent().stream()
                    .map(content -> content.getAttachment().getUrl().replaceAll("Binary/", ""))
                    .findFirst();

            GridFSDBFile gridFSDBFile = optionalBinaryId.map(binaryId -> {
                GridFS gridFS = new GridFS(mongoTemplate.getDb());
                return gridFS.find(new ObjectId(binaryId));
            }).orElse(null);

            return gridFSDBFile !=null ? new Binary()
                    .setContentType(gridFSDBFile.getContentType())
                    .setContent(IOUtils.toByteArray(gridFSDBFile.getInputStream())) : null;
        }
    }

}
