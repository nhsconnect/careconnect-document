package uk.nhs.careconnect.nosql.dao.transform;

import org.hl7.fhir.dstu3.model.DocumentReference;
import uk.nhs.careconnect.nosql.entities.DocumentReferenceEntity;

public class DocumentReferenceTransformer {

    public DocumentReference transform(DocumentReferenceEntity documentReferenceEntity){
        DocumentReference documentReference = new DocumentReference();
        documentReference.setId(documentReferenceEntity.getId().toString());
        documentReference.setIndexed(documentReferenceEntity.getCreatedDate());
        return documentReference;
    }

}
