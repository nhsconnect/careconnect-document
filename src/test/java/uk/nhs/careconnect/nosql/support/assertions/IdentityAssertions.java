package uk.nhs.careconnect.nosql.support.assertions;

import org.hl7.fhir.dstu3.model.Identifier;
import uk.nhs.careconnect.nosql.entities.IdentifierEntity;

import java.util.Collection;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class IdentityAssertions {

    public static void assertThatIdentifierEntitiesAreEqual(List<IdentifierEntity> actual, List<Identifier> expected) {
        actual.stream()
                .forEach(a -> assertThatIdentifierIsEqual(a, find(a, expected)));
    }

    public static void assertThatIdentifiersAreEqual(List<Identifier> actual, List<Identifier> expected) {
        actual.stream()
                .forEach(a -> assertThatIdentifierIsEqual(a, find(a, expected)));
    }

    private static Identifier find(IdentifierEntity actual, Collection<Identifier> expected) {
        return expected.stream()
                .filter(e -> actual.getValue().equals(e.getValue()))
                .findFirst()
                .get();
    }

    private static Identifier find(Identifier actual, Collection<Identifier> expected) {
        return expected.stream()
                .filter(e -> actual.getValue().equals(e.getValue()))
                .findFirst()
                .get();
    }

    public static void assertThatIdentifierIsEqual(IdentifierEntity actual, Identifier expected) {
        assertThat(actual.getValue(), is(expected.getValue()));
        assertThat(actual.getSystem(), is(expected.getSystem()));
    }

    public static void assertThatIdentifierIsEqual(Identifier actual, Identifier expected) {
        assertThat(actual.getValue(), is(expected.getValue()));
        assertThat(actual.getSystem(), is(expected.getSystem()));
    }

}
