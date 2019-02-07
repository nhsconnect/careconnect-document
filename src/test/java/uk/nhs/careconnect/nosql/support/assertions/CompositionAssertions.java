package uk.nhs.careconnect.nosql.support.assertions;

import uk.nhs.careconnect.nosql.entities.CodingEntity;
import uk.nhs.careconnect.nosql.entities.CompositionEntity;

import java.util.Collection;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class CompositionAssertions {

    public static void assertThatCompositionsAreEqual(CompositionEntity actual, CompositionEntity expected){
        actual.getType().stream()
                .forEach(a -> assertThatCodeIsEqual(a, find(a, expected.getType())));

    }

    private static CodingEntity find(CodingEntity actual, Collection<CodingEntity> expected) {
        return expected.stream()
                .filter(e -> actual.getCode().equals(e.getCode()))
                .findFirst()
                .get();
    }

    private static void assertThatCodeIsEqual(CodingEntity actual, CodingEntity expected) {
        assertThat(actual.getCode(), is(expected.getCode()));
        assertThat(actual.getDisplay(), is(expected.getDisplay()));
        assertThat(actual.getSystem(), is(expected.getSystem()));
    }

}
