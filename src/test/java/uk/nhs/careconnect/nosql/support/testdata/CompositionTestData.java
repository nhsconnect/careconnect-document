package uk.nhs.careconnect.nosql.support.testdata;

import org.hl7.fhir.dstu3.model.CodeableConcept;
import org.hl7.fhir.dstu3.model.Coding;
import org.hl7.fhir.dstu3.model.Composition;
import org.hl7.fhir.dstu3.model.Composition.CompositionEventComponent;
import org.hl7.fhir.dstu3.model.Extension;
import uk.nhs.careconnect.nosql.entities.CodingEntity;
import uk.nhs.careconnect.nosql.entities.CompositionEntity;

import java.util.Date;
import java.util.List;

import static java.util.Arrays.asList;
import static uk.nhs.careconnect.nosql.support.testdata.BundleTestData.CODING_CODE;
import static uk.nhs.careconnect.nosql.support.testdata.BundleTestData.CODING_DISPLAY;
import static uk.nhs.careconnect.nosql.support.testdata.BundleTestData.CODING_SYSTEM;
import static uk.nhs.careconnect.nosql.support.testdata.CodeableConceptTestData.aCodeableConcept;
import static uk.nhs.careconnect.nosql.support.testdata.DocumentReferenceTestData.aPatientSubject;
import static uk.nhs.careconnect.nosql.support.testdata.DocumentReferenceTestData.aPeriod;
import static uk.nhs.careconnect.nosql.support.testdata.DocumentReferenceTestData.anIdentifier;

public class CompositionTestData {

    public static final Date DATE = new Date();

    public static Composition aComposition() {
        Composition composition = new Composition()
                .setType(new CodeableConcept()
                        .setCoding(aCodingCollection()))
                .setSubject(aPatientSubject())
                .setIdentifier(anIdentifier())
                .setEvent(asList(new CompositionEventComponent().setPeriod(aPeriod())));

        composition.setExtension(asList(
                new Extension().setValue(aCodeableConcept())
        ));

        return composition;
    }

    public static List<Coding> aCodingCollection() {
        return asList(
                new Coding()
                        .setCode(CODING_CODE)
                        .setSystem(CODING_SYSTEM)
                        .setDisplay(CODING_DISPLAY)
        );
    }

    public static CompositionEntity aCompositionEntity() {
        CompositionEntity compositionEntity = new CompositionEntity();

        compositionEntity.setType(asList(
                new CodingEntity(
                        new Coding()
                                .setCode(CODING_CODE)
                                .setSystem(CODING_SYSTEM)
                                .setDisplay(CODING_DISPLAY)
                )));

        compositionEntity.setDate(DATE);

        return compositionEntity;
    }

}
