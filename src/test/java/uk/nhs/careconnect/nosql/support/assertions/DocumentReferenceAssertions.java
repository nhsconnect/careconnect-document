package uk.nhs.careconnect.nosql.support.assertions;

import org.hl7.fhir.dstu3.model.Attachment;
import org.hl7.fhir.dstu3.model.DocumentReference;
import org.hl7.fhir.dstu3.model.DocumentReference.DocumentReferenceContentComponent;
import uk.nhs.careconnect.nosql.entities.DocumentReferenceEntity;

import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static uk.nhs.careconnect.nosql.support.assertions.CodeableConceptAssertions.assertThatCodeableConceptIsEqual;
import static uk.nhs.careconnect.nosql.support.assertions.IdentityAssertions.assertThatIdentifierEntitiesAreEqual;
import static uk.nhs.careconnect.nosql.support.assertions.IdentityAssertions.assertThatIdentifiersAreEqual;
import static uk.nhs.careconnect.nosql.support.assertions.ReferenceAssertions.assertThatReferenceIsEqual;
import static uk.nhs.careconnect.nosql.support.matchers.DateMatchers.equalIgnoringMilliSeconds;

public class DocumentReferenceAssertions {

    public static void assertThatDocumentReferenceEntityIsEqual(DocumentReferenceEntity actual, DocumentReference expected) {
        assertThat(actual.getCreatedDate(), is(equalIgnoringMilliSeconds(expected.getCreated())));
        assertThatCodeableConceptIsEqual(actual.getType(), expected.getType());
        assertThatReferenceIsEqual(actual.getPatient(), expected.getSubject());
        assertThatIdentifierEntitiesAreEqual(actual.getIdentifier(), expected.getIdentifier());
        assertThatCodeableConceptIsEqual(actual.getPractice(), expected.getContext().getPracticeSetting());
        assertThat(actual.getPeriod().getStart(), is(equalIgnoringMilliSeconds(expected.getContext().getPeriod().getStart())));
        assertThat(actual.getPeriod().getEnd(), is(equalIgnoringMilliSeconds(expected.getContext().getPeriod().getEnd())));
        //assertThat(actual.getFhirDocumentReference().getId(), is(expected.getId()));
    }

    public static void assertThatDocumentReferenceIsEqual(DocumentReference actual, DocumentReference expected) {
        assertThatCodeableConceptIsEqual(actual.getType(), expected.getType());
        assertThatReferenceIsEqual(actual.getSubject(), expected.getSubject());
        assertThatIdentifiersAreEqual(actual.getIdentifier(), expected.getIdentifier());
        assertThatCodeableConceptIsEqual(actual.getContext().getPracticeSetting(), expected.getContext().getPracticeSetting());
        assertThat(actual.getContext().getPeriod().getStart(), is(equalIgnoringMilliSeconds(expected.getContext().getPeriod().getStart())));
        assertThat(actual.getContext().getPeriod().getEnd(), is(equalIgnoringMilliSeconds(expected.getContext().getPeriod().getEnd())));
    }

    public static void assertThatContentsAreEqual(List<DocumentReferenceContentComponent> actual, List<DocumentReferenceContentComponent> expected) {
        actual.stream()
                .forEach(a -> assertAttachmentIsEqual(a.getAttachment(), find(a, expected)));

    }

    private static Attachment find(DocumentReferenceContentComponent actual, List<DocumentReferenceContentComponent> expected) {
        return expected.stream()
                .filter(e -> binaryIdPartIsEqual(actual, e))
                .map(DocumentReferenceContentComponent::getAttachment)
                .findFirst()
                .get();
    }

    private static void assertAttachmentIsEqual(Attachment actual, Attachment expected) {
        assertThat(actual.getContentType(), is(expected.getContentType()));
        assertThat(getBinaryIdPart(actual), is(getBinaryIdPart(expected)));
    }

    private static boolean binaryIdPartIsEqual(DocumentReferenceContentComponent actual, DocumentReferenceContentComponent expected) {
        return getBinaryIdPart(actual.getAttachment()).equals(getBinaryIdPart(expected.getAttachment()));
    }

    private static String getBinaryIdPart(Attachment actual) {
        String url = actual.getUrl();
        return url.substring(url.lastIndexOf('/'));
    }



}
