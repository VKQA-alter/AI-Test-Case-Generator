package com.ai.testgen.exporter;

import com.ai.testgen.model.TestCase;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

/**
 * Exports test cases to an Excel file using Apache POI
 */
public class ExcelExporter {
    
    private static final String DEFAULT_OUTPUT_PATH = "output/testcases.xlsx";
    private static final String[] HEADERS = {
        "Test Case ID", "Module", "Description", "Steps", 
        "Expected Result", "Type", "Priority"
    };
    
    /**
     * Exports test cases to the default output path
     * @param testCases list of test cases to export
     * @throws IOException if export fails
     */
    public void exportToExcel(List<TestCase> testCases) throws IOException {
        exportToExcel(testCases, DEFAULT_OUTPUT_PATH);
    }
    
    /**
     * Exports test cases to a specified Excel file
     * @param testCases list of test cases to export
     * @param filePath the output file path
     * @throws IOException if export fails
     */
    public void exportToExcel(List<TestCase> testCases, String filePath) throws IOException {
        System.out.println("\n=== Exporting Test Cases to Excel ===");
        System.out.println("Output file: " + filePath);
        
        // Ensure output directory exists
        Path outputPath = Paths.get(filePath);
        Files.createDirectories(outputPath.getParent());
        
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Test Cases");
            
            // Create header styles
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);
            
            // Create header row
            createHeaderRow(sheet, headerStyle);
            
            // Create data rows
            int rowNum = 1;
            for (TestCase testCase : testCases) {
                createDataRow(sheet, rowNum++, testCase, dataStyle);
            }
            
            // Auto-size columns
            autoSizeColumns(sheet);
            
            // Write to file
            try (FileOutputStream fileOut = new FileOutputStream(filePath)) {
                workbook.write(fileOut);
            }
            
            System.out.println("Successfully exported " + testCases.size() + " test cases");
            System.out.println("File saved at: " + outputPath.toAbsolutePath());
        }
    }
    
    /**
     * Creates the header row with styling
     */
    private void createHeaderRow(Sheet sheet, CellStyle headerStyle) {
        Row headerRow = sheet.createRow(0);
        
        for (int i = 0; i < HEADERS.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(HEADERS[i]);
            cell.setCellStyle(headerStyle);
        }
    }
    
    /**
     * Creates a data row for a test case
     */
    private void createDataRow(Sheet sheet, int rowNum, TestCase testCase, CellStyle dataStyle) {
        Row row = sheet.createRow(rowNum);
        
        createStyledCell(row, 0, testCase.getTestCaseId(), dataStyle);
        createStyledCell(row, 1, testCase.getModule(), dataStyle);
        createStyledCell(row, 2, testCase.getDescription(), dataStyle);
        createStyledCell(row, 3, testCase.getStepsAsString(), dataStyle);
        createStyledCell(row, 4, testCase.getExpectedResult(), dataStyle);
        createStyledCell(row, 5, testCase.getType(), dataStyle);
        createStyledCell(row, 6, testCase.getPriority(), dataStyle);
    }
    
    /**
     * Creates a cell with value and style
     */
    private void createStyledCell(Row row, int column, String value, CellStyle style) {
        Cell cell = row.createCell(column);
        cell.setCellValue(value != null ? value : "");
        cell.setCellStyle(style);
    }
    
    /**
     * Creates header cell style
     */
    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        
        // Background color
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        
        // Font
        Font font = workbook.createFont();
        font.setBold(true);
        font.setFontHeightInPoints((short) 12);
        style.setFont(font);
        
        // Borders
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        
        // Alignment
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        
        return style;
    }
    
    /**
     * Creates data cell style
     */
    private CellStyle createDataStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        
        // Font
        Font font = workbook.createFont();
        font.setFontHeightInPoints((short) 11);
        style.setFont(font);
        
        // Borders
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        
        // Alignment
        style.setVerticalAlignment(VerticalAlignment.TOP);
        style.setWrapText(true);
        
        return style;
    }
    
    /**
     * Auto-sizes all columns based on content
     */
    private void autoSizeColumns(Sheet sheet) {
        for (int i = 0; i < HEADERS.length; i++) {
            sheet.autoSizeColumn(i);
            
            // Set maximum width for description and steps columns
            if (i == 2 || i == 3 || i == 4) { // Description, Steps, Expected Result
                int currentWidth = sheet.getColumnWidth(i);
                int maxWidth = 15000; // Approximately 100 characters
                sheet.setColumnWidth(i, Math.min(currentWidth, maxWidth));
            }
        }
    }
}
