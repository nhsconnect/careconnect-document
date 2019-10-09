package uk.nhs.careconnect.nosql.decorators;

import org.hl7.fhir.dstu3.model.DocumentReference;
import org.hl7.fhir.dstu3.model.Resource;
import uk.nhs.careconnect.nosql.HapiProperties;
import uk.nhs.careconnect.nosql.entities.DocumentReferenceEntity;

import static java.lang.String.format;

public class DocumentReferenceDecorator {

    public static Resource decorateDocumentReference(DocumentReferenceEntity documentReferenceEntity) {
        DocumentReference documentReference = documentReferenceEntity.getFhirDocumentReference();
        documentReference.setId(documentReferenceEntity.getId());
        documentReference.getContent().stream()
                .forEach(c -> c.setAttachment(c.getAttachment().setUrl(format(HapiProperties.getServerBase() + "/%s", c.getAttachment().getUrl()))));

        return documentReference;
    }

}
