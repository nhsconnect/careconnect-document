package uk.nhs.careconnect.nosql.util;

import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.dstu3.model.Resource;

import java.util.Optional;

public class BundleUtils {

    private BundleUtils(){

    }

    public static <T extends Resource> Optional<T> extractFirstResourceOfType(Class<T> resourceType, Bundle bundle) {
        return bundle.getEntry().stream()
                .filter(entry ->  resourceType.isInstance(entry.getResource()))
                .map(resource -> (T)resource.getResource())
                .findFirst();
    }

}
