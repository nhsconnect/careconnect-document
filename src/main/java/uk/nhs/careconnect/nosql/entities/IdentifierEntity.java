package uk.nhs.careconnect.nosql.entities;

import org.hl7.fhir.dstu3.model.Identifier;
import org.hl7.fhir.dstu3.model.Identifier.IdentifierUse;

import java.util.List;

public class IdentifierEntity {

	private String system;

	private String value;

//	private Integer order;
//
//	IdentifierUse identifierUse;

	public IdentifierEntity(){

	}

    public IdentifierEntity(Identifier identifier) {
        this.system = identifier.getSystem();
        this.value = identifier.getValue();
    }

    public String getSystem() {
		return system;
	}

	public void setSystem(String system) {
		this.system = system;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

//TODO: Check this - does not seem to be used
//	public Integer getOrder() {
//		return order;
//	}
//
//	public void setOrder(Integer order) {
//		this.order = order;
//	}

//	public IdentifierUse getIdentifierUse() {
//		return identifierUse;
//	}
//
//	public void setIdentifierUse(IdentifierUse identifierUse) {
//		this.identifierUse = identifierUse;
//	}
}
