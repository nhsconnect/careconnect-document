package uk.nhs.careconnect.nosql.entities;

import org.hl7.fhir.dstu3.model.DocumentReference;
import org.springframework.data.annotation.Id;
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




    //TODO: Check if these are still needed
//    private String name;
//
//    public String getName() {
//        return name;
//    }
//
//    public void setName(String name) {
//        this.name = name;
//    }
//
//    private String json;
//
//    public String getJson() {
//        return json;
//    }
//
//    public void setJson(String json) {
//        this.json = json;
//    }

}

