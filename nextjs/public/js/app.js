// Test Case Generator - Frontend JavaScript

// DOM Elements
const requirementsInput = document.getElementById("requirements");
const generateBtn = document.getElementById("generateBtn");
const btnText = document.getElementById("btnText");
const btnLoader = document.getElementById("btnLoader");
const statusMessage = document.getElementById("statusMessage");
const formatSelect = document.getElementById("format");
const typePositive = document.getElementById("typePositive");
const typeNegative = document.getElementById("typeNegative");
const typeEdge = document.getElementById("typeEdge");

// API Endpoint
const API_BASE_URL = window.location.origin;
const GENERATE_ENDPOINT = `${API_BASE_URL}/api/generate`;

/**
 * Initialize the application
 */
function init() {
  // Add event listeners
  generateBtn.addEventListener("click", handleGenerate);

  // Allow Ctrl+Enter to generate
  requirementsInput.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      handleGenerate();
    }
  });

  console.log("Test Case Generator initialized");
}

/**
 * Handle test case generation
 */
async function handleGenerate() {
  // Get requirements
  const requirements = requirementsInput.value.trim();

  // Validate requirements
  if (!requirements) {
    showMessage(
      "Please enter your requirements before generating test cases.",
      "error",
    );
    requirementsInput.focus();
    return;
  }

  // Get selected test types
  const testTypes = getSelectedTestTypes();

  // Validate test types
  if (testTypes.length === 0) {
    showMessage("Please select at least one test type.", "error");
    return;
  }

  // Get format
  const format = formatSelect.value;

  // Prepare request
  const request = {
    requirements: requirements,
    testTypes: testTypes,
    format: format,
  };

  // Show loading state
  setLoading(true);
  showMessage("Generating test cases... This may take a few moments.", "info");

  try {
    // Call API
    const response = await fetch(GENERATE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    // Check if response is successful
    if (!response.ok) {
      // Try to parse error message
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      } else {
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`,
        );
      }
    }

    // Get the blob (Excel file)
    const blob = await response.blob();

    // Extract filename from Content-Disposition header or use default
    let filename = "test_cases.xlsx";
    const contentDisposition = response.headers.get("Content-Disposition");
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/,
      );
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, "");
      }
    }

    // Download the file
    downloadFile(blob, filename);

    // Show success message
    const testTypesList = testTypes.join(", ");
    showMessage(
      `✓ Test cases generated successfully! File downloaded: ${filename} (Types: ${testTypesList})`,
      "success",
    );
  } catch (error) {
    console.error("Error generating test cases:", error);
    showMessage(
      `Failed to generate test cases: ${error.message}. Please check your LLM configuration and try again.`,
      "error",
    );
  } finally {
    setLoading(false);
  }
}

/**
 * Get selected test types
 */
function getSelectedTestTypes() {
  const types = [];

  if (typePositive.checked) types.push(typePositive.value);
  if (typeNegative.checked) types.push(typeNegative.value);
  if (typeEdge.checked) types.push(typeEdge.value);

  return types;
}

/**
 * Set loading state
 */
function setLoading(isLoading) {
  generateBtn.disabled = isLoading;

  if (isLoading) {
    btnText.style.display = "none";
    btnLoader.style.display = "inline-block";
  } else {
    btnText.style.display = "inline";
    btnLoader.style.display = "none";
  }
}

/**
 * Show status message
 */
function showMessage(message, type = "info") {
  statusMessage.textContent = message;
  statusMessage.className = `status-message ${type}`;
  statusMessage.style.display = "block";

  // Auto-hide success messages after 10 seconds
  if (type === "success") {
    setTimeout(() => {
      hideMessage();
    }, 10000);
  }
}

/**
 * Hide status message
 */
function hideMessage() {
  statusMessage.style.display = "none";
}

/**
 * Download file from blob
 */
function downloadFile(blob, filename) {
  // Create a temporary URL for the blob
  const url = window.URL.createObjectURL(blob);

  // Create a temporary anchor element and trigger download
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();

  // Cleanup
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

/**
 * Format file size for display
 */
function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
