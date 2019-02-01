package uk.nhs.careconnect.nosql.support.assertions;

import uk.nhs.careconnect.nosql.entities.Coding;
import uk.nhs.careconnect.nosql.entities.CompositionEntity;

import java.util.Collection;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class CompositionAssertions {

    public static void assertThatCompositionsAreEqual(CompositionEntity actual, CompositionEntity expected){
        actual.getType().stream()
                .forEach(a -> assertThatCodeIsEqual(a, find(a, expected.getType())));

    }

    private static Coding find(Coding actual, Collection<Coding> expected) {
        return expected.stream()
                .filter(e -> actual.getCode().equals(e.getCode()))
                .findFirst()
                .get();
    }

    private static void assertThatCodeIsEqual(Coding actual, Coding expected) {
        assertThat(actual.getCode(), is(expected.getCode()));
        assertThat(actual.getDisplay(), is(expected.getDisplay()));
        assertThat(actual.getSystem(), is(expected.getSystem()));
    }

}
