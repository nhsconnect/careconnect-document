package uk.nhs.careconnect.nosql.dao;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.param.ReferenceParam;
import ca.uhn.fhir.rest.param.TokenParam;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
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
import org.hl7.fhir.dstu3.model.Resource;
import org.junit.*;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Stream;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.notNullValue;
import static org.hamcrest.MatcherAssert.assertThat;

@RunWith(SpringRunner.class)
@ContextConfiguration(classes = {TestConfig.class})
public class DaoCompositionIT {

    @Autowired
    MongoTemplate mongoTemplate;

    @Autowired
    FhirContext ctx;

    @Autowired
    IBundle bundleDao;

    @Autowired
    IComposition compositionDao;

    private static final String[] COLLECTION_NAMES = {"Bundle", "idxComposition", "idxPatient"};

    private static MongodExecutable mongodExe;
    private static MongodProcess mongod;

    @BeforeClass
    public static void beforeEach() throws Exception {
        MongodStarter starter = MongodStarter.getDefaultInstance();
        String bindIp = "localhost";
        int port = 12345;
        IMongodConfig mongodConfig = new MongodConfigBuilder()
                .version(Version.Main.PRODUCTION)
                .net(new Net(bindIp, port, Network.localhostIsIPv6()))
                .build();
        DaoCompositionIT.mongodExe = starter.prepare(mongodConfig);
        DaoCompositionIT.mongod = mongodExe.start();
    }

    @AfterClass
    public static void afterEach() throws Exception {
        if (DaoCompositionIT.mongod != null) {
            DaoCompositionIT.mongod.stop();
            DaoCompositionIT.mongodExe.stop();
        }
    }

    @Before
    public void eachTest(){
        Stream.of(COLLECTION_NAMES).forEach(
                collectionName -> mongoTemplate.dropCollection(collectionName)
        );
    }

    @Test
    public void canReadABundleFromAnXMLFileTest() {
        Bundle bundle = loadBundle();
        assertThat(bundle, is(notNullValue()));
    }

    private Bundle loadBundle() {
        String filename = getClass().getClassLoader().getResource("raw-bundle.xml").getPath();

        try {
            String bundleJson = new String(Files.readAllBytes(Paths.get(filename)));
            return FhirContext.forDstu3().newXmlParser().parseResource(Bundle.class, bundleJson);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    @Test
    public void loadBundle_createViaBundleDaoTest() {
        Bundle bundle = loadBundle();
        OperationOutcome operationOutcome = bundleDao.create(ctx, bundle, null, null);
        assertThat(operationOutcome.getId(), is(notNullValue()));
    }

    @Test
    public void searchCompositionTest() {
        //setup
        Bundle bundle = loadBundle();
        OperationOutcome operationOutcome = bundleDao.create(ctx, bundle, null, null);
        assertThat(operationOutcome.getId(), is(notNullValue()));

        String id = operationOutcome.getId().split("/")[1];

        TokenParam resid = new TokenParam();
        resid.setValue(id);
        ReferenceParam patient = null;

        List<Resource> resources = compositionDao.search(ctx, resid, patient);

        assertThat(resources.size(), is(1));
    }

    @Test
    public void canPopulateFromObject() {
        mongoTemplate.createCollection("Bundle");
        populateMongoFromTestDataObjects();
    }

    private void populateMongoFromTestDataObjects() {
        Bundle aBundle = loadBundle();

        mongoTemplate.insert(aBundle, "Bundle");
    }

}
