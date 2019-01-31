package uk.nhs.careconnect.nosql.support.testdata;

import org.hl7.fhir.dstu3.model.*;

import java.util.ArrayList;
import java.util.List;

public class BundleTestData {

    public static final String BUNDLE_ID = "123456789012345678901234";
    public static final String BUNDLE_IDENTIFIER = "0987654321";
    public static final String BUNDLE_IDENTIFIER_SYSTEM = "bundle-identifier-system-1";

    public static final String CODING_CODE = "code-1";
    public static final String CODING_DISPLAY = "display-1";
    public static final String CODING_SYSTEM = "system-1";

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

        Bundle.BundleEntryComponent bundleEntry = new Bundle.BundleEntryComponent();
        entryList.add(bundleEntry);

        Composition composition = new Composition();
        bundleEntry.setResource(composition);

        CodeableConcept codeableConcept = new CodeableConcept();
        composition.setType(codeableConcept);

        codeableConcept.setCoding(aCodingCollection());

        return bundle;
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

}
