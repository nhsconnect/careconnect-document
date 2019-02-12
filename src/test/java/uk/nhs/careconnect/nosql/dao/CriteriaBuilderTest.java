package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.rest.param.DateParam;
import ca.uhn.fhir.rest.param.DateRangeParam;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenOrListParam;
import ca.uhn.fhir.rest.param.TokenParam;
import com.mongodb.DBRef;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;
import org.springframework.data.mongodb.core.query.Criteria;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Date;

import static ca.uhn.fhir.rest.param.ParamPrefixEnum.ENDS_BEFORE;
import static ca.uhn.fhir.rest.param.ParamPrefixEnum.EQUAL;
import static ca.uhn.fhir.rest.param.ParamPrefixEnum.GREATERTHAN;
import static ca.uhn.fhir.rest.param.ParamPrefixEnum.GREATERTHAN_OR_EQUALS;
import static ca.uhn.fhir.rest.param.ParamPrefixEnum.LESSTHAN;
import static ca.uhn.fhir.rest.param.ParamPrefixEnum.LESSTHAN_OR_EQUALS;
import static ca.uhn.fhir.rest.param.ParamPrefixEnum.STARTS_AFTER;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.core.IsNull.nullValue;
import static org.junit.Assert.assertThat;
import static uk.nhs.careconnect.nosql.dao.CriteriaBuilder.aCriteriaBuilder;

public class CriteriaBuilderTest {

    private CriteriaBuilder criteriaBuilder;
    private Date aDate;

    @Before
    public void eachTest() {
        criteriaBuilder = aCriteriaBuilder();
        aDate = Date.from(OffsetDateTime.now(ZoneOffset.UTC).toInstant());
    }

    @Test
    public void whenACriteriaBuilderIsCall_thenACriteriaBuilderIsReturned() {
        CriteriaBuilder criteriaBuilder = aCriteriaBuilder();
        assertThat(criteriaBuilder, is(notNullValue()));
    }

    @Test
    public void givenACriteriaBuilder_whenWithIdIsCalledWithAValue_thenCriteriaIsBuilt() {
        //setup
        CriteriaBuilder criteriaBuilder = aCriteriaBuilder();
        TokenParam resid = new TokenParam();
        resid.setValue("123456789012345678901234");

        //when
        criteriaBuilder.withId(resid);
        Criteria criteria = criteriaBuilder.build();

        //then
        assertThat(criteria, is(notNullValue()));
        assertThat(criteria.getCriteriaObject().get("_id"), is(new ObjectId("123456789012345678901234")));
    }

    @Test
    public void givenACriteriaBuilder_whenWithIdIsCalledWithANullValue_thenCriteriaNotBuilt() {
        //setup
        CriteriaBuilder criteriaBuilder = aCriteriaBuilder();

        //when
        criteriaBuilder.withId(null);
        Criteria criteria = criteriaBuilder.build();

        //then
        assertThat(criteria, is(nullValue()));
    }

    @Test
    public void givenACriteriaBuilder_whenWithIdentifierIsCalledWithSystemAndValueIdentifier_thenCriteriaIsBuilt() {
        //setup
        CriteriaBuilder criteriaBuilder = aCriteriaBuilder();
        TokenParam identifier = new TokenParam();
        identifier.setSystem("system-1");
        identifier.setValue("value-1");

        //when
        criteriaBuilder.withIdentifier(identifier);
        Criteria criteria = criteriaBuilder.build();

        //then
        assertThat(criteria, is(notNullValue()));
        assertThat(criteria.getCriteriaObject().get("identifier.system"), is(notNullValue()));
        assertThat(criteria.getCriteriaObject().get("identifier.value"), is(notNullValue()));
    }

    @Test
    public void givenACriteriaBuilder_whenWithIdentifierIsCalledWithOnlySystemIdentifier_thenCriteriaIsBuilt() {
        //setup
        CriteriaBuilder criteriaBuilder = aCriteriaBuilder();
        TokenParam identifier = new TokenParam();
        identifier.setSystem("system-1");

        //when
        criteriaBuilder.withIdentifier(identifier);
        Criteria criteria = criteriaBuilder.build();

        //then
        assertThat(criteria, is(notNullValue()));
        assertThat(criteria.getCriteriaObject().get("identifier.system"), is(notNullValue()));
        assertThat(criteria.getCriteriaObject().get("identifier.value"), is(nullValue()));
    }

    @Test
    public void givenACriteriaBuilder_whenWithIdentifierIsCalledWithANullValue_thenCriteriaNotBuilt() {
        //setup
        CriteriaBuilder criteriaBuilder = aCriteriaBuilder();

        //when
        criteriaBuilder.withIdentifier(null);
        Criteria criteria = criteriaBuilder.build();

        //then
        assertThat(criteria, is(nullValue()));
    }

