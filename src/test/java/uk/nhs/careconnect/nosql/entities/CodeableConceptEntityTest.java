package uk.nhs.careconnect.nosql.entities;

import org.hl7.fhir.dstu3.model.CodeableConcept;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static uk.nhs.careconnect.nosql.support.assertions.CodeableConceptAssertions.assertThatCodeableConceptIsEqual;
import static uk.nhs.careconnect.nosql.support.testdata.CodeableConceptTestData.aCodeableConcept;


public class CodeableConceptEntityTest {

    CodeableConcept codeableConcept;
    CodeableConceptEntity codeableConceptEntity;

    @Before
    public void eachTest() {
        codeableConcept = aCodeableConcept();
    }

    @Test
    public void defaultEmptyConstructorExists() {
        codeableConceptEntity = new CodeableConceptEntity();
        assertThat(codeableConceptEntity, is(notNullValue()));
    }

    @Test
    public void givenACodeableConcept_whenConstructorIsCalled_aCodeableConceptEntityIsPopulated() {
        codeableConceptEntity = new CodeableConceptEntity(codeableConcept);
        assertThatCodeableConceptIsEqual(codeableConceptEntity, codeableConcept);
    }

}
