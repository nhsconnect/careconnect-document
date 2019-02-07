package uk.nhs.careconnect.nosql.entities;

import org.hl7.fhir.dstu3.model.CodeableConcept;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

import static java.util.stream.Collectors.toList;

public class CodeableConceptEntity {

    @Field(value = "coding")
    List<CodingEntity> codingEntity;

    public CodeableConceptEntity() {

    }

    public CodeableConceptEntity(CodeableConcept codeableConcept) {
        codingEntity = codeableConcept.getCoding().stream().map(CodingEntity::new).collect(toList());
    }

    public List<CodingEntity> getCodingEntity() {
        return codingEntity;
    }

}
