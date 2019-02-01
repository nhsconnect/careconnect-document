package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenOrListParam;
import ca.uhn.fhir.rest.param.TokenParam;
import com.mongodb.DBRef;
import org.bson.types.ObjectId;
import org.junit.Test;
import org.springframework.data.mongodb.core.query.Criteria;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.core.IsNull.nullValue;
import static org.junit.Assert.assertThat;
import static uk.nhs.careconnect.nosql.dao.CriteriaBuilder.aCriteriaBuilder;

public class CriteriaBuilderTest {

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
        criteriaBuilder.withType(tokenOrListParam);
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
        criteriaBuilder.withType(tokenOrListParam);
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
        criteriaBuilder.withType(null);
        Criteria criteria = criteriaBuilder.build();

        //then
        assertThat(criteria, is(nullValue()));
    }

    //TODO: this needs to be done again
    @Test
    public void withDateRange() {
    }

    @Test
    public void build() {
    }
}