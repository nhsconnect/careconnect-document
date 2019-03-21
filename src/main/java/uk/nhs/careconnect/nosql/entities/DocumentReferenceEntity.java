package uk.nhs.careconnect.nosql.entities;

import org.hl7.fhir.dstu3.model.DocumentReference;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Reference;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Document(collection = "idxDocumentReference")
public class DocumentReferenceEntity {

    @Id
    private String id;

    @DBRef
    private PatientEntity idxPatient;

    private Date createdDate;

    private CodeableConceptEntity type;

    private ReferenceEntity patient;

    private List<IdentifierEntity> identifier;

    private CodeableConceptEntity practice;

    private PeriodEntity period;

    @Reference
    private DocumentReference documentReference;

    public DocumentReferenceEntity() {

    }

    public DocumentReferenceEntity(PatientEntity idxPatient, DocumentReference documentReference) {
        this.id = null;
        this.idxPatient = idxPatient;
        this.createdDate = documentReference.getCreated();
        this.type = new CodeableConceptEntity(documentReference.getType());
        this.patient = new ReferenceEntity(documentReference.getSubject());
        this.identifier = documentReference.getIdentifier().stream().map(IdentifierEntity::new).collect(Collectors.toList());
        this.practice = new CodeableConceptEntity(documentReference.getContext().getPracticeSetting());
        this.period = new PeriodEntity(documentReference.getContext().getPeriod());
        this.documentReference = documentReference;
    }

    public DocumentReferenceEntity(DocumentReference documentReference, DocumentReferenceEntity foundDocumentReference) {
        this.id = foundDocumentReference.getId();

        this.idxPatient = foundDocumentReference.getIdxPatient();
        this.createdDate = foundDocumentReference.getCreatedDate();
        this.type = new CodeableConceptEntity(documentReference.getType());
        this.patient = new ReferenceEntity(documentReference.getSubject());
        this.identifier = documentReference.getIdentifier().stream().map(IdentifierEntity::new).collect(Collectors.toList());
        this.practice = new CodeableConceptEntity(documentReference.getContext().getPracticeSetting());
        this.period = new PeriodEntity(documentReference.getContext().getPeriod());
        this.documentReference = documentReference;
    }

    public String getId() {
        return id;
    }

    public PatientEntity getIdxPatient() {
        return idxPatient;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public CodeableConceptEntity getType() {
        return type;
    }

    public ReferenceEntity getPatient() {
        return patient;
    }

    public List<IdentifierEntity> getIdentifier() {
        return identifier;
    }

    public CodeableConceptEntity getPractice() {
        return practice;
    }

    public PeriodEntity getPeriod() {
        return period;
    }

    public DocumentReference getFhirDocumentReference() {
        return documentReference;
    }

}

