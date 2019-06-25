package uk.nhs.careconnect.nosql;

import ca.uhn.fhir.context.FhirContext;
import ca.uhn.fhir.rest.api.server.RequestDetails;
import ca.uhn.fhir.rest.server.interceptor.InterceptorAdapter;

import org.hl7.fhir.dstu3.model.Binary;
import org.hl7.fhir.dstu3.model.Bundle;
import org.hl7.fhir.instance.model.api.IBaseResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.core.io.ClassPathResource;
import org.xhtmlrenderer.pdf.ITextRenderer;



import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.stream.StreamSource;
import java.io.*;
import java.nio.charset.StandardCharsets;

public class mimeInterceptor extends InterceptorAdapter {


    FhirContext ctx = FhirContext.forDstu3();
    private static final Logger log = LoggerFactory.getLogger(mimeInterceptor.class);

    @Override
    public boolean incomingRequestPostProcessed(RequestDetails theRequestDetails, HttpServletRequest theRequest,
                                                HttpServletResponse theResponse) {

        log.debug("iR Content-Type = "+theRequestDetails.getHeader("Content-Type"));
        log.info("iR Accept = "+theRequestDetails.getHeader("Accept"));
        return true;
        }

    @Override
    public boolean outgoingResponse(RequestDetails theRequestDetails, IBaseResource resource, HttpServletRequest theServletRequest, HttpServletResponse response) {
/*
        log.info("oR Content-Type = "+theRequestDetails.getHeader("Content-Type"));
        String contentType = theRequestDetails.getHeader("Content-Type");
        if (contentType != null) {
            if (contentType.equals("text/html")) {
                try {

                    response.setStatus(200);
                    response.setContentType("text/html");

                    performTransform(response.getOutputStream(), resource, "BOOT-INF/DocumentToHTML.xslt");

                } catch (Exception ex) {
                    ex.printStackTrace();
                }
                return false;
            } else if (contentType.equals("application/pdf")) {
                try {

                    response.setStatus(200);
                    response.setContentType("application/pdf");

                    // TODO Remove file and convert to plain streams

                    File fileHtml = File.createTempFile("pdf", ".tmp");
                    FileOutputStream fos = new FileOutputStream(fileHtml);
                    performTransform(fos, resource, "BOOT-INF/DocumentToHTML.xslt");


                    String processedHtml = org.apache.commons.io.IOUtils.toString(new InputStreamReader(new FileInputStream(fileHtml), "UTF-8"));

                    ITextRenderer renderer = new ITextRenderer();
                    renderer.setDocumentFromString(processedHtml);
                    renderer.layout();
                    renderer.createPDF(response.getOutputStream(), false);
                    renderer.finishPDF();
                    fos.flush();

                } catch (Exception ex) {
                    ex.printStackTrace();
                }
                return false;
            }
        }
         */
        log.info("oR Content-Type = "+theRequestDetails.getHeader("Accept"));
        String acceptType = theRequestDetails.getHeader("Accept");
        if (acceptType == null) {
            acceptType = theRequestDetails.getHeader("accept");
        }

        String[] value = theRequestDetails.getParameters().get("_format");
        if (value != null) {
            for (String nextParam : value) {
                acceptType = nextParam;
                log.info("_format = "+acceptType);
            }
        }

        if(resource!=null) {
            log.trace("Response resource instance of "+resource.getClass().getSimpleName());


            if (resource.getClass()!=null) log.trace("Response resource instance of "+resource.getClass().getSimpleName());
            if (theRequestDetails != null && theRequestDetails.getResourceName() != null) log.trace("Request resource "+theRequestDetails.getResourceName().equals("Binary"));

            // Special Procecssing for Binary when a FHIR document is returned
            if (resource instanceof Binary && theRequestDetails.getResourceName().equals("Binary")) {
                Binary binary = (Binary) resource;
                Bundle bundle = null;
                log.trace("Content Type of returned Binary" + binary.getContentType().contains("fhir"));
                // Check for FHIR Document
                if (binary.getContentType().contains("fhir")) {
                    // Assume this is a FHIR Document
                    ByteArrayInputStream b = new ByteArrayInputStream(binary.getContent());

                    Reader reader = new InputStreamReader(b);
                    IBaseResource resourceBundle = null;
                    // Response should be json
                    if (binary.getContentType().contains("json")) {
                        resourceBundle = ctx.newJsonParser().parseResource(reader);
                    } else {
                        resourceBundle = ctx.newXmlParser().parseResource(reader);
                    }
                    log.debug("Parsed resource type = " + resourceBundle.getClass().getSimpleName());
                    if (resourceBundle instanceof Bundle) {
                        // BOOT-INF is default for FHIR documents
                        if (acceptType == null || (acceptType.contains("fhir") && acceptType.contains("xml"))) {
                            try {

                                // Response was json, convert to xml
                                binary.setContentType("application/fhir+xml");
                                binary.setContent(ctx.newXmlParser().encodeResourceToString(resourceBundle).getBytes());
                                response.setStatus(200);
                                response.setContentType("application/fhir+xml");

                                if (acceptType == null) {
                                    // if not asked for format return xml as default
                                    response.getOutputStream().write(ctx.newXmlParser().encodeResourceToString(resourceBundle).getBytes());
                                } else {
                                    // else return as a Bundle
                                    response.getOutputStream().write(ctx.newXmlParser().encodeResourceToString(binary).getBytes());
                                }

                            } catch (Exception ex) {
                                ex.printStackTrace();
                            }
                            return false;
                        } else if (acceptType.contains("fhir") && acceptType.contains("json")) {
                            try {

                                // Response was json, convert to xml
                                binary.setContentType("application/fhir+json");
                                binary.setContent(ctx.newJsonParser().encodeResourceToString(resourceBundle).getBytes());
                                response.setStatus(200);
                                response.setContentType("application/fhir+json");

                                if (acceptType == null) {
                                    // if not asked for format return xml as default
                                    response.getOutputStream().write(ctx.newJsonParser().encodeResourceToString(resourceBundle).getBytes());
                                } else {
                                    // else return as a Bundle
                                    response.getOutputStream().write(ctx.newJsonParser().encodeResourceToString(binary).getBytes());
                                }

                            } catch (Exception ex) {
                                ex.printStackTrace();
                            }
                            return false;
                        }

                        else if (acceptType.equals("text/html")) {
                            try {
                                // requested document as html
                                response.setStatus(200);
                                response.setContentType("text/html");

                                performTransform(response.getOutputStream(), resourceBundle, "/DocumentToHTML.xslt");

                            } catch (Exception ex) {
                                try {
                                    response.getOutputStream().write(ex.getMessage().getBytes());
                                } catch (Exception ex1) {

                                }

                                log.error(ex.getMessage());
                            }
                            return false;
                        } else if (acceptType.equals("application/pdf")) {
                            try {
                                // requested document as pdf
                                response.setStatus(200);
                                response.setContentType("application/pdf");

                                // TODO Remove file and convert to plain streams

                                File fileHtml = File.createTempFile("pdf", ".tmp");
                                FileOutputStream fos = new FileOutputStream(fileHtml);
                                performTransform(fos, resourceBundle, "/DocumentToHTML.xslt");


                                String processedHtml = org.apache.commons.io.IOUtils.toString(new InputStreamReader(new FileInputStream(fileHtml), "UTF-8"));

                                ITextRenderer renderer = new ITextRenderer();
                                renderer.setDocumentFromString(processedHtml);
                                renderer.layout();
                                renderer.createPDF(response.getOutputStream(), false);
                                renderer.finishPDF();
                                fos.flush();

                            } catch (Exception ex) {
                                log.error(ex.getMessage());
                                try {
                                    response.getOutputStream().write(ex.getMessage().getBytes());
                                } catch (Exception ex1) {

                                }

                            }
                        }
                    }
                }
            }
        }
        return true;
    }
    private ClassLoader getContextClassLoader() {

        return Thread.currentThread().getContextClassLoader();
    }


