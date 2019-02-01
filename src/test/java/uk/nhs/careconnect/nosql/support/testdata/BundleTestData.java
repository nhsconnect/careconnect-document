package uk.nhs.careconnect.nosql.support.testdata;

import org.hl7.fhir.dstu3.model.*;

import java.util.ArrayList;
import java.util.List;

import static java.util.Arrays.asList;

public class BundleTestData {

    public static final String BUNDLE_ID = "123456789012345678901234";
    public static final String BUNDLE_IDENTIFIER = "0987654321";
    public static final String BUNDLE_IDENTIFIER_SYSTEM = "bundle-identifier-system-1";

    public static final String CODING_CODE = "code-1";
    public static final String CODING_DISPLAY = "display-1";
    public static final String CODING_SYSTEM = "system-1";

    public static final List<Identifier> PATIENT_IDENTIFIER = asList(new Identifier().setValue("patient-identifier-1"));

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

        entryList.add(compositionEntry);
        entryList.add(patientEntry);

        return bundle;
    }

    public static Composition aComposition(){
        Composition composition = new Composition();

        CodeableConcept codeableConcept = new CodeableConcept();
        composition.setType(codeableConcept);

        codeableConcept.setCoding(aCodingCollection());

        return composition;
    }

    private static Patient aPatient() {
        Patient patient = new Patient();
        patient.setIdentifier(PATIENT_IDENTIFIER);
        return patient;
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
