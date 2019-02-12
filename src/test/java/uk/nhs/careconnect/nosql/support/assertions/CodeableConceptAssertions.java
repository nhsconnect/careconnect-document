package uk.nhs.careconnect.nosql.support.assertions;

import org.hl7.fhir.dstu3.model.CodeableConcept;
import org.hl7.fhir.dstu3.model.Coding;
import uk.nhs.careconnect.nosql.entities.CodeableConceptEntity;
import uk.nhs.careconnect.nosql.entities.CodingEntity;

import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class CodeableConceptAssertions {

    public static void assertThatCodeableConceptIsEqual(CodeableConceptEntity actual, CodeableConcept expected) {
        actual.getCodingEntity().stream()
                .forEach(a -> assertThatCodeIsEqual(a, find(a, expected.getCoding())));

    }

    private static Coding find(CodingEntity actual, List<Coding> expected) {
        return expected.stream()
                .filter(e -> actual.getCode().equals(e.getCode()))
                .findFirst()
                .get();
    }

    private static void assertThatCodeIsEqual(CodingEntity actual, Coding expected) {
        assertThat(actual.getCode(), is(expected.getCode()));
        assertThat(actual.getDisplay(), is(expected.getDisplay()));
        assertThat(actual.getSystem(), is(expected.getSystem()));
    }

}
