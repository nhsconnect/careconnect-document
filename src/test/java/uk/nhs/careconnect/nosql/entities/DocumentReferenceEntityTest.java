package uk.nhs.careconnect.nosql.entities;

import org.bson.types.ObjectId;
import org.hamcrest.MatcherAssert;
import org.hl7.fhir.dstu3.model.DocumentReference;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.junit.Assert.assertThat;
import static uk.nhs.careconnect.nosql.support.assertions.CodeableConceptAssertions.assertThatCodeableConceptIsEqual;
import static uk.nhs.careconnect.nosql.support.assertions.IdentityAssertions.assertThatIdentifierEntitiesAreEqual;
import static uk.nhs.careconnect.nosql.support.assertions.PeriodAssertions.assertThatPeriodIsEqual;
import static uk.nhs.careconnect.nosql.support.assertions.ReferenceAssertions.assertThatReferenceIsEqual;
import static uk.nhs.careconnect.nosql.support.testdata.DocumentReferenceTestData.aDocumentReference;

public class DocumentReferenceEntityTest {

    //TODO: perhaps move PatientEntity to test data class
    private static final String PATIENT_ID = "123456789012345678901234";
    private static PatientEntity patientEntity;

    private DocumentReference documentReference;
    private DocumentReferenceEntity documentReferenceEntity;

    @Before
    public void eachTest() {
        patientEntity = new PatientEntity();
        patientEntity.setId(new ObjectId(PATIENT_ID));
        documentReference = aDocumentReference();
        documentReferenceEntity = new DocumentReferenceEntity(patientEntity, aDocumentReference());
    }

    @Test
    public void defaultEmptyConstructorExists() {
        documentReferenceEntity = new DocumentReferenceEntity();
        MatcherAssert.assertThat(documentReferenceEntity, is(notNullValue()));
    }

    @Test
    public void givenDocumentReferenceEntityIsConstructFromDocumentReference_idShouldBeNull() {
        assertThat(documentReferenceEntity.getId(), is(nullValue()));
    }

    @Test
    public void patientIdTest() {
        assertThat(documentReferenceEntity.getIdxPatient().getId().toString(), is(PATIENT_ID));
    }

    @Test
    public void createdDateTest() {
        assertThat(documentReferenceEntity.getCreatedDate(), is(documentReference.getCreated()));
    }

    @Test
    public void typeTest() {
        assertThatCodeableConceptIsEqual(documentReferenceEntity.getType(), documentReference.getType());
    }


    @Test
    public void patientTest() {
        assertThatReferenceIsEqual(documentReferenceEntity.getPatient(), documentReference.getSubject());
    }

    @Test
    public void identifierTest() {
        assertThatIdentifierEntitiesAreEqual(documentReferenceEntity.getIdentifier(), documentReference.getIdentifier());
    }

    @Test
    public void practiceTest() {
        assertThatCodeableConceptIsEqual(documentReferenceEntity.getPractice(), documentReference.getContext().getPracticeSetting());
    }

    @Test
    public void periodTest() {
        assertThatPeriodIsEqual(documentReferenceEntity.getPeriod(), documentReference.getContext().getPeriod());
    }

}