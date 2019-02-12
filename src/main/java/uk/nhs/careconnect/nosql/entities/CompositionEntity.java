package uk.nhs.careconnect.nosql.entities;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Collection;
import java.util.Date;
import java.util.LinkedHashSet;

@Document(collection = "idxComposition")
public class CompositionEntity {

    @Id
    private ObjectId id;

    private IdentifierEntity identifier;

    private Collection<CodingEntity> type = new LinkedHashSet<>();

    @DBRef
    private PatientEntity idxPatient;

    private com.mongodb.DBRef fhirDocument;

    private String fhirDocumentlId;

    private Date date;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public IdentifierEntity getIdentifier() {
        return identifier;
    }

    public void setIdentifier(IdentifierEntity identifier) {
        this.identifier = identifier;
    }

    public com.mongodb.DBRef getFhirDocument() {
        return fhirDocument;
    }

    public void setFhirDocument(com.mongodb.DBRef fhirDocument) {
        this.fhirDocument = fhirDocument;
    }

    public String getFhirDocumentlId() {
        return fhirDocumentlId;
    }

    public void setFhirDocumentlId(String fhirDocumentlId) {
        this.fhirDocumentlId = fhirDocumentlId;
    }

    public PatientEntity getIdxPatient() {
        return idxPatient;
    }

    public void setIdxPatient(PatientEntity idxPatient) {
        this.idxPatient = idxPatient;
    }

    public Collection<CodingEntity> getType() {
        return type;
    }

    public void setType(Collection<CodingEntity> type) {
        this.type = type;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

}