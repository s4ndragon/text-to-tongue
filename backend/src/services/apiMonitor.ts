// backend/src/services/apiMonitor.ts

import fs from "fs";
import path from "path";

interface ApiUsage {
  date: string;
  calls: number;
  tokens: number;
}

const usageFilePath = path.join(__dirname, "../../api_usage.json");

export const trackApiUsage = async (tokens: number): Promise<void> => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Read existing usage data
    let usageData: ApiUsage[] = [];
    if (fs.existsSync(usageFilePath)) {
      const fileData = fs.readFileSync(usageFilePath, "utf8");
      usageData = JSON.parse(fileData);
    }

    // Find today's entry or create a new one
    const todayEntry = usageData.find((entry) => entry.date === today);
    if (todayEntry) {
      todayEntry.calls += 1;
      todayEntry.tokens += tokens;
    } else {
      usageData.push({ date: today, calls: 1, tokens });
    }

    // Write updated data back to file
    fs.writeFileSync(usageFilePath, JSON.stringify(usageData, null, 2));

    // Optional: Log warning if usage is high
    const todayTokens = todayEntry ? todayEntry.tokens : tokens;
    if (todayTokens > 100000) {
      // Adjust threshold as needed
      console.warn(`WARNING: High API usage today - ${todayTokens} tokens`);
    }
  } catch (error) {
    console.error("Error tracking API usage:", error);
    // Don't throw, as this is non-critical functionality
  }
};
