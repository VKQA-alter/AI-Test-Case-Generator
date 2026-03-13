# Changelog

All notable changes to the AI Test Case Generator project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-09

### Initial Release

#### Added

- ✨ Core application with CLI interface
- ✨ Integration with local LLM APIs (Ollama, LM Studio, LocalAI)
- ✨ Automatic test case generation from text requirements
- ✨ Support for Positive, Negative, and Edge test cases
- ✨ Excel export functionality (.xlsx format)
- ✨ Comprehensive documentation (README, PROJECT, QUICKSTART)
- ✨ Maven build configuration with all dependencies
- ✨ Command-line argument support for configuration
- ✨ Example requirements file
- ✨ Prompt template documentation
- ✨ Run scripts for Windows and Unix systems

#### Project Structure

- 📁 Model layer: TestCase, TestCaseResponse
- 📁 Service layer: LlmService, TestCaseGeneratorService
- 📁 Exporter layer: ExcelExporter
- 📁 Utility layer: RequirementReader, PromptBuilder
- 📁 Main application: Main.java

#### Dependencies

- Jackson 2.15.2 - JSON parsing
- Apache POI 5.2.3 - Excel generation
- Apache HttpClient 5.2.1 - HTTP communication
- Lombok 1.18.30 - Code simplification

#### Documentation

- README.md - Main documentation
- PROJECT.md - Architecture details
- QUICKSTART.md - Quick start guide
- PROMPT_TEMPLATE.md - Prompt engineering guide
- FILE_STRUCTURE.md - Complete file structure documentation
- CHANGELOG.md - Version history

#### Features

- 🔄 Reads requirements from input/requirements.txt
- 🤖 Sends formatted prompts to local LLM
- 📊 Parses JSON responses from LLM
- 📈 Validates and displays test case statistics
- 📑 Exports to formatted Excel file
- ⚙️ Configurable via command-line arguments
- 🎨 Styled Excel output with headers and borders
- 🔍 Robust error handling and validation

#### Technical Highlights

- Clean modular architecture
- Separation of concerns
- Extensible design
- Comprehensive error handling
- Support for multiple LLM providers
- Fat JAR build for easy distribution

---

## [Unreleased]

### Planned Features

- [ ] CSV export support
- [ ] HTML report generation
- [ ] Batch processing of multiple requirement files
- [ ] GUI interface option
- [ ] Test case templates
- [ ] Integration with test management tools
- [ ] PDF export
- [ ] Configuration file support
- [ ] Database storage option
- [ ] Test case versioning
- [ ] Requirement traceability matrix
- [ ] Performance metrics and logging

### Future Enhancements

- [ ] Unit tests
- [ ] Integration tests
- [ ] CI/CD pipeline
- [ ] Docker support
- [ ] Cloud LLM support (OpenAI, Anthropic)
- [ ] Custom test case fields
- [ ] Test data generation
- [ ] Test case prioritization algorithm

---

## Version History

| Version | Release Date | Description                             |
| ------- | ------------ | --------------------------------------- |
| 1.0.0   | 2026-03-09   | Initial release with core functionality |

---

## Contributors

- AI Test Case Generator Team

---

## Links

- [Repository](#)
- [Issue Tracker](#)
- [Documentation](README.md)

---

_Note: This is version 1.0.0 - the initial release of the AI Test Case Generator._
