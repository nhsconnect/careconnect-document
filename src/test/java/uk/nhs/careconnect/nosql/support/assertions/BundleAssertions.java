package uk.nhs.careconnect.nosql.support.assertions;

import org.hl7.fhir.dstu3.model.Bundle;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class BundleAssertions {

    public static void assertThatBundleIsEqual(Bundle bundle, Bundle savedBundle) {
        assertThat(savedBundle.getId(), is(bundle.getId()));
        assertThat(savedBundle.getIdentifier().getValue(), is(bundle.getIdentifier().getValue()));
        assertThat(savedBundle.getIdentifier().getSystem(), is(bundle.getIdentifier().getSystem()));
    }

}
