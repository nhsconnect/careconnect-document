package nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.param.DateRangeParam;
import ca.uhn.fhir.rest.param.StringParam;
import ca.uhn.fhir.rest.param.TokenParam;
import org.hl7.fhir.dstu3.model.Resource;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.data.mongodb.core.MongoOperations;
import uk.nhs.careconnect.nosql.dao.PatientDao;
import uk.nhs.careconnect.nosql.dao.transform.PatientEntityToFHIRPatient;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

@RunWith(MockitoJUnitRunner.class)
public class PatientDaoTest {

    @Mock
    private MongoOperations mongo;

    @Mock
    private PatientEntityToFHIRPatient patientEntityToFHIRPatient;

    @Mock
    private FhirContext ctx;

    @InjectMocks
    private PatientDao patientDao;

    @Test
    public void givenASearchRequestIsMade_withAValidPostCode_shouldReturnAResponse() {
//        when(mongo.find())
        List<Resource> resources = patientDao.search(ctx, new StringParam("LS11AR"), null, null, null, null, null, null, null, null);
        assertThat(resources.size(), is(1));
    }

    @Test
    public void givenASearchRequestIsMade_withAInValidPostCode_shouldNotReturnAResponse() {
        List<Resource> resources = patientDao.search(ctx, new StringParam("das"), null, null, null, null, null, null, null, null);
        assertThat(resources.size(), is(0));
    }

    @Test
    public void givenASearchRequestIsMade_withAValidDateRange_shouldReturnAResponse() {
        Date startDate = Date.from(LocalDate.of(2018, 03,01).atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endDate = Date.from(LocalDate.of(2018, 03,31).atStartOfDay(ZoneId.systemDefault()).toInstant());
        List<Resource> resources = patientDao.search(ctx, null, new DateRangeParam(startDate, endDate), null, null, null, null, null, null, null);
        assertThat(resources.size(), is(1));
    }

    @Test
    public void givenASearchRequestIsMade_withAInValidDateRange_shouldNotReturnAResponse() {
        Date startDate = Date.from(LocalDate.of(2018, 03,01).atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endDate = Date.from(LocalDate.of(2018, 03,01).atStartOfDay(ZoneId.systemDefault()).toInstant());
        List<Resource> resources = patientDao.search(ctx, null, new DateRangeParam(startDate, endDate), null, null, null, null, null, null, null);
        assertThat(resources.size(), is(0));
    }

    @Test
    public void givenASearchRequestIsMade_withAValidEmail_shouldReturnAResponse() {
        List<Resource> resources = patientDao.search(ctx, null, null, new TokenParam("test@test.com"), null, null, null, null, null, null);
        assertThat(resources.size(), is(1));
    }

    @Test
    public void givenASearchRequestIsMade_withAInValidEmail_shouldNotReturnAResponse() {
        List<Resource> resources = patientDao.search(ctx, null, null, new TokenParam("test1@test.com"), null, null, null, null, null, null);
        assertThat(resources.size(), is(0));
    }

    @Test
    public void givenASearchRequestIsMade_withAValidFamilyName_shouldReturnAResponse() {
        List<Resource> resources = patientDao.search(ctx, null, null, null, new StringParam("test"), null, null, null, null, null);
        assertThat(resources.size(), is(1));
    }

    @Test
    public void givenASearchRequestIsMade_withAInValidFamilyName_shouldNotReturnAResponse() {
        List<Resource> resources = patientDao.search(ctx, null, null, null, new StringParam("test1"), null, null, null, null, null);
        assertThat(resources.size(), is(0));
    }

    @Test
    public void givenASearchRequestIsMade_withAValidMaleGender_shouldReturnAResponse() {
        List<Resource> resources = patientDao.search(ctx, null, null, null, null, new TokenParam("Male"), null, null, null, null);
        assertThat(resources.size(), is(1));
    }

    @Test
    public void givenASearchRequestIsMade_withAValidFemaleGender_shouldNotReturnAResponse() {
        List<Resource> resources = patientDao.search(ctx, null, null, null, null, new TokenParam("Female"), null, null, null, null);
        assertThat(resources.size(), is(1));
    }

    @Test
    public void givenASearchRequestIsMade_withAInValidGender_shouldNotReturnAResponse() {
        List<Resource> resources = patientDao.search(ctx, null, null, null, null, new TokenParam("test"), null, null, null, null);
        assertThat(resources.size(), is(0));
    }

    @Test
    public void givenASearchRequestIsMade_withAValidForeName_shouldNotReturnAResponse() {
        List<Resource> resources = patientDao.search(ctx, null, null, null, null, null, new StringParam("test"), null, null, null);
        assertThat(resources.size(), is(1));
    }

    @Test
    public void givenASearchRequestIsMade_withAInValidForeName_shouldNotReturnAResponse() {
        List<Resource> resources = patientDao.search(ctx, null, null, null, null, null, new StringParam("test1"), null, null, null);
        assertThat(resources.size(), is(0));
    }

    @Test
    public void givenASearchRequestIsMade_withAValidName_shouldNotReturnAResponse() {
        List<Resource> resources = patientDao.search(ctx, null, null, null, null, null, null, null, new StringParam("Test test"), null);
        assertThat(resources.size(), is(1));
    }

    @Test
    public void givenASearchRequestIsMade_withAInValidName_shouldNotReturnAResponse() {
        List<Resource> resources = patientDao.search(ctx, null, null, null, null, null, null, null, new StringParam("Test1 test"), null);
        assertThat(resources.size(), is(0));
    }

    @Test
    public void givenASearchRequestIsMade_withAValidId_shouldNotReturnAResponse() {
        List<Resource> resources = patientDao.search(ctx, null, null, null, null, null, null, new TokenParam("1"), null, null);
        assertThat(resources.size(), is(1));
    }

    @Test
    public void givenASearchRequestIsMade_withAInValidId_shouldNotReturnAResponse() {
        List<Resource> resources = patientDao.search(ctx, null, null, null, null, null, null, new TokenParam("2"), null, null);
        assertThat(resources.size(), is(0));
    }


}