package uk.nhs.careconnect.nosql.entities;

import org.hl7.fhir.dstu3.model.Period;
import org.junit.Before;
import org.junit.Test;

import java.util.Date;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;

public class PeriodEntityTest {

    private static final Date START_DATE = new Date();
    private static final Date END_DATE = new Date();

    PeriodEntity periodEntity;

    @Before
    public void eachTest(){
        periodEntity = new PeriodEntity(new Period().setStart(START_DATE).setEnd(END_DATE));
    }

    @Test
    public void startTest() {
        assertThat(periodEntity.getStart(), is(START_DATE));
    }

    @Test
    public void endTest() {
        assertThat(periodEntity.getEnd(), is(END_DATE));
    }

}