package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.rest.param.DateParam;
import ca.uhn.fhir.rest.param.DateRangeParam;
import ca.uhn.fhir.rest.param.ParamPrefixEnum;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenOrListParam;
import ca.uhn.fhir.rest.param.TokenParam;
import com.mongodb.DBRef;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.OperationOutcome;
import org.hl7.fhir.dstu3.model.Resource;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import uk.nhs.careconnect.nosql.entities.CompositionEntity;
import uk.nhs.careconnect.nosql.entities.DocumentReferenceEntity;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class DocumentReferenceDaoTest extends AbstractDaoTest {

    @Autowired
    private IDocumentReference documentReferenceDao;

    private CompositionEntity compositionEntity;
    private String compositionId;
    private String patientId;
    private DocumentReferenceEntity documentReferenceEntity;
    private String documentReferenceId;

    @Before
    public void eachTest() {
        loadAndCreateBundle();
        loadCompositionEntity();
        loadDocumentReference();
    }

// period, patient, setting, _id and identifier

    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWith_Id_aListOfRelevantResourcesShouldBeReturned() {
        //setup
        TokenParam _id = new TokenParam();
        _id.setValue(documentReferenceId);

        //when
        List<Resource> resources = documentReferenceDao.search(ctx, _id, null, null, null, null, null, null, null);

        //then
        assertThat(resources.get(0).getId(), is(documentReferenceId));
    }

    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWithDate_aListOfRelevantResourcesShouldBeReturned() {
        //setup
        OffsetDateTime createdDate = OffsetDateTime.parse("2018-11-29T09:01:43+00:00");
        Date yesterday = Date.from(createdDate.minusDays(1).toInstant());
        Date tomorrow = Date.from(createdDate.plusDays(1).toInstant());

        DateRangeParam createdDateRange = new DateRangeParam(yesterday, tomorrow);

        //when
        List<Resource> resources = documentReferenceDao.search(ctx, null, null, null, createdDateRange, null, null, null, null);

        //then
        assertThat(resources.get(0).getId(), is(documentReferenceId));
    }

    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWithType_aListOfRelevantResourcesShouldBeReturned() {
        //setup
        TokenOrListParam type = new TokenOrListParam("http://snomed.info/sct", "736373009");

        //when
        List<Resource> resources = documentReferenceDao.search(ctx, null, null, null, null, type, null, null, null);

        //then
        assertThat(resources.get(0).getId(), is(documentReferenceId));
    }

    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWithPatient_aListOfRelevantResourcesShouldBeReturned() {
        //setup
        ReferenceParam patient = new ReferenceParam();
        patient.setValue(compositionEntity.getIdxPatient().getId().toString());

        //when
        List<Resource> resources = documentReferenceDao.search(ctx, null, null, patient, null, null, null, null, null);

        //then
        assertThat(resources.get(0).getId(), is(documentReferenceId));
    }

    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWithIdentifier_aListOfRelevantResourcesShouldBeReturned() {
        //setup
        TokenParam identifier = new TokenParam("https://fhir.yas.nhs.uk/DocumentReference/Identifier", "1");

        //when
        List<Resource> resources = documentReferenceDao.search(ctx, null, identifier, null, null, null, null, null, null);

        //then
        assertThat(resources.get(0).getId(), is(documentReferenceId));
    }

    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWithSetting_aListOfRelevantResourcesShouldBeReturned() {
        //setup
        TokenOrListParam setting = new TokenOrListParam("http://snomed.info/sct", "103735009");

        //when
        List<Resource> resources = documentReferenceDao.search(ctx, null, null, null, null, null, setting, null, null);

        //then
        assertThat(resources.get(0).getId(), is(documentReferenceId));
    }

    @Test
    public void givenABundleStoredInMongo_whenSearchIsCalledWithPeriod_aListOfRelevantResourcesShouldBeReturned() {
        //setup
        DateRangeParam periodStart = aPeriodStart();
        DateRangeParam periodEnd = aPeriodEnd();

        //when
        List<Resource> resources = documentReferenceDao.search(ctx, null, null, null, null, null, null, periodStart, periodEnd);

        //then
        assertThat(resources.get(0).getId(), is(documentReferenceId));
    }

    private DateRangeParam aPeriodStart() {
        LocalDateTime start = LocalDateTime.parse("2018-11-29T08:01:42");

        DateParam startDateParam = new DateParam(ParamPrefixEnum.GREATERTHAN_OR_EQUALS, localDateTimeToDate(start));

        return new DateRangeParam(startDateParam);
    }

    private DateRangeParam aPeriodEnd() {
        LocalDateTime end = LocalDateTime.parse("2018-11-29T08:06:42");

        DateParam endDateParam = new DateParam(ParamPrefixEnum.LESSTHAN_OR_EQUALS, localDateTimeToDate(end));

        return new DateRangeParam(endDateParam);
    }

    private Date localDateTimeToDate(LocalDateTime localDateTime) {
        return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }

    private void loadAndCreateBundle() {
        Bundle bundle = loadBundle("9658218873.xml");
        OperationOutcome operationOutcome = bundleDao.create(ctx, bundle, null, null);

        compositionId = operationOutcome.getId().split("/")[1];
    }

    private void loadCompositionEntity() {
        Query qry = Query.query(Criteria.where("_id").is(compositionId));

        compositionEntity = mongoTemplate.findOne(qry, CompositionEntity.class);

        patientId = compositionEntity.getIdxPatient().getId().toString();
    }

    private void loadDocumentReference() {
        Query qry = Query.query(Criteria.where("idxPatient").is(new DBRef("idxPatient", patientId)));

        documentReferenceEntity = mongoTemplate.findOne(qry, DocumentReferenceEntity.class);

        documentReferenceId = documentReferenceEntity.getId();
    }
}