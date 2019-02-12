package uk.nhs.careconnect.nosql.support.assertions;

import org.hl7.fhir.dstu3.model.Reference;
import uk.nhs.careconnect.nosql.entities.ReferenceEntity;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static uk.nhs.careconnect.nosql.support.assertions.IdentityAssertions.assertThatIdentifierIsEqual;

public class ReferenceAssertions {

    public static void assertThatReferenceIsEqual(ReferenceEntity actual, Reference expected) {
        assertThat(actual.getReference(), is(expected.getReference()));
        assertThat(actual.getDisplay(), is(expected.getDisplay()));
        assertThatIdentifierIsEqual(actual.getIdentifier(), expected.getIdentifier());
    }
}
