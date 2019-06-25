package uk.nhs.careconnect.nosql.dao.transform;

import org.hl7.fhir.dstu3.model.CodeableConcept;
import org.hl7.fhir.dstu3.model.Composition;
import org.hl7.fhir.dstu3.model.DocumentReference;
import org.hl7.fhir.dstu3.model.Extension;
import org.hl7.fhir.dstu3.model.Period;

import java.util.Optional;

import static java.util.Arrays.asList;

public class CompositionTransformer {

    public static DocumentReference transformToDocumentReference(Composition composition) {
        DocumentReference documentReference = new DocumentReference()
                .setType(composition.getType())
                .setSubject(composition.getSubject())
                .setIdentifier(asList(composition.getIdentifier()));

        Optional<CodeableConcept> optionalCodeableConcept = composition.getExtension().stream()
                .map(Extension::getValue)
                .map(CodeableConcept.class::cast)
                .findFirst();

        Optional<Period> optionalPeriod = composition.getEvent().stream()
                .map(Composition.CompositionEventComponent::getPeriod)
                .findFirst();

        optionalCodeableConcept.ifPresent(codeableConcept -> {
            DocumentReference.DocumentReferenceContextComponent context = new DocumentReference.DocumentReferenceContextComponent().setPracticeSetting(codeableConcept);
            optionalPeriod.ifPresent(context::setPeriod);
            documentReference.setContext(context);
        });

        return documentReference;
    }

}
