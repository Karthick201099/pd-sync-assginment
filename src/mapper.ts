import { MappingRule } from "./types/mapping";

export function getValue(obj: any, path: string) {
  try {
    return path
      .replace(/\[(\d+)\]/g, ".$1")
      .split(".")
      .reduce((o, key) => (o ? o[key] : undefined), obj);
  } catch {
    return undefined;
  }
}

export function applyMappings(input: any, mappings: MappingRule[]) {
  const output: any = {};

  for (const rule of mappings) {
    const value = getValue(input, rule.inputKey);

    // Skip undefined values
    if (value === undefined) continue;

    output[rule.pipedriveKey] = value;
  }

  return output;
}
