import { promises as fs } from "fs";
import path from "path";

const DEFAULT_INPUT_PATH = "input/requirements.txt";

/**
 * Reads the content of the requirements file at the given path or the default path.
 * Throws an Error if file is missing, unreadable, or empty.
 */
export async function readRequirements(filePath?: string): Promise<string> {
  const relative = filePath || DEFAULT_INPUT_PATH;
  const resolved = path.resolve(process.cwd(), relative);

  try {
    await fs.access(resolved, fs.constants.R_OK);
  } catch (err) {
    throw new Error(`Requirements file not found or not readable: ${relative}`);
  }

  const content = await fs.readFile(resolved, { encoding: "utf8" });
  if (!content || content.trim() === "") {
    throw new Error(`Requirements file is empty: ${relative}`);
  }

  console.log(`Successfully read requirements from: ${relative}`);
  console.log(`Content length: ${content.length} characters`);

  return content.trim();
}

/**
 * Convenience wrapper to read from the default input file
 */
export async function readDefaultRequirements(): Promise<string> {
  return readRequirements(DEFAULT_INPUT_PATH);
}

/**
 * Returns true if the default requirements file exists
 */
export async function requirementsFileExists(): Promise<boolean> {
  const resolved = path.resolve(process.cwd(), DEFAULT_INPUT_PATH);
  try {
    await fs.access(resolved, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
