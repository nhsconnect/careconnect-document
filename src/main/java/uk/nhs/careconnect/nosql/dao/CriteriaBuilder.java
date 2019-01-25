package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenParam;
import com.mongodb.DBRef;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Criteria;

import java.util.HashMap;
import java.util.Map;

public class CriteriaBuilder {

    Criteria criteria;
    Map<String, Object> andClauseParameterMap;

    private CriteriaBuilder() {
        andClauseParameterMap = new HashMap<>();
    }

    public static CriteriaBuilder aCriteriaBuilder() {
        return new CriteriaBuilder();
    }

    public CriteriaBuilder withId(TokenParam resid) {
        if (resid != null) {
            addCriteriaParameter("_id", new ObjectId(resid.getValue()));
        }
        return this;
    }

    public CriteriaBuilder withPatient(ReferenceParam patient) {
        if (patient != null) {
            addCriteriaParameter("idxPatient", new DBRef("idxPatient", patient.getValue()));
        }
        return this;
    }

    public Criteria build() {
        return andClauseParameterMap.entrySet().stream()
                .map(entry -> criteria.and(entry.getKey()).is(entry.getValue()))
                .findFirst().orElse(criteria);
    }

    private void addCriteriaParameter(String parameter, Object condition) {
        if (criteria == null) {
            criteria = Criteria.where(parameter).is(condition);
        } else {
            andClauseParameterMap.put(parameter, condition);
        }
    }

}
