package uk.nhs.careconnect.nosql.support.testdata;

import uk.nhs.careconnect.nosql.entities.Coding;
import uk.nhs.careconnect.nosql.entities.CompositionEntity;

import java.util.ArrayList;
import java.util.Collection;

import static uk.nhs.careconnect.nosql.support.testdata.BundleTestData.*;

public class CompositionTestData {

    public static CompositionEntity aCompositionEntity() {
        CompositionEntity compositionEntity = new CompositionEntity();

        Collection<uk.nhs.careconnect.nosql.entities.Coding> codingList = new ArrayList<>();
        compositionEntity.setType(codingList);
        Coding coding = new Coding();
        codingList.add(coding);
        coding.setCode(CODING_CODE);
        coding.setSystem(CODING_SYSTEM);
        coding.setDisplay(CODING_DISPLAY);

        return compositionEntity;
    }

}