    private void performTransform(OutputStream os, IBaseResource resource, String styleSheet) {

        // Input xml data file
        ClassLoader classLoader = getContextClassLoader();

        // Set the property to use xalan processor
        System.setProperty("javax.xml.transform.TransformerFactory",
                "org.apache.xalan.processor.TransformerFactoryImpl");

        // try with resources
        try {
            InputStream xml = new ByteArrayInputStream(ctx.newXmlParser().encodeResourceToString(resource).getBytes(StandardCharsets.UTF_8));

           InputStream xsl = null;
            try {
                log.info("ClassPath"); // Spring loader?
                xsl = (new ClassPathResource(styleSheet)).getInputStream();
            } catch (Exception ex2) {
                log.info("Original");
                xsl = classLoader.getResourceAsStream(styleSheet);
            }

            // Instantiate a transformer factory
            TransformerFactory tFactory = TransformerFactory.newInstance();

            // Use the TransformerFactory to process the stylesheet source and produce a Transformer
            StreamSource styleSource = new StreamSource(xsl);
            Transformer transformer = tFactory.newTransformer(styleSource);

            // Use the transformer and perform the transformation
            StreamSource xmlSource = new StreamSource(xml);
            StreamResult result = new StreamResult(os);
            transformer.transform(xmlSource, result);
        } catch (Exception ex) {
            try {
                os.write(ex.getMessage().getBytes());
            } catch (Exception ex1) {

            }
            log.error(ex.getMessage());
        }

    }

}
