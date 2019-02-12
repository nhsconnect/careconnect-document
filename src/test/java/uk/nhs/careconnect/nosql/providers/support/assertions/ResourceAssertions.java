package uk.nhs.careconnect.nosql.providers.support.assertions;

import org.hl7.fhir.dstu3.model.Resource;
import uk.nhs.careconnect.nosql.entities.IdentifierEntity;

import java.util.Collection;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class ResourceAssertions {

    public static void assertResourceListIsEqual(List<Resource> actual, List<Resource> expected) {
        assertThat(actual.size(), is(expected.size()));
        actual.forEach(a -> assertResourceIsEqual(a, find(a, expected)));
    }

    private static Resource find(Resource actual, List<Resource> expectedList) {
        return expectedList.stream().filter(expected -> actual.getId().equals(expected.getId())).findFirst().get();
    }

    public static void assertResourceIsEqual(Resource actual, Resource expected) {
        assertThat(actual.getId(), is(expected.getId()));
    }

    public static void assertPatientIdentifiersAreEqual(Collection<IdentifierEntity> actual, Collection<org.hl7.fhir.dstu3.model.Identifier> expected) {
        assertThat(actual.size(), is(expected.size()));
        actual.forEach(a -> assertIdentifiersAreEqual(a, find(a, expected)));

    }

    public static void assertIdentifiersAreEqual(IdentifierEntity actual, org.hl7.fhir.dstu3.model.Identifier expected) {
        assertThat(actual.getValue(), is(expected.getValue()));
    }

    private static org.hl7.fhir.dstu3.model.Identifier find(IdentifierEntity actual, Collection<org.hl7.fhir.dstu3.model.Identifier> expectedList) {
        return expectedList.stream().filter(expected -> actual.getValue().equals(expected.getValue())).findFirst().get();
    }

}