    @Test
    public void givenACriteriaBuilder_whenWithPatientIsCalledWithAValue_thenCriteriaIsBuilt() {
        //setup
        DBRef expectedCriteria = new DBRef("idxPatient", "patient-1");

        CriteriaBuilder criteriaBuilder = aCriteriaBuilder();
        ReferenceParam referenceParam = new ReferenceParam();
        referenceParam.setValue("patient-1");

        //when
        criteriaBuilder.withPatient(referenceParam);
        Criteria criteria = criteriaBuilder.build();

        //then
        assertThat(criteria, is(notNullValue()));
        assertThat(criteria.getCriteriaObject().get("idxPatient"), is(expectedCriteria));
    }

    @Test
    public void givenACriteriaBuilder_whenWithPatientIsCalledWithANullValue_thenCriteriaNotBuilt() {
        //setup
        CriteriaBuilder criteriaBuilder = aCriteriaBuilder();

        //when
        criteriaBuilder.withPatient(null);
        Criteria criteria = criteriaBuilder.build();

        //then
        assertThat(criteria, is(nullValue()));
    }

    @Test
    public void givenACriteriaBuilder_whenWithTypeIsCalledWithOnlyCode_thenCriteriaIsBuilt() {
        //setup
        CriteriaBuilder criteriaBuilder = aCriteriaBuilder();
        TokenParam code = new TokenParam();
        code.setValue("code-1");
        TokenOrListParam tokenOrListParam = new TokenOrListParam();
        tokenOrListParam.add(code);

        //when
        criteriaBuilder.withType("type.code", "type.system", tokenOrListParam);
        Criteria criteria = criteriaBuilder.build();

        //then
        assertThat(criteria, is(notNullValue()));
        assertThat(criteria.getCriteriaObject().get("type.code"), is("code-1"));
        assertThat(criteria.getCriteriaObject().get("type.system"), is(nullValue()));
    }

    @Test
    public void givenACriteriaBuilder_whenWithTypeIsCalledWithCodeAndSystem_thenCriteriaIsBuilt() {
        //setup
        CriteriaBuilder criteriaBuilder = aCriteriaBuilder();
        TokenOrListParam tokenOrListParam = new TokenOrListParam();
        tokenOrListParam.add("system-1", "code-1");

        //when
        criteriaBuilder.withType("type.code", "type.system", tokenOrListParam);
        Criteria criteria = criteriaBuilder.build();

        //then
        assertThat(criteria, is(notNullValue()));
        assertThat(criteria.getCriteriaObject().get("type.code"), is("code-1"));
        assertThat(criteria.getCriteriaObject().get("type.system"), is("system-1"));
    }

    @Test
    public void givenACriteriaBuilder_whenWithTypeIsCalledWithANullValue_thenCriteriaNotBuilt() {
        //setup
        CriteriaBuilder criteriaBuilder = aCriteriaBuilder();

        //when
        criteriaBuilder.withType(null, null, null);
        Criteria criteria = criteriaBuilder.build();

        //then
        assertThat(criteria, is(nullValue()));
    }

    @Test
    public void givenACriteriaBuilder_whenWithDateRangeIsCalledWithTwoBetweenDate_thenCriteriaBuilt() {
        //setup
        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        Date yesterday = Date.from(now.minusDays(1).toInstant());
        Date tomorrow = Date.from(now.plusDays(1).toInstant());

        testWithDate(new DateRangeParam(yesterday, tomorrow), Criteria.where("date").gte(yesterday).lte(tomorrow));
    }

    @Test
    public void givenACriteriaBuilder_whenWithDateRangeIsCalledWithEqualsOneDate_thenCriteriaBuilt() {
        testWithDate(new DateRangeParam(new DateParam(EQUAL, aDate)), Criteria.where("date").is(aDate));
    }

    //TODO: It's not possible to have NOT_EQUAL in a DateRangeParam, only in a DateParam
//    @Test
//    public void givenACriteriaBuilder_whenWithDateRangeIsCalledWithNotEqualsOneDate_thenCriteriaNotBuilt() {
//        testWithDate(new DateRangeParam(new DateParam(NOT_EQUAL, aDate)), Criteria.where("date").ne(aDate));
//    }

    @Test
    public void givenACriteriaBuilder_whenWithDateRangeIsCalledWithGreaterThanOrEqualsOneDate_thenCriteriaBuilt() {
        testWithDate(new DateRangeParam(new DateParam(GREATERTHAN_OR_EQUALS, aDate)), Criteria.where("date").gte(aDate));
    }

    @Test
    public void givenACriteriaBuilder_whenWithDateRangeIsCalledWithGreaterThanOneDate_thenCriteriaBuilt() {
        testWithDate(new DateRangeParam(new DateParam(GREATERTHAN, aDate)), Criteria.where("date").gt(aDate));
    }

