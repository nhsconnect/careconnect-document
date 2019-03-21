package uk.nhs.careconnect.nosql.support.assertions;

import ca.uhn.fhir.context.FhirContext;
import org.hl7.fhir.dstu3.model.Binary;
import org.hl7.fhir.dstu3.model.Bundle;

import static com.shazam.shazamcrest.matcher.Matchers.sameBeanAs;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class BinaryAssertions {

    public static void assertThatBinaryIsEqual(Binary actual, Binary expected) {
        assertThat(actual.getContentType(), is(expected.getContentType()));
        assertThat(actual.getContent(), is(expected.getContent()));
    }

    public static void assertThatFhirResourceIsEqual(Binary actual, Binary expected) {
        assertThat(actual.getContentType(), is(expected.getContentType()));
        assertThat(binaryContentToBundle(actual), sameBeanAs(binaryContentToBundle(expected)).ignoring("id"));
    }

    private static Bundle binaryContentToBundle(Binary binary) {
        return (Bundle) FhirContext.forDstu3().newXmlParser().parseResource(new String(binary.getContent()));
    }

}
