package uk.nhs.careconnect.nosql.providers.support.assertions;

import org.hl7.fhir.dstu3.model.Resource;

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

}
