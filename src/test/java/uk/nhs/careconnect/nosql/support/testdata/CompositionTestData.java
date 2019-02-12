package uk.nhs.careconnect.nosql.support.testdata;

import org.hl7.fhir.dstu3.model.Coding;
import uk.nhs.careconnect.nosql.entities.CodingEntity;
import uk.nhs.careconnect.nosql.entities.CompositionEntity;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import static java.util.Arrays.asList;
import static uk.nhs.careconnect.nosql.support.testdata.BundleTestData.*;

public class CompositionTestData {

    public static final Date DATE = new Date();

    public static CompositionEntity aCompositionEntity() {
        CompositionEntity compositionEntity = new CompositionEntity();

        compositionEntity.setType(asList(
                new CodingEntity(
                        new Coding()
                                .setCode(CODING_CODE)
                                .setSystem(CODING_SYSTEM)
                                .setDisplay(CODING_DISPLAY)
                )));

        compositionEntity.setDate(DATE);

        return compositionEntity;
    }

}
