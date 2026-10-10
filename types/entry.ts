import { ORDER } from "../app/constants/levels";

export type LevelResponse = {
  selectedOptions: string[];
  answers: [string, string, string];
};

export type StoredEntry = {
  levels: string[];
  options: string[];
  responses?: Record<string, LevelResponse>;
  createdAt: string;
};

export type EntryFormValues = {
  checkboxGroup: string[];
  levelResponses: Record<string, LevelResponse>;
};

export function createEmptyLevelResponses(): Record<string, LevelResponse> {
  return Object.fromEntries(
    ORDER.map((level) => [
      level,
      { selectedOptions: [], answers: ["", "", ""] },
    ]),
  );
}
