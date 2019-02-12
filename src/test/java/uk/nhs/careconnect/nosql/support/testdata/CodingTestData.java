package uk.nhs.careconnect.nosql.support.testdata;

import org.hl7.fhir.dstu3.model.Coding;

public class CodingTestData {

    private static final String SYSTEM = "system-1";
    private static final String CODE = "code-1";
    private static final String DISPLAY = "display-1";

    public static Coding aCoding() {
        return new Coding()
                .setSystem(SYSTEM)
                .setCode(CODE)
                .setDisplay(DISPLAY);
    }

}
