package uk.nhs.careconnect.nosql.support.assertions;

import org.hl7.fhir.dstu3.model.DocumentReference;
import uk.nhs.careconnect.nosql.entities.DocumentReferenceEntity;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static uk.nhs.careconnect.nosql.support.assertions.CodeableConceptAssertions.assertThatCodeableConceptIsEqual;
import static uk.nhs.careconnect.nosql.support.assertions.IdentityAssertions.assertThatIdentifiersAreEqual;
import static uk.nhs.careconnect.nosql.support.assertions.ReferenceAssertions.assertThatReferenceIsEqual;

public class DocumentReferenceAssertions {

    public static void assertThatDocumentReferenceIsEqual(DocumentReferenceEntity actual, DocumentReference expected) {
        //TODO: fix date precision issue
//        assertThat(actual.getCreatedDate(), is(expected.getCreated()));
        assertThatCodeableConceptIsEqual(actual.getType(), expected.getType());
        assertThatReferenceIsEqual(actual.getPatient(), expected.getSubject());
        assertThatIdentifiersAreEqual(actual.getIdentifier(), expected.getIdentifier());
        assertThatCodeableConceptIsEqual(actual.getPractice(), expected.getContext().getPracticeSetting());
//        assertThat(actual.getPeriod().getStart(), is(expected.getContext().getPeriod().getStart()));
//        assertThat(actual.getPeriod().getEnd(), is(expected.getContext().getPeriod().getEnd()));
        assertThat(actual.getFhirDocumentReference().getId(), is(expected.getId()));
    }

}
