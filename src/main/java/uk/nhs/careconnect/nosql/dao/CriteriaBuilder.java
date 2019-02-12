package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.rest.param.DateParam;
import ca.uhn.fhir.rest.param.DateRangeParam;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenOrListParam;
import ca.uhn.fhir.rest.param.TokenParam;
import com.mongodb.DBRef;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Criteria;

import java.util.function.Supplier;

import static ca.uhn.fhir.rest.param.ParamPrefixEnum.GREATERTHAN_OR_EQUALS;
import static ca.uhn.fhir.rest.param.ParamPrefixEnum.LESSTHAN_OR_EQUALS;

public class CriteriaBuilder {

    public static final String ID = "_id";
    public static final String IDENTIFIER_SYSTEM = "identifier.system";
    public static final String IDENTIFIER_VALUE = "identifier.value";
    public static final String IDX_PATIENT = "idxPatient";
    public static final String IDX_PATIENT_COLLECTION = "idxPatient";
    public static final String PRACTICE_CODING_CODE = "practice.coding.code";
    public static final String PRACTICE_CODING_SYSTEM = "practice.coding.system";
    public static final String CREATED_DATE = "createdDate";
    public static final String PERIOD_START = "period.start";
    public static final String PERIOD_END = "period.end";

    Criteria criteria;

    private CriteriaBuilder() {
    }

    static CriteriaBuilder aCriteriaBuilder() {
        return new CriteriaBuilder();
    }

    CriteriaBuilder withId(TokenParam resid) {
        addClause(resid, () -> getCriteria(ID).is(new ObjectId(resid.getValue())));
        return this;
    }

    CriteriaBuilder withIdentifier(TokenParam identifier) {
        addClause(identifier, () -> getCriteria(IDENTIFIER_SYSTEM).is(identifier.getSystem()));
        addClause(identifier, () -> getCriteria(IDENTIFIER_VALUE).is(identifier.getValue()));
        return this;
    }

    CriteriaBuilder withPatient(ReferenceParam patient) {
        addClause(patient, () -> getCriteria(IDX_PATIENT).is(new DBRef(IDX_PATIENT_COLLECTION, patient.getValue())));
        return this;
    }

    CriteriaBuilder withType(String typeCodingFieldName, String typeSystemFieldName, TokenOrListParam typeOrList) {
        return withCoding(typeCodingFieldName, typeSystemFieldName, typeOrList);
    }

    public CriteriaBuilder withSetting(TokenOrListParam setting) {
        if (isNotNull(setting)) {
            return withCoding(PRACTICE_CODING_CODE, PRACTICE_CODING_SYSTEM, setting);
        }
        return this;
    }

    private CriteriaBuilder withCoding(String typeCodingFieldName, String typeSystemFieldName, TokenOrListParam typeOrList) {
        if (isNotNull(typeOrList)) {
            typeOrList.getValuesAsQueryTokens().forEach(type -> {
                addClause(type, () -> getCriteria(typeCodingFieldName).is(type.getValue()));
                addClause(type, () -> getCriteria(typeSystemFieldName).is(type.getSystem()));
            });
        }
        return this;
    }

    public CriteriaBuilder withDateRange(DateRangeParam dateRange) {
        return withDateRange("date", dateRange);
    }

    public CriteriaBuilder withCreatedDate(DateRangeParam createdDate) {
        return withDateRange(CREATED_DATE, createdDate);
    }

    private CriteriaBuilder withDateRange(String dateFieldName, DateRangeParam dateRange) {
        if (isNotNull(dateRange)) {
            if (hasLowerAndUpperBound(dateRange)) {
                addClause(dateRange, () -> getCriteria(dateFieldName).gte(dateRange.getLowerBound().getValue()).lte(dateRange.getUpperBound().getValue()));
            } else {
                if (hasLowerBound(dateRange)) {
                    withDateParam(dateFieldName, dateRange.getLowerBound());
                } else {
                    withDateParam(dateFieldName, dateRange.getUpperBound());
                }
            }
        }
        return this;
    }

    public CriteriaBuilder withPeriod(DateRangeParam period) {
        if (isNotNull(period)) {
            if (hasLowerAndUpperBound(period)) {
                addClause(period, () -> getCriteria(PERIOD_START).is(period.getLowerBound().getValue()));
                addClause(period, () -> getCriteria(PERIOD_END).is(period.getUpperBound().getValue()));
            } else {
                if (hasLowerBound(period)) {
                    withDateParam(PERIOD_START, period.getLowerBound());
                } else {
                    withDateParam(PERIOD_END, period.getUpperBound());
                }
            }
        }
        return this;
    }

    private void withDateParam(String dateFieldName, DateParam dateParam) {
        switch (dateParam.getPrefix()) {
            case EQUAL:
                addClause(dateParam, () -> getCriteria(dateFieldName).is(dateParam.getValue()));
                break;
            case GREATERTHAN_OR_EQUALS:
                addClause(dateParam, () -> getCriteria(dateFieldName).gte(dateParam.getValue()));
                break;
            case GREATERTHAN:
            case STARTS_AFTER:
                addClause(dateParam, () -> getCriteria(dateFieldName).gt(dateParam.getValue()));
                break;
            case LESSTHAN_OR_EQUALS:
                addClause(dateParam, () -> getCriteria(dateFieldName).lte(dateParam.getValue()));
                break;
            case LESSTHAN:
            case ENDS_BEFORE:
                addClause(dateParam, () -> getCriteria(dateFieldName).lt(dateParam.getValue()));
                break;
            default:
                break;
        }
    }

    private boolean hasLowerAndUpperBound(DateRangeParam dateRange) {
        return isNotNull(dateRange.getLowerBound()) && GREATERTHAN_OR_EQUALS == dateRange.getLowerBound().getPrefix() &&
                isNotNull(dateRange.getUpperBound()) && LESSTHAN_OR_EQUALS == dateRange.getUpperBound().getPrefix();
    }

    private boolean hasLowerBound(DateRangeParam dateRange) {
        return isNotNull(dateRange.getLowerBound());
    }

    Criteria build() {
        return criteria;
    }

    private void addClause(Object parameterObject, Supplier<Criteria> clause) {
        if (isNotNull(parameterObject)) {
            criteria = clause.get();
        }
    }

    private Criteria getCriteria(String parameter) {
        if (criteria == null) {
            return Criteria.where(parameter);

        } else {
            return criteria.and(parameter);
        }
    }

    private boolean isNotNull(Object parameterObject) {
        return parameterObject != null;
    }

}