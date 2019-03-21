package uk.nhs.careconnect.nosql.support.matchers;

import org.hamcrest.BaseMatcher;
import org.hamcrest.Description;
import org.hamcrest.Matcher;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DateMatchers {

    public static Matcher<Date> equalIgnoringMilliSeconds(Date expectedDate) {
        return new BaseMatcher<Date>() {

            private SimpleDateFormat formatter = new SimpleDateFormat("dd MM yyyy HH:mm:ss");

            @Override
            public boolean matches(Object actualDate) {
                return actualDate != null && formatter.format(actualDate).equals(formatter.format(expectedDate));
            }

            @Override
            public void describeTo(Description description) {
                description.appendValue(formatter.format(expectedDate));
            }

            @Override
            public void describeMismatch(Object item, Description description) {
                description.appendText("was ").appendValue(item != null ? formatter.format(item) : null);
            }

        };
    }

}
