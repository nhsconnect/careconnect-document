package uk.nhs.careconnect.nosql.support.assertions;

import org.hl7.fhir.dstu3.model.Period;
import uk.nhs.careconnect.nosql.entities.PeriodEntity;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

public class PeriodAssertions {

    public static void assertThatPeriodIsEqual(PeriodEntity actual, Period expected) {
        assertThat(actual.getStart(), is(expected.getStart()));
        assertThat(actual.getEnd(), is(expected.getEnd()));
    }

}
