package uk.nhs.careconnect.nosql.support.assertions;

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import org.hl7.fhir.dstu3.model.Bundle;

import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class BundleAssertions {

    public static void assertThatBundleIsEqual(Bundle actual, Bundle expected) {
        assertThat(actual.getIdentifier().getValue(), is(expected.getIdentifier().getValue()));
        assertThat(actual.getIdentifier().getSystem(), is(expected.getIdentifier().getSystem()));
    }

    public static void assertThatBsonBundlesAreEqual(List<BasicDBObject> actual, List<BasicDBObject> expected) {
        actual.stream()
                .forEach(a -> assertThatBsonBundleIsEqual(a, find(a, expected)));
    }

    private static DBObject find(BasicDBObject actual, List<BasicDBObject> expected) {
        return expected.stream()
                .filter(e -> actual.get("_id").equals(e.get("_id")))
                .findFirst()
                .get();
    }

    private static void assertThatBsonBundleIsEqual(DBObject actual, DBObject expected) {
        assertThat(actual, is(expected));
    }

}
