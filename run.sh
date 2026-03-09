#!/bin/bash
# AI Test Case Generator - Unix Run Script
# This script builds and runs the application

echo "========================================"
echo "  AI Test Case Generator"
echo "  Building and Running..."
echo "========================================"
echo ""

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "ERROR: Maven is not installed or not in PATH"
    echo "Please install Maven from https://maven.apache.org/"
    exit 1
fi

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "ERROR: Java is not installed or not in PATH"
    echo "Please install Java 17 or higher"
    exit 1
fi

# Build the project
echo "[1/2] Building the project..."
mvn clean package -q
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed"
    exit 1
fi
echo "Build successful!"
echo ""

# Run the application
echo "[2/2] Running the application..."
echo ""
java -jar target/ai-test-case-generator-1.0.0.jar "$@"

echo ""
echo "========================================"
echo "  Execution Complete"
echo "========================================"
