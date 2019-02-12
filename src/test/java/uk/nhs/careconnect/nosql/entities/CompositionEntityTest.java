package uk.nhs.careconnect.nosql.entities;

import com.mongodb.DBRef;
import org.bson.types.ObjectId;
import org.hl7.fhir.dstu3.model.Coding;
import org.hl7.fhir.dstu3.model.Identifier;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import static java.util.Arrays.asList;
import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

public class CompositionEntityTest {

    private static final ObjectId ID = new ObjectId("123456789012345678901234");
    private static final IdentifierEntity IDENTIFIER = anIdentifier();
    private static final ObjectId FHIR_DOCUMENT_ID = new ObjectId("098765432109876543210987");
    private static final DBRef FHIR_DOCUMENT = new DBRef("Bundle", FHIR_DOCUMENT_ID);
    private static final PatientEntity PATIENT_ENTITY = aPatientEntity();
    private static final Collection<CodingEntity> TYPE = aType();
    private static final Date DATE = new Date();


    CompositionEntity compositionEntity;

    @Before
    public void eachTest() {
        compositionEntity = new CompositionEntity();
    }

    @Test
    public void idTest() {
        compositionEntity.setId(ID);
        assertThat(compositionEntity.getId(), is(ID));
    }

    @Test
    public void identifierTest() {
        compositionEntity.setIdentifier(IDENTIFIER);
        assertThat(compositionEntity.getIdentifier(), is(IDENTIFIER));
    }

    @Test
    public void fhirDocumentTest() {
        compositionEntity.setFhirDocument(FHIR_DOCUMENT);
        assertThat(compositionEntity.getFhirDocument(), is(FHIR_DOCUMENT));
    }

    @Test
    public void fhirDocumentlIdTest() {
        compositionEntity.setFhirDocumentlId(FHIR_DOCUMENT_ID.toString());
        assertThat(compositionEntity.getFhirDocumentlId(), is(FHIR_DOCUMENT_ID.toString()));
    }

    @Test
    public void getIdxPatient() {
        compositionEntity.setIdxPatient(PATIENT_ENTITY);
        assertThat(compositionEntity.getIdxPatient(), is(compositionEntity.getIdxPatient()));
    }

    @Test
    public void typeTest() {
        compositionEntity.setType(TYPE);
        assertThat(compositionEntity.getType(), is(TYPE));
    }

    @Test
    public void dateTest() {
        compositionEntity.setDate(DATE);
        assertThat(compositionEntity.getDate(), is(DATE));
    }

    private static IdentifierEntity anIdentifier() {
        IdentifierEntity identifier = new IdentifierEntity(new Identifier().setValue("indentifier-1"));
        return identifier;
    }

    private static PatientEntity aPatientEntity() {
        PatientEntity patientEntity = new PatientEntity();
        patientEntity.setId(ID);
        return patientEntity;
    }

    private static Collection<CodingEntity> aType() {
        return asList(new CodingEntity(
                new Coding()
                        .setCode("code-1")
                        .setSystem("system-1")
                        .setDisplay("display-1")
        ));
    }

}