package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.rest.param.DateRangeParam;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenOrListParam;
import ca.uhn.fhir.rest.param.TokenParam;
import com.mongodb.DBRef;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Criteria;

import java.util.function.Supplier;

public class CriteriaBuilder {

    Criteria criteria;

    private CriteriaBuilder() {
    }

    static CriteriaBuilder aCriteriaBuilder() {
        return new CriteriaBuilder();
    }

    CriteriaBuilder withId(TokenParam resid) {
        addClause(resid, () -> getCriteria("_id").is(new ObjectId(resid.getValue())));
        return this;
    }

    CriteriaBuilder withIdentifier(TokenParam identifier) {
        addClause(identifier, () -> getCriteria("identifier.system").is(identifier.getSystem()));
        addClause(identifier, () -> getCriteria("identifier.value").is(identifier.getValue()));
        return this;
    }

    CriteriaBuilder withPatient(ReferenceParam patient) {
        addClause(patient, () -> getCriteria("idxPatient").is(new DBRef("idxPatient", patient.getValue())));
        return this;
    }

    CriteriaBuilder withType(TokenOrListParam typeOrList) {
        if (isNotNull(typeOrList)) {
            for (TokenParam type : typeOrList.getValuesAsQueryTokens()) {
                addClause(type, () -> getCriteria("type.code").is(type.getValue()));
                addClause(type, () -> getCriteria("type.system").is(type.getSystem()));
            }
        }
        return this;
    }

    public CriteriaBuilder withDateRange(DateRangeParam dateRange) {
        addClause(dateRange, () -> getCriteria("date").gte(dateRange.getLowerBound().getValue()).lte(dateRange.getUpperBound().getValue()));
        return this;
    }

    Criteria build() {
        return criteria;
    }

    private <T> void addClause(Object parameterObject, Supplier<T> clause) {
        //if (isNotNull(parameterObject, clause)) {
        if (isNotNull(parameterObject)) {
            clause.get();
        }
    }

    private Criteria getCriteria(String parameter) {
        if (criteria == null) {
            return criteria = Criteria.where(parameter);
        } else {
            return criteria = criteria.and(parameter);
        }
    }

//    private <T> boolean isNotNull(Object parameterObject, Supplier<T> condition) {
//        return parameterObject != null;
//    }

    private boolean isNotNull(Object parameterObject) {
        return parameterObject != null;
    }

}