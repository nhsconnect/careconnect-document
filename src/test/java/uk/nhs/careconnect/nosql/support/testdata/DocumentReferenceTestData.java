package uk.nhs.careconnect.nosql.support.testdata;

import org.hl7.fhir.dstu3.model.CodeableConcept;
import org.hl7.fhir.dstu3.model.Coding;
import org.hl7.fhir.dstu3.model.DocumentReference;
import org.hl7.fhir.dstu3.model.Identifier;
import org.hl7.fhir.dstu3.model.Period;
import org.hl7.fhir.dstu3.model.Reference;

import java.util.Date;
import java.util.List;

import static java.util.Arrays.asList;
import static uk.nhs.careconnect.nosql.support.testdata.BundleTestData.TOMORROW;
import static uk.nhs.careconnect.nosql.support.testdata.BundleTestData.YESTERDAY;

public class DocumentReferenceTestData {

    private static final String DOCUMENT_REFERENCE_ID = "123456789012345678901234";
    private static final Date DOCUMENT_REFERENCE_CREATED_DATE = new Date();
    private static final String DOCUMENT_REFERENCE_TYPE_SYSTEM = "document-reference-type-system-1";
    private static final String DOCUMENT_REFERENCE_TYPE_CODE = "document-reference-type-code-1";
    private static final String DOCUMENT_REFERENCE_TYPE_DISPLAY = "document-reference-type-display-1";
    private static final String PATIENT_REFERENCE = "123456789012345678901234";

    private static final String DOCUMENT_REFERENCE_IDENTIFIER_VALUE = "document-reference-identifier-value-1";
    private static final String DOCUMENT_REFERENCE_IDENTIFIER_SYSTEM = "document-reference-identifier-system-1";
    private static final String PRACTICE_SETTING_SYSTEM = "practice-setting-system-1";
    private static final String PRACTICE_SETTING_CODE = "practice-setting-code-1";
    private static final String PRACTICE_SETTING_DISPLAY = "practice-setting-display";


    public static DocumentReference aDocumentReference() {
        return (DocumentReference) new DocumentReference()
                .setCreated(DOCUMENT_REFERENCE_CREATED_DATE) //date
                .setType(aType()) //type
                .setSubject(aPatientSubject()) //patient
                .setIdentifier(anIdentifier()) //identifier
                .setContext(aDocumentReferenceContext())
                .setId(DOCUMENT_REFERENCE_ID); //includes setting and period
    }

    public static CodeableConcept aType() {
        return new CodeableConcept()
                .setCoding(asList(
                        new Coding()
                                .setSystem(DOCUMENT_REFERENCE_TYPE_SYSTEM)
                                .setCode(DOCUMENT_REFERENCE_TYPE_CODE)
                                .setDisplay(DOCUMENT_REFERENCE_TYPE_DISPLAY)
                ));
    }

    public static Reference aPatientSubject() {
        return new Reference()
                .setIdentifier(
                        new Identifier()
                                .setValue(PATIENT_REFERENCE)
                );
    }

    public static List<Identifier> anIdentifier() {
        return asList(
                new Identifier()
                        .setValue(DOCUMENT_REFERENCE_IDENTIFIER_VALUE)
                        .setSystem(DOCUMENT_REFERENCE_IDENTIFIER_SYSTEM));
    }

    private static DocumentReference.DocumentReferenceContextComponent aDocumentReferenceContext() {
        return new DocumentReference.DocumentReferenceContextComponent()
                .setPracticeSetting(aPracticeSetting()) //setting
                .setPeriod(aPeriod()); //period
    }


    public static CodeableConcept aPracticeSetting() {
        return new CodeableConcept()
                .setCoding(asList(
                        new Coding()
                                .setSystem(PRACTICE_SETTING_SYSTEM)
                                .setCode(PRACTICE_SETTING_CODE)
                                .setDisplay(PRACTICE_SETTING_DISPLAY)
                ));
    }

    public static Period aPeriod() {
        return new Period()
                .setStart(YESTERDAY)
                .setEnd(TOMORROW);
    }

}
