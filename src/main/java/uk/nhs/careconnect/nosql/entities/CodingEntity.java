package uk.nhs.careconnect.nosql.entities;


import org.hl7.fhir.dstu3.model.Coding;

public class CodingEntity {

    private String system;

    private String code;

    private String display;

    public CodingEntity() {

    }

    public CodingEntity(Coding coding) {
        this.system = coding.getSystem();
        this.code = coding.getCode();
        this.display = coding.getDisplay();
    }

    public String getSystem() {
        return system;
    }

    public String getCode() {
        return code;
    }

    public String getDisplay() {
        return display;
    }

}
