package uk.nhs.careconnect.nosql.providers.support.testdata;

import org.hl7.fhir.dstu3.model.Composition;
import org.hl7.fhir.dstu3.model.Resource;

import java.util.List;

import static java.util.Arrays.asList;

public class CompositionTestData {

    public static String VALID_ID = "123456789012345678901234";
    public static String INVALID_ID = "1234";


    public static List<Resource> aCompositionList() {
        Resource resource = new Composition();
        resource.setId(VALID_ID);

        return asList(resource);
    }

}
