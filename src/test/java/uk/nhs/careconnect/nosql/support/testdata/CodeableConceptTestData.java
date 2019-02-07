package uk.nhs.careconnect.nosql.support.testdata;

import org.hl7.fhir.dstu3.model.CodeableConcept;
import org.hl7.fhir.dstu3.model.Coding;

import static java.util.Arrays.asList;

public class CodeableConceptTestData {

    private static final String SYSTEM = "system-1";
    private static final String CODE = "code-1";
    private static final String DISPLAY = "display-1";

    public static CodeableConcept aCodeableConcept() {
        return new CodeableConcept()
                .setCoding(asList(
                        new Coding()
                                .setSystem(SYSTEM)
                                .setCode(CODE)
                                .setDisplay(DISPLAY)
                ));
    }

}
