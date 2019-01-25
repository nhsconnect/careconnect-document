package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.param.DateRangeParam;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.StringParam;
import ca.uhn.fhir.rest.param.TokenParam;
import com.mongodb.MongoClient;
import de.flapdoodle.embed.mongo.MongodExecutable;
import de.flapdoodle.embed.mongo.MongodProcess;
import de.flapdoodle.embed.mongo.MongodStarter;
import de.flapdoodle.embed.mongo.config.IMongodConfig;
import de.flapdoodle.embed.mongo.config.MongodConfigBuilder;
import de.flapdoodle.embed.mongo.config.Net;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.process.runtime.Network;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.OperationOutcome;
import org.hl7.fhir.dstu3.model.Patient;
import org.hl7.fhir.dstu3.model.Resource;
import org.hl7.fhir.dstu3.model.codesystems.AdministrativeGender;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import uk.nhs.careconnect.nosql.dao.PatientDao;
import uk.nhs.careconnect.nosql.dao.transform.PatientEntityToFHIRPatient;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.fail;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = {TestConfig.class})
public class PatientDaoTest {

    @Autowired
    FhirContext ctx;

    @Autowired
    IBundle bundleDao;

    @Autowired
    IComposition compositionDao;

    @Autowired
    private PatientDao patientDao;


    private static final String DATABASE_NAME = "test-mongo-db";
    private MongodExecutable mongodExe;
    private MongodProcess mongod;
    private MongoClient mongo;
    private MongoTemplate mongoTemplate;

    @Before
    public void beforeEach() throws Exception {
        MongodStarter starter = MongodStarter.getDefaultInstance();
        String bindIp = "localhost";
        int port = 12345;
        IMongodConfig mongodConfig = new MongodConfigBuilder()
                .version(Version.Main.PRODUCTION)
                .net(new Net(bindIp, port, Network.localhostIsIPv6()))
                .build();
        this.mongodExe = starter.prepare(mongodConfig);
        this.mongod = mongodExe.start();
        this.mongo = new MongoClient(bindIp, port);
        this.mongoTemplate = new MongoTemplate(new MongoClient(bindIp, port), DATABASE_NAME);
    }

    @After
    public void afterEach() throws Exception {
        if (this.mongod != null) {
            this.mongod.stop();
            this.mongodExe.stop();
        }
    }
    @Test
    public void givenASearchRequestIsMade_withAValidPostCode_shouldReturnAResponse() {
        createBundle("raw-bundle-2-postcodes.xml");
        List<Resource> resources = patientDao.search(ctx, new StringParam("LS1 1GF"), null, null, null, null, null, null, null, null);
        assertThat(resources.size(), is(1));
        assertThat(((Patient) resources.get(0)).getAddress().get(0).getPostalCode(), is("LS1 1GF"));
    }

    @Test
    public void givenASearchRequestIsMade_withAInValidPostCode_shouldNotReturnAResponse() {
        createBundle("raw-bundle-2-postcodes.xml");
        List<Resource> resources = patientDao.search(ctx, new StringParam("LS9 1GH"), null, null, null, null, null, null, null, null);
        assertThat(resources.size(), is(0));
    }

