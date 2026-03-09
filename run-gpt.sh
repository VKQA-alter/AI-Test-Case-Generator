#!/bin/bash
# AI Test Case Generator - GPT Run Script
# This script runs the application using OpenAI GPT

echo "========================================"
echo "  AI Test Case Generator - GPT Mode"
echo "========================================"
echo ""

# Check if API key is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "ERROR: OPENAI_API_KEY environment variable is not set"
    echo ""
    echo "Please set your API key first:"
    echo "  export OPENAI_API_KEY=sk-your-api-key-here"
    echo ""
    echo "Or edit this script and add your API key directly."
    exit 1
fi

# Configuration - Edit these values if needed
API_URL="https://api.openai.com/v1/chat/completions"
MODEL="gpt-4"

# Uncomment for GPT-3.5-turbo (faster and cheaper):
# MODEL="gpt-3.5-turbo"

echo "Configuration:"
echo "  API URL: $API_URL"
echo "  Model: $MODEL"
echo "  API Key: ${OPENAI_API_KEY:0:8}****"
echo ""

# Build if JAR doesn't exist
if [ ! -f "target/ai-test-case-generator-1.0.0.jar" ]; then
    echo "Building project..."
    mvn clean package -q
    if [ $? -ne 0 ]; then
        echo "ERROR: Build failed"
        exit 1
    fi
fi

# Run the application
echo "Running with OpenAI GPT..."
echo ""
java -jar target/ai-test-case-generator-1.0.0.jar \
  --api-url=$API_URL \
  --model=$MODEL \
  --api-key=$OPENAI_API_KEY \
  "$@"

echo ""
echo "========================================"
echo "  Execution Complete"
echo "========================================"
