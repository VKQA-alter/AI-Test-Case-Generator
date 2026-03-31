import { useState } from "react";
import axios from "axios";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const [testTypes, setTestTypes] = useState({
    positive: true,
    negative: true,
    edge: true,
  });
  const [format, setFormat] = useState("EXCEL");
  const [message, setMessage] = useState("");

  const handleGenerate = async () => {
    if (!requirements.trim()) {
      setMessage("Please enter your requirement before generating test cases.");
      return;
    }

    const selectedTypes = [];
    if (testTypes.positive) selectedTypes.push("Positive");
    if (testTypes.negative) selectedTypes.push("Negative");
    if (testTypes.edge) selectedTypes.push("Edge");

    if (selectedTypes.length === 0) {
      setMessage("Please select at least one test type.");
      return;
    }

    setLoading(true);
    setMessage("Generating test cases... This may take a few moments.");

    try {
      const res = await axios.post(
        "/api/generate",
        {
          requirements,
          testTypes: selectedTypes,
          format,
        },
        { responseType: "blob" },
      );

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "test_cases.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);

      setMessage("✓ Test cases generated successfully!");
    } catch (e: any) {
      console.error(e);
      const errorMsg =
        e.response?.data?.error || e.message || "Failed to generate test cases";
      setMessage(`Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <svg className={styles.icon} viewBox="0 0 24 24" fill="none">
          <path
            d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 12H15M9 16H15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h1>Test Case Generator</h1>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <div className={styles.section}>
            <label className={styles.sectionTitle}>Requirement</label>
            <p className={styles.sectionSubtitle}>
              Paste your requirement and configure generation options.
            </p>

            <textarea
              className={styles.textarea}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="As a [user], I want to [action] so that [benefit]..."
              rows={8}
            />
          </div>

          <div className={styles.configSection}>
            <div className={styles.configItem}>
              <label className={styles.configLabel}>TEST TYPES</label>
              <div className={styles.checkboxGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={testTypes.positive}
                    onChange={(e) =>
                      setTestTypes({ ...testTypes, positive: e.target.checked })
                    }
                  />
                  <span>Positive</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={testTypes.negative}
                    onChange={(e) =>
                      setTestTypes({ ...testTypes, negative: e.target.checked })
                    }
                  />
                  <span>Negative</span>
                </label>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={testTypes.edge}
                    onChange={(e) =>
                      setTestTypes({ ...testTypes, edge: e.target.checked })
                    }
                  />
                  <span>Edge</span>
                </label>
              </div>
            </div>

            <div className={styles.configItem}>
              <label className={styles.configLabel} htmlFor="format">
                FORMAT
              </label>
              <select
                id="format"
                className={styles.select}
                value={format}
                onChange={(e) => setFormat(e.target.value)}
              >
                <option value="EXCEL">Standard</option>
                <option value="CSV" disabled>
                  CSV (Coming Soon)
                </option>
                <option value="JSON" disabled>
                  JSON (Coming Soon)
                </option>
              </select>
            </div>
          </div>

          <button
            className={styles.generateButton}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Test Cases"}
          </button>

          {message && (
            <div
              className={`${styles.message} ${
                message.startsWith("✓")
                  ? styles.success
                  : message.startsWith("Error")
                    ? styles.error
                    : styles.info
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
