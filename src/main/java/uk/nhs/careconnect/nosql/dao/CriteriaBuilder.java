package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.rest.param.DateRangeParam;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenOrListParam;
import ca.uhn.fhir.rest.param.TokenParam;
import com.mongodb.DBRef;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Criteria;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Supplier;

public class CriteriaBuilder {

    Criteria criteria;
    Map<String, Object> andClauseParameterMap;

    private CriteriaBuilder() {
        andClauseParameterMap = new HashMap<>();
    }

    static CriteriaBuilder aCriteriaBuilder() {
        return new CriteriaBuilder();
    }

    CriteriaBuilder withId(TokenParam resid) {
        addCriteriaParameter("_id", resid, () -> new ObjectId(resid.getValue()));
        return this;
    }

    CriteriaBuilder withIdentifier(TokenParam identifier) {
        addCriteriaParameter("identifier.system", identifier, () -> identifier.getSystem());
        addCriteriaParameter("identifier.value", identifier, () -> identifier.getValue());
        return this;
    }

    CriteriaBuilder withPatient(ReferenceParam patient) {
        addCriteriaParameter("idxPatient", patient, () -> new DBRef("idxPatient", patient.getValue()));
        return this;
    }

    CriteriaBuilder withType(TokenOrListParam typeOrList) {
        if (isNotNull(typeOrList)) {
            for (TokenParam type : typeOrList.getValuesAsQueryTokens()) {
                addCriteriaParameter("type.code", type, () -> type.getValue());
                addCriteriaParameter("type.system", type, () -> type.getSystem());
            }
        }
        return this;
    }

    //TODO: Check this
    public CriteriaBuilder withDateRange(DateRangeParam dateRange) {
//        if (dateRange != null) {
//            addCriteriaParameter("idxPatient.dateOfBirth", dateRange, () -> new Criteria().gte(dateRange.getLowerBound().getValue()).lte(dateRange.getUpperBound().getValue()));
//        }
        return this;
    }


    Criteria build() {
        return andClauseParameterMap.entrySet().stream()
                .map(entry -> criteria.and(entry.getKey()).is(entry.getValue()))
                .findFirst().orElse(criteria);
    }

    private <T> void addCriteriaParameter(String parameter, Object parameterObject, Supplier<T> condition) {
        if (criteria == null) {
            if (isNotNull(parameterObject, condition)) {
                criteria = Criteria.where(parameter).is(condition.get());
            }
        } else {
            if (isNotNull(parameterObject, condition)) {
                andClauseParameterMap.put(parameter, condition.get());
            }
        }
    }

    private <T> boolean isNotNull(Object parameterObject, Supplier<T> condition) {
        return parameterObject != null && condition.get() != null;
    }

    private boolean isNotNull(Object parameterObject) {
        return parameterObject != null;
    }

}


