package com.ai.testgen.util;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Utility class to read requirements from a text file
 */
public class RequirementReader {
    
    private static final String DEFAULT_INPUT_PATH = "input/requirements.txt";
    
    /**
     * Reads the content of the requirements file
     * @return the content of the requirements file as a String
     * @throws IOException if file reading fails
     */
    public static String readRequirements() throws IOException {
        return readRequirements(DEFAULT_INPUT_PATH);
    }
    
    /**
     * Reads the content of a requirements file from the specified path
     * @param filePath the path to the requirements file
     * @return the content of the file as a String
     * @throws IOException if file reading fails
     */
    public static String readRequirements(String filePath) throws IOException {
        Path path = Paths.get(filePath);
        
        if (!Files.exists(path)) {
            throw new IOException("Requirements file not found at: " + filePath);
        }
        
        if (!Files.isReadable(path)) {
            throw new IOException("Requirements file is not readable: " + filePath);
        }
        
        String content = Files.readString(path);
        
        if (content == null || content.trim().isEmpty()) {
            throw new IOException("Requirements file is empty: " + filePath);
        }
        
        System.out.println("Successfully read requirements from: " + filePath);
        System.out.println("Content length: " + content.length() + " characters");
        
        return content.trim();
    }
    
    /**
     * Checks if the requirements file exists at the default location
     * @return true if the file exists, false otherwise
     */
    public static boolean requirementsFileExists() {
        return Files.exists(Paths.get(DEFAULT_INPUT_PATH));
    }
}