    @Test
    public void givenASearchRequestIsMade_withAValidDateRange_shouldReturnAResponse() {
        createBundle("raw-bundle-2-postcodes.xml");
        Date startDate = Date.from(LocalDate.of(1963, 01,01).atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endDate = Date.from(LocalDate.of(1965, 01,01).atStartOfDay(ZoneId.systemDefault()).toInstant());
        List<Resource> resources = patientDao.search(ctx, null, new DateRangeParam(startDate, endDate), null, null, null, null, null, null, null);
        assertThat(resources.size(), is(1));
        assertThat(((Patient) resources.get(0)).getAddress().get(0).getPostalCode(), is("LS1 1GF"));
    }

    @Test
    public void givenASearchRequestIsMade_withAInValidDateRange_shouldNotReturnAResponse() {
        createBundle("raw-bundle-2-postcodes.xml");
        Date startDate = Date.from(LocalDate.of(2018, 03,01).atStartOfDay(ZoneId.systemDefault()).toInstant());
        Date endDate = Date.from(LocalDate.of(2018, 03,01).atStartOfDay(ZoneId.systemDefault()).toInstant());
        List<Resource> resources = patientDao.search(ctx, null, new DateRangeParam(startDate, endDate), null, null, null, null, null, null, null);
        assertThat(resources.size(), is(0));
    }

    @Test
    public void givenASearchRequestIsMade_withAValidEmail_shouldReturnAResponse() {
        createBundle("raw-bundle-2-postcodes.xml");
        List<Resource> resources = patientDao.search(ctx, null, null, new TokenParam("test@test.com"), null, null, null, null, null, null);
        assertThat(resources.size(), is(1));
        assertThat(((Patient) resources.get(0)).getTelecom().size(), is(2));
        assertThat(((Patient) resources.get(0)).getTelecom().get(0).getValue(), is("test@test.com"));
        assertThat(((Patient) resources.get(0)).getTelecom().get(0).getSystem().getDisplay(), is("Email"));
    }

    @Test
    public void givenASearchRequestIsMade_withAInValidEmail_shouldNotReturnAResponse() {
        createBundle("raw-bundle-2-postcodes.xml");
        List<Resource> resources = patientDao.search(ctx, null, null, new TokenParam("test1@test.com"), null, null, null, null, null, null);
        assertThat(resources.size(), is(0));
    }

    @Test
    public void givenASearchRequestIsMade_withAValidPhone_shouldReturnAResponse() {
        createBundle("raw-bundle-2-postcodes.xml");
        List<Resource> resources = patientDao.search(ctx, null, null, null, null, null, null, null, null, new TokenParam("123456789"));
        assertThat(resources.size(), is(1));
        assertThat(((Patient) resources.get(0)).getTelecom().size(), is(2));
        assertThat(((Patient) resources.get(0)).getTelecom().get(1).getValue(), is("123456789"));
        assertThat(((Patient) resources.get(0)).getTelecom().get(1).getSystem().getDisplay(), is("Phone"));
    }

    @Test
    public void givenASearchRequestIsMade_withAInValidPhone_shouldNotReturnAResponse() {
        createBundle("raw-bundle-2-postcodes.xml");
        List<Resource> resources = patientDao.search(ctx, null, null, null, null, null, null, null, null, new TokenParam("111111111"));
        assertThat(resources.size(), is(0));
    }


    @Test
    public void givenASearchRequestIsMade_withAValidFamilyName_shouldReturnAResponse() {
        createBundle("raw-bundle-2-postcodes.xml");
        List<Resource> resources = patientDao.search(ctx, null, null, null, new StringParam("test"), null, null, null, null, null);
        assertThat(resources.size(), is(1));
        assertThat(((Patient) resources.get(0)).getName().size(), is(1));
        assertThat(((Patient) resources.get(0)).getName().get(0).getFamily(), is("Test"));
    }

    @Test
    public void givenASearchRequestIsMade_withAInValidFamilyName_shouldNotReturnAResponse() {
        createBundle("raw-bundle-2-postcodes.xml");
        List<Resource> resources = patientDao.search(ctx, null, null, null, new StringParam("wrong"), null, null, null, null, null);
        assertThat(resources.size(), is(0));
    }

    @Test
    public void givenASearchRequestIsMade_withAValidMaleGender_shouldReturnAResponse() {
        createBundle("raw-bundle-2-postcodes.xml");
        List<Resource> resources = patientDao.search(ctx, null, null, null, null, new TokenParam("Male"), null, null, null, null);
        assertThat(resources.size(), is(1));
        assertThat(((Patient) resources.get(0)).getGender().getDisplay(), is(AdministrativeGender.MALE.getDisplay()));
    }

    @Test
    public void givenASearchRequestIsMade_withAValidFemaleGender_shouldNotReturnAResponse() {
        createBundle("raw-bundle-2-postcodes.xml");
        List<Resource> resources = patientDao.search(ctx, null, null, null, null, new TokenParam("Female"), null, null, null, null);
        assertThat(resources.size(), is(1));
        assertThat(((Patient) resources.get(0)).getGender().getDisplay(), is(AdministrativeGender.FEMALE.getDisplay()));
    }

    @Test
    public void givenASearchRequestIsMade_withAInValidGender_shouldNotReturnAResponse() {
        createBundle("raw-bundle-2-postcodes.xml");
        List<Resource> resources = patientDao.search(ctx, null, null, null, null, new TokenParam("test"), null, null, null, null);
        assertThat(resources.size(), is(0));
    }

    @Test
    public void givenASearchRequestIsMade_withAValidForeName_shouldReturnAResponse() {
        createBundle("raw-bundle-2-postcodes.xml");
        List<Resource> resources = patientDao.search(ctx, null, null, null, null, null, new StringParam("test"), null, null, null);
        assertThat(resources.size(), is(1));
        assertThat(((Patient) resources.get(0)).getName().size(), is(1));
        assertThat(((Patient) resources.get(0)).getName().get(0).getGivenAsSingleString(), is("Test"));
    }

    @Test
    public void givenASearchRequestIsMade_withAInValidForeName_shouldNotReturnAResponse() {
        createBundle("raw-bundle-2-postcodes.xml");
        List<Resource> resources = patientDao.search(ctx, null, null, null, null, null, new StringParam("wrong"), null, null, null);
        assertThat(resources.size(), is(0));
    }

    @Test
    public void givenASearchRequestIsMade_withAValidName_shouldNotReturnAResponse() {
        createBundle("raw-bundle-2-postcodes.xml");
        List<Resource> resources = patientDao.search(ctx, null, null, null, null, null, null, null, new StringParam("test"), null);
        assertThat(resources.size(), is(1));
        assertThat(((Patient) resources.get(0)).getName().size(), is(1));
        assertThat(((Patient) resources.get(0)).getName().get(0).getGivenAsSingleString(), is("Test"));
    }

    @Test
    public void givenASearchRequestIsMade_withAInValidName_shouldNotReturnAResponse() {
        createBundle("raw-bundle-2-postcodes.xml");
        List<Resource> resources = patientDao.search(ctx, null, null, null, null, null, null, null, new StringParam("wrong"), null);
        assertThat(resources.size(), is(0));
    }

    @Test
    public void givenASearchRequestIsMade_withAValidId_shouldNotReturnAResponse() {
        createBundle("raw-bundle-2-postcodes.xml");
        List<Resource> resources = patientDao.search(ctx, null, null, null, null, null, null, new TokenParam("https://fhir.nhs.uk/Id/nhs-number", "1352445790"), null, null);
        assertThat(resources.size(), is(1));
        assertThat(((Patient) resources.get(0)).getIdentifierFirstRep().getValue(), is("1352445790"));
        assertThat(((Patient) resources.get(0)).getIdentifierFirstRep().getSystem(), is("https://fhir.nhs.uk/Id/nhs-number"));
    }

    @Test
    public void givenASearchRequestIsMade_withAInValidId_shouldNotReturnAResponse() {
        createBundle("raw-bundle-2-postcodes.xml");
        List<Resource> resources = patientDao.search(ctx, null, null, null, null, null, null, new TokenParam("https://fhir.nhs.uk/Id/nhs-number","24323"), null, null);
        assertThat(resources.size(), is(0));
    }

    private void createBundle(String fileName) {
        Bundle bundle = loadBundle(fileName);
        OperationOutcome operationOutcome = bundleDao.create(ctx, bundle, null, null);
        assertThat(operationOutcome.getId(), is(notNullValue()));
    }

    private Bundle loadBundle(String fileName) {
        String filename = getClass().getClassLoader().getResource(fileName).getPath();

        try {
            String bundleJson = new String(Files.readAllBytes(Paths.get(filename)));
            return FhirContext.forDstu3().newXmlParser().parseResource(Bundle.class, bundleJson);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }



}