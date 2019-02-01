package uk.nhs.careconnect.nosql.entities;

import com.mongodb.DBRef;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;

public class CompositionEntityTest {

    private static final ObjectId ID = new ObjectId("123456789012345678901234");
    private static final Identifier IDENTIFIER = anIdentifier();
    private static final DBRef FHIR_DOCUMENT = new DBRef("Bundle", ID);
    private static final PatientEntity PATIENT_ENTITY = aPatientEntity();
    private static final Collection<Coding> TYPE = aType();
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
        compositionEntity.setFhirDocumentlId(ID.toString());
        assertThat(compositionEntity.getFhirDocumentlId(), is(ID.toString()));
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

    private static Identifier anIdentifier() {
        Identifier identifier = new Identifier();
        identifier.setValue("indentifier-1");
        return identifier;
    }

    private static PatientEntity aPatientEntity() {
        PatientEntity patientEntity = new PatientEntity();
        patientEntity.setId(ID);
        return patientEntity;
    }

    private static Collection<Coding> aType() {
        Collection<Coding> typeList = new ArrayList<>();
        Coding coding = new Coding();
        coding.setCode("code-1");
        coding.setSystem("system-1");
        coding.setDisplay("display-1");
        typeList.add(coding);
        return typeList;
    }

}