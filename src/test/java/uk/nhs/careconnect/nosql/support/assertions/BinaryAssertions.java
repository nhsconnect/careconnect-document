package uk.nhs.careconnect.nosql.support.assertions;

import org.hl7.fhir.dstu3.model.Binary;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class BinaryAssertions {

    public static void assertThatBinaryIsEqual(Binary expectedBinary, Binary savedBinary) {
        assertThat(expectedBinary.getContentType(), is(savedBinary.getContentType()));
        assertThat(expectedBinary.getContent(), is(savedBinary.getContent()));
    }

}
