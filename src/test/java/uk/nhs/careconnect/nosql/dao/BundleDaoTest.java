package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.rest.server.exceptions.ResourceVersionConflictException;
import com.mongodb.DBObject;
import com.mongodb.DBRef;
import org.bson.types.ObjectId;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.DocumentReference;
import org.hl7.fhir.dstu3.model.OperationOutcome;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.ExpectedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import uk.nhs.careconnect.nosql.entities.CompositionEntity;
import uk.nhs.careconnect.nosql.entities.DocumentReferenceEntity;
import uk.nhs.careconnect.nosql.entities.PatientEntity;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.CoreMatchers.startsWith;
import static org.hamcrest.MatcherAssert.assertThat;
import static uk.nhs.careconnect.nosql.providers.support.assertions.ResourceAssertions.assertPatientIdentifiersAreEqual;
import static uk.nhs.careconnect.nosql.support.assertions.CompositionAssertions.assertThatCompositionsAreEqual;
import static uk.nhs.careconnect.nosql.support.assertions.DocumentReferenceAssertions.assertThatDocumentReferenceIsEqual;
import static uk.nhs.careconnect.nosql.support.testdata.BundleTestData.aBundle;
import static uk.nhs.careconnect.nosql.support.testdata.BundleTestData.aPatientIdentifier;
import static uk.nhs.careconnect.nosql.support.testdata.CompositionTestData.aCompositionEntity;
import static uk.nhs.careconnect.nosql.support.testdata.DocumentReferenceTestData.aDocumentReference;

public class BundleDaoTest extends AbstractDaoTest {

    @Rule
    public ExpectedException expectedException = ExpectedException.none();

    @Autowired
    IBundle bundleDao;

    @Test
    public void givenABundle_whenCreateIsCalled_aBundleCompositionAndPatientArePersistedInMongo() {
        //setup
        Bundle bundle = aBundle();
        CompositionEntity expectedCompositionEntity = aCompositionEntity();
        DocumentReference expectedDocumentReferenceEntity = aDocumentReference();

        //when
        OperationOutcome operationOutcome = bundleDao.create(ctx, bundle, null, null);

        //then

        //Bundle
        DBObject savedBsonBundle = loadBsonBundle(bundle);
        ObjectId bundleId = (ObjectId) savedBsonBundle.get("_id");
        Bundle savedBundle = bsonBundleToBundle(savedBsonBundle);

        assertThat(savedBundle.getId(), is(bundle.getId()));
        assertThat(savedBundle.getIdentifier().getValue(), is(bundle.getIdentifier().getValue()));
        assertThat(savedBundle.getIdentifier().getSystem(), is(bundle.getIdentifier().getSystem()));

        //Composition
        CompositionEntity savedCompositionEntity = loadComposition(bundleId);

        assertThatCompositionsAreEqual(savedCompositionEntity, expectedCompositionEntity);
        assertThat(savedCompositionEntity.getFhirDocument(), is(notNullValue()));
        assertThat(savedCompositionEntity.getFhirDocumentlId(), is(notNullValue()));
        assertThat(savedCompositionEntity.getDate(), is(notNullValue())); //TODO: difficult to test date is correct, so just checking it was set
        assertThat(operationOutcome.getId(), startsWith("Composition/"));

        //Patient
        ObjectId patientId = savedCompositionEntity.getIdxPatient().getId();
        PatientEntity savedPatient = loadPatient(patientId);

        assertPatientIdentifiersAreEqual(savedPatient.getIdentifiers(), aPatientIdentifier());

        // Document Reference
        DocumentReferenceEntity savedDocumentReferenceEntity = loadDocumentReference(savedPatient.getId());

        assertThat(savedDocumentReferenceEntity.getIdxPatient().getId().toString(), is(savedPatient.getId().toString()));

        assertThatDocumentReferenceIsEqual(savedDocumentReferenceEntity, expectedDocumentReferenceEntity);
    }

    @Test
    public void givenABundleIsAlreadySaved_whenCreateIsCalled_anExceptionIsThrown() {
        expectedException.expect(ResourceVersionConflictException.class);
        expectedException.expectMessage("FHIR Document already exists.");

        //setup
        Bundle bundle = aBundle();

        //when
        bundleDao.create(ctx, bundle, null, null);
        bundleDao.create(ctx, bundle, null, null);
    }

    private Bundle bsonBundleToBundle(DBObject bsonBundle) {
        return (Bundle) ctx.newJsonParser().parseResource(bsonBundle.toString());
    }

    private DBObject loadBsonBundle(Bundle bundle) {
        Query qry = Query.query(Criteria.where("id").is(bundle.getId()));
        return mongoTemplate.findOne(qry, DBObject.class, "Bundle");
    }

    private CompositionEntity loadComposition(ObjectId bundleId) {
        Query qry = Query.query(Criteria.where("fhirDocumentlId").is(bundleId.toHexString()));
        return mongoTemplate.findOne(qry, CompositionEntity.class);
    }

    private PatientEntity loadPatient(ObjectId patientId) {
        Query qry = Query.query(Criteria.where("_id").is(patientId.toHexString()));
        return mongoTemplate.findOne(qry, PatientEntity.class);
    }

    private DocumentReferenceEntity loadDocumentReference(ObjectId patientId) {
        //Query qry = Query.query(Criteria.where("patientId").is(patientId.toHexString()));
        Query qry = Query.query(Criteria.where("idxPatient").is(new DBRef("idxPatient", patientId)));

        return mongoTemplate.findOne(qry, DocumentReferenceEntity.class);
    }

}
