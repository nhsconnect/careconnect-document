package uk.nhs.careconnect.nosql.entities;

import org.hl7.fhir.dstu3.model.Reference;
import org.junit.Before;
import org.junit.Test;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static uk.nhs.careconnect.nosql.support.assertions.IdentityAssertions.assertThatIdentifierIsEqual;
import static uk.nhs.careconnect.nosql.support.testdata.ReferenceTestData.aReference;

public class ReferenceEntityTest {

    Reference reference;
    ReferenceEntity referenceEntity;

    @Before
    public void eachTest() {
        reference = aReference();
        referenceEntity = new ReferenceEntity(reference);
    }

    @Test
    public void defaultEmptyConstructorExists() {
        referenceEntity = new ReferenceEntity();
        assertThat(referenceEntity, is(notNullValue()));
    }

    @Test
    public void referenceTest() {
        assertThat(referenceEntity.getReference(), is(reference.getReference()));
    }

    @Test
    public void displayTest() {
        assertThat(referenceEntity.getDisplay(), is(reference.getDisplay()));
    }

    @Test
    public void identifierTest() {
        assertThatIdentifierIsEqual(referenceEntity.getIdentifier(), reference.getIdentifier());
    }

}