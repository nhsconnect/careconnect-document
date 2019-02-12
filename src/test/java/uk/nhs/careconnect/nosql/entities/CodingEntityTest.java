package uk.nhs.careconnect.nosql.entities;

import org.hl7.fhir.dstu3.model.Coding;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static uk.nhs.careconnect.nosql.support.testdata.CodingTestData.aCoding;

public class CodingEntityTest {

    private Coding coding;
    private CodingEntity codingEntity;

    @Before
    public void eachTest() {
        coding = aCoding();
        codingEntity = new CodingEntity(coding);
    }

    @Test
    public void defaultEmptyConstructorExists() {
        codingEntity = new CodingEntity();
        assertThat(codingEntity, is(notNullValue()));
    }

    @Test
    public void getSystem() {
        assertThat(codingEntity.getSystem(), is(coding.getSystem()));
    }

    @Test
    public void getCode() {
        assertThat(codingEntity.getCode(), is(coding.getCode()));

    }

    @Test
    public void getDisplay() {
        assertThat(codingEntity.getDisplay(), is(coding.getDisplay()));
    }

}