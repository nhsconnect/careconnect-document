package uk.nhs.careconnect.nosql.support.testdata;

import org.hl7.fhir.dstu3.model.Bundle;

public class BundleTestData {

    public static Bundle aBundle(){
        Bundle bundle = new Bundle();
        //bundle.se

        bundle.setId("123456789012345678901234");
        bundle.setType(Bundle.BundleType.DOCUMENT);
        return bundle;
    }

}
