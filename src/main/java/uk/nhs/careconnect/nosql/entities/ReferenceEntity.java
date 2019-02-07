package uk.nhs.careconnect.nosql.entities;

import org.hl7.fhir.dstu3.model.Reference;

public class ReferenceEntity {

    private String reference;
    private String display;
    private IdentifierEntity identifier;

    public ReferenceEntity() {

    }

    public ReferenceEntity(Reference reference) {
        this.reference = reference.getReference();
        this.display = reference.getDisplay();
        this.identifier = new IdentifierEntity(reference.getIdentifier());
    }

    public String getReference() {
        return reference;
    }

    public String getDisplay() {
        return display;
    }

    public IdentifierEntity getIdentifier() {
        return identifier;
    }

}
