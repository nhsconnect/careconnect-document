package uk.nhs.careconnect.nosql.providers;

import ca.uhn.fhir.context.FhirContext;
import org.hl7.fhir.dstu3.model.Binary;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.IdType;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import uk.nhs.careconnect.nosql.dao.IBinaryResource;
import uk.nhs.careconnect.nosql.dao.IComposition;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.mockito.Mockito.when;


@RunWith(MockitoJUnitRunner.class)
public class BinaryProviderTest {

    private static final Logger log = LoggerFactory.getLogger(BinaryProviderTest.class);

    private Binary BINARY;

    private static final Boolean CREATED = true;
    private static final Boolean UPDATED = false;

    private static final String ID = "id-1";
    private static final String OPERATION_OUTCOME_ID = "operation-outcome-id-1";

    FhirContext fhirContext;

    @Mock
    IBinaryResource binaryDao;

    @Mock
    IComposition compositionDao;

    private BinaryProvider binaryProvider;

    @Before
    public void eachTest(){
        fhirContext = FhirContext.forDstu3();
        BINARY = aBinary();

        binaryProvider = new BinaryProvider(fhirContext, binaryDao, compositionDao);
    }

    @Test
    public void givenABinaryInsideABundle_whenGetBinaryById_returnThenBinary() {
        //setup
        IdType binaryId = new IdType().setValue(ID);

        when(binaryDao.read(fhirContext, binaryId)).thenReturn(BINARY);

        //when
        Binary binaryResponse = binaryProvider.getBinaryById(binaryId);

        //then
        //assertThatMethodOutcomeIsEqual(actualMethodOutcome, expectedMethodOutcome);
    }

    @Test
    public void givenAFhirResourceInsideABundle_whenGetBinaryById_returnThenBinary() {
        //setup
        IdType binaryId = new IdType().setValue(ID);

        when(binaryDao.read(fhirContext, binaryId)).thenReturn(null);
        when(compositionDao.readDocument(fhirContext, binaryId)).thenReturn(aFhirDocument());

        //when
        Binary binaryResponse = binaryProvider.getBinaryById(binaryId);

        log.info("Binary returned {}", new String(binaryResponse.getContent()));

        assertThat(new String(binaryResponse.getContent()), is(fhirContext.newXmlParser().encodeResourceToString(aFhirDocument())));


        //then
        //assertThatMethodOutcomeIsEqual(actualMethodOutcome, expectedMethodOutcome);
    }

    private Binary aBinary() {
        byte[] binaryResource = fhirContext.newXmlParser().encodeResourceToString(loadBundle("ITK3-10001.dat")).getBytes();

        return new Binary()
                .setContentType("application/fhir+xml")
                .setContent(binaryResource);
    }

    private Bundle aFhirDocument() {
        return loadBundle("ITK3-10001.dat");
    }

    protected Bundle loadBundle(String fileName) {
        String filename = getClass().getClassLoader().getResource(fileName).getPath();

        try {
            String bundleJson = new String(Files.readAllBytes(Paths.get(filename)));
            bundleJson = bundleJson.replaceAll("(?s)<!--.*?-->", "");

            return fhirContext.newXmlParser().parseResource(Bundle.class, bundleJson);
        } catch (IOException e) {
            log.error("Unable to loadBundle", e);
        }

        return null;
    }

}