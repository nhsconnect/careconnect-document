package uk.nhs.careconnect.nosql.support.testdata;

import org.hl7.fhir.dstu3.model.Binary;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.CodeableConcept;
import org.hl7.fhir.dstu3.model.Coding;
import org.hl7.fhir.dstu3.model.Composition;
import org.hl7.fhir.dstu3.model.Identifier;
import org.hl7.fhir.dstu3.model.Patient;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static java.util.Arrays.asList;
import static uk.nhs.careconnect.nosql.support.testdata.DocumentReferenceTestData.aDocumentReference;

public class BundleTestData {

    public static final String BUNDLE_ID = "123456789012345678901234";
    public static final String BUNDLE_IDENTIFIER = "0987654321";
    public static final String BUNDLE_IDENTIFIER_SYSTEM = "bundle-identifier-system-1";

    public static final String CODING_CODE = "code-1";
    public static final String CODING_DISPLAY = "display-1";
    public static final String CODING_SYSTEM = "system-1";

    private static final OffsetDateTime NOW = OffsetDateTime.now(ZoneOffset.UTC);
    public static final Date YESTERDAY = Date.from(NOW.minusDays(1).toInstant());
    public static final Date TOMORROW = Date.from(NOW.plusDays(1).toInstant());
    public static final String CONTENT_TYPE_APPLICATION_PDF = "application/pdf";
    public static final byte[] BINARY_CONTENT_BYTES = "Some test content".getBytes();

    public static Bundle aBundle() {
        Bundle bundle = new Bundle();
        bundle.setId(BUNDLE_ID);
        bundle.setType(Bundle.BundleType.DOCUMENT);

        Identifier identifier = new Identifier();
        identifier.setValue(BUNDLE_IDENTIFIER);
        identifier.setSystem(BUNDLE_IDENTIFIER_SYSTEM);
        bundle.setIdentifier(identifier);

        List<Bundle.BundleEntryComponent> entryList = new ArrayList<>();
        bundle.setEntry(entryList);

        Bundle.BundleEntryComponent compositionEntry = new Bundle.BundleEntryComponent();
        compositionEntry.setResource(aComposition());

        Bundle.BundleEntryComponent patientEntry = new Bundle.BundleEntryComponent();
        patientEntry.setResource(aPatient());

        Bundle.BundleEntryComponent documentReferenceEntry = new Bundle.BundleEntryComponent();
        documentReferenceEntry.setResource(aDocumentReference());

        entryList.add(patientEntry);
        entryList.add(documentReferenceEntry);

        return bundle;
    }

    public static Bundle aBundleWithBinary() {
        Bundle bundle = aBundle();
        List<Bundle.BundleEntryComponent> entryList = bundle.getEntry();

        Bundle.BundleEntryComponent binaryEntry = new Bundle.BundleEntryComponent();
        binaryEntry.setResource(aBinary());

        entryList.add(binaryEntry);

        return bundle;
    }

    public static Composition aComposition() {
        return new Composition()
                .setType(new CodeableConcept()
                        .setCoding(aCodingCollection()));
    }


    public static List<Coding> aCodingCollection() {
        List<Coding> codingList = new ArrayList<>();
        Coding coding = new Coding();
        coding.setCode(CODING_CODE);
        coding.setDisplay(CODING_DISPLAY);
        coding.setSystem(CODING_SYSTEM);
        codingList.add(coding);
        return codingList;
    }

    public static Patient aPatient() {
        return new Patient()
                .setIdentifier(aPatientIdentifier());
    }

    public static List<Identifier> aPatientIdentifier() {
        return asList(new Identifier().setValue("patient-identifier-1"));
    }

    public static Binary aBinary() {
        return new Binary()
                .setContent(BINARY_CONTENT_BYTES)
                .setContentType(CONTENT_TYPE_APPLICATION_PDF);
    }

}
