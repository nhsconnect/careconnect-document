package uk.nhs.careconnect.nosql.entities;

import org.hl7.fhir.dstu3.model.Period;

import java.util.Date;

public class PeriodEntity {

    private Date start;

    private Date end;

    public PeriodEntity(){

    }

    public PeriodEntity(Period period) {
        this.start = period.getStart();
        this.end = period.getEnd();
    }

    public Date getStart() {
        return start;
    }

    public Date getEnd() {
        return end;
    }

}

