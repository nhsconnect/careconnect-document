package uk.nhs.careconnect.nosql.entities;

public class Reference {
    String reference;
    String display;
    IdentifierEntity identifier;

    public Reference(org.hl7.fhir.dstu3.model.Reference subject) {
    }


    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public String getDisplay() {
        return display;
    }

    public void setDisplay(String display) {
        this.display = display;
    }

    public IdentifierEntity getIdentifier() {
        return identifier;
    }

    public void setIdentifier(IdentifierEntity identifier) {
        this.identifier = identifier;
    }
}