    @Test
    public void givenACriteriaBuilder_whenWithDateRangeIsCalledWithStartsAfterOneDate_thenCriteriaBuilt() {
        testWithDate(new DateRangeParam(new DateParam(STARTS_AFTER, aDate)), Criteria.where("date").gt(aDate));
    }

    @Test
    public void givenACriteriaBuilder_whenWithDateRangeIsCalledWithLessThanOrEqualsOneDate_thenCriteriaBuilt() {
        testWithDate(new DateRangeParam(new DateParam(LESSTHAN_OR_EQUALS, aDate)), Criteria.where("date").lte(aDate));
    }

    @Test
    public void givenACriteriaBuilder_whenWithDateRangeIsCalledWithLessThanOneDate_thenCriteriaBuilt() {
        testWithDate(new DateRangeParam(new DateParam(LESSTHAN, aDate)), Criteria.where("date").lt(aDate));
    }

    @Test
    public void givenACriteriaBuilder_whenWithDateRangeIsCalledWithEndsBeforeOneDate_thenCriteriaBuilt() {
        testWithDate(new DateRangeParam(new DateParam(ENDS_BEFORE, aDate)), Criteria.where("date").lt(aDate));
    }

    @Test
    public void givenACriteriaBuilder_whenWithCreatedDateRangeIsCalledWithEndsBeforeOneDate_thenCriteriaBuilt() {
        testWithCreatedDate(new DateRangeParam(new DateParam(ENDS_BEFORE, aDate)), Criteria.where("createdDate").lt(aDate));
    }

    @Test
    public void givenACriteriaBuilder_whenWithPeriodIsCalledWithEquals_thenCriteriaBuilt() {
        testWithPeriod(new DateRangeParam(new DateParam(EQUAL, aDate)), Criteria.where("period.start").is(aDate));
    }

    @Test
    public void givenACriteriaBuilder_whenWithPeriodIsCalledWithAfter_thenCriteriaBuilt() {
        testWithPeriod(new DateRangeParam(new DateParam(GREATERTHAN, aDate)), Criteria.where("period.start").gt(aDate));
    }

    @Test
    public void givenACriteriaBuilder_whenWithPeriodIsCalledWithAfterOrEquals_thenCriteriaBuilt() {
        testWithPeriod(new DateRangeParam(new DateParam(GREATERTHAN_OR_EQUALS, aDate)), Criteria.where("period.start").gte(aDate));
    }

    @Test
    public void givenACriteriaBuilder_whenWithPeriodIsCalledWithBefore_thenCriteriaBuilt() {
        testWithPeriod(new DateRangeParam(new DateParam(LESSTHAN, aDate)), Criteria.where("period.end").lt(aDate));
    }

    @Test
    public void givenACriteriaBuilder_whenWithPeriodIsCalledWithBeforeOrEquals_thenCriteriaBuilt() {
        testWithPeriod(new DateRangeParam(new DateParam(LESSTHAN_OR_EQUALS, aDate)), Criteria.where("period.end").lte(aDate));
    }

    @Test
    public void givenACriteriaBuilder_whenWithSettingIsCalled_thenCriteriaBuilt() {
        //setup
        CriteriaBuilder criteriaBuilder = aCriteriaBuilder();
        TokenOrListParam setting = new TokenOrListParam();
        setting.add("system-1", "code-1");

        //when
        criteriaBuilder.withSetting(setting);
        Criteria criteria = criteriaBuilder.build();

        //then
        assertThat(criteria, is(notNullValue()));
        assertThat(criteria.getCriteriaObject().get("practice.coding.code"), is("code-1"));
        assertThat(criteria.getCriteriaObject().get("practice.coding.system"), is("system-1"));
    }

    private void testWithDate(DateRangeParam dateRangeParam, Criteria expectedCriteria) {
        //when
        criteriaBuilder.withDateRange(dateRangeParam);
        Criteria criteria = criteriaBuilder.build();

        //then
        assertThat(criteria, is(notNullValue()));
        assertThat(criteria.getCriteriaObject(), is(expectedCriteria.getCriteriaObject()));
    }

    private void testWithCreatedDate(DateRangeParam dateRangeParam, Criteria expectedCriteria) {
        //when
        criteriaBuilder.withCreatedDate(dateRangeParam);
        Criteria criteria = criteriaBuilder.build();

        //then
        assertThat(criteria, is(notNullValue()));
        assertThat(criteria.getCriteriaObject(), is(expectedCriteria.getCriteriaObject()));
    }

    private void testWithPeriod(DateRangeParam dateRangeParam, Criteria expectedCriteria) {
        //when
        criteriaBuilder.withPeriod(dateRangeParam);
        Criteria criteria = criteriaBuilder.build();

        //then
        assertThat(criteria, is(notNullValue()));
        assertThat(criteria.getCriteriaObject(), is(expectedCriteria.getCriteriaObject()));
    }

}