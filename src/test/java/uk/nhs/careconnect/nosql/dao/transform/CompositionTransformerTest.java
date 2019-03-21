package uk.nhs.careconnect.nosql.dao.transform;

import org.hl7.fhir.dstu3.model.CodeableConcept;
import org.hl7.fhir.dstu3.model.Composition;
import org.hl7.fhir.dstu3.model.DocumentReference;
import org.hl7.fhir.dstu3.model.DocumentReference.DocumentReferenceContextComponent;
import org.junit.Test;

import java.util.List;

import static java.util.Arrays.asList;
import static uk.nhs.careconnect.nosql.dao.transform.CompositionTransformer.transformToDocumentReference;
import static uk.nhs.careconnect.nosql.support.assertions.DocumentReferenceAssertions.assertThatDocumentReferenceIsEqual;
import static uk.nhs.careconnect.nosql.support.testdata.CompositionTestData.aComposition;

public class CompositionTransformerTest {

    @Test
    public void givenAComposition_whenTransformToDocumentReferenceIsCalled_ADocumentReferenceIsReturned() {
        //setup
        Composition composition = aComposition();

        DocumentReference expectedDocumentReference =
                new DocumentReference()
                        .setType(composition.getType())
                        .setSubject(composition.getSubject())
                        .setIdentifier(asList(composition.getIdentifier()));

        DocumentReferenceContextComponent context = new DocumentReferenceContextComponent().setPracticeSetting((CodeableConcept) first(composition.getExtension()).getValue());

        expectedDocumentReference.setContext(context);
        context.setPeriod(first(composition.getEvent()).getPeriod());

        //when
        DocumentReference actualDocumentReference = transformToDocumentReference(composition);

        //then
        assertThatDocumentReferenceIsEqual(actualDocumentReference, expectedDocumentReference);
    }

    private <T> T first(List<T> list) {
        return list.stream().findFirst().get();
    }

}