package uk.nhs.careconnect.nosql.util;

import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.DocumentReference;
import org.junit.Test;

import java.util.Optional;

import static java.util.Arrays.asList;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static uk.nhs.careconnect.nosql.support.testdata.BundleTestData.aBundleWithDocumentReference;
import static uk.nhs.careconnect.nosql.support.testdata.DocumentReferenceTestData.aDocumentReference;

public class BundleUtilsTest {

    @Test
    public void givenABundle_whenExtractFirstResourceOfTypeIsCalled_shouldExtractAndReturnTheFirstInstanceOfAResouceType(){
        //setup
        Bundle bundle = aBundleWithDocumentReference();
        DocumentReference documentReference = aDocumentReference();
        bundle.setEntry(asList(new Bundle.BundleEntryComponent().setResource(documentReference)));

        Optional<DocumentReference> expectedDocumentReference = Optional.of(documentReference);

        //when
        Optional<DocumentReference> actualDocumentReference = BundleUtils.extractFirstResourceOfType(DocumentReference.class, bundle);

        //then
        assertThat(actualDocumentReference.get(), is(expectedDocumentReference.get()));
    }

}