import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { syncPdPerson } from "./syncPdPerson";

dotenv.config();

(async () => {
  try {
    console.log("🚀 Starting Pipedrive Sync...");

    const inputData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "mappings/inputData.json"), "utf-8")
    );

    const mappings = JSON.parse(
      fs.readFileSync(path.join(__dirname, "mappings/mappings.json"), "utf-8")
    );

    const result = await syncPdPerson(inputData, mappings);
    console.log("✅ SUCCESS:", result);

  } catch (err: any) {
    console.error("❌ Error:", err.response?.data || err.message);
  }
})();
