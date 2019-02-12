package uk.nhs.careconnect.nosql.support.testdata;

import org.hl7.fhir.dstu3.model.Identifier;
import org.hl7.fhir.dstu3.model.Reference;

public class ReferenceTestData {

    private static final String REFERENCE = "reference-1";
    private static final String DISPLAY = "display-1";
    private static final String IDENTIFIER = "identifier-1";

    public static Reference aReference() {
        return new Reference()
                .setReference(REFERENCE)
                .setDisplay(DISPLAY)
                .setIdentifier(
                        new Identifier()
                                .setValue(IDENTIFIER)
                );
    }

}
