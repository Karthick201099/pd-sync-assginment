import axios from "axios";
import { applyMappings } from "./mapper";
import { MappingRule } from "./types/mapping";
import { PipedrivePersonCreate } from "./types/pipedrive";

export const syncPdPerson = async (
  input: any,
  mappings: MappingRule[]
) => {
  const apiKey = process.env.PIPEDRIVE_API_KEY;
  const domain = process.env.PIPEDRIVE_COMPANY_DOMAIN;

  if (!apiKey || !domain) throw new Error("Missing .env values");

  const baseUrl = `https://${domain}.pipedrive.com/v1`;

  // 1️⃣ Apply mapping rules
  let mapped = applyMappings(input, mappings);

  // 2️⃣ Fix email for Pipedrive format
  if (mapped.email) {
    mapped.email = [
      { label: "work", value: mapped.email, primary: true }
    ];
  }

  // 3️⃣ Fix phone format
  if (mapped.phone) {
    mapped.phone = [
      { label: "work", value: mapped.phone, primary: true }
    ];
  }

  console.log("📦 Final Data to Pipedrive -> ", mapped);

  // 4️⃣ SEARCH person by name
  const search = await axios.get(
    `${baseUrl}/persons/search`,
    { params: { term: mapped.name, api_token: apiKey } }
  );

  const exists = search.data?.data?.items?.length > 0;

  let result;

  if (exists) {
    // PERSON FOUND → UPDATE
    const id = search.data.data.items[0].item.id;

    const update = await axios.put(
      `${baseUrl}/persons/${id}?api_token=${apiKey}`,
      mapped
    );

    result = update.data.data;

  } else {
    // NO PERSON → CREATE
    const create = await axios.post(
      `${baseUrl}/persons?api_token=${apiKey}`,
      mapped
    );

    result = create.data.data;
  }

  return result;
};
