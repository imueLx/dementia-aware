export const supportedLanguages = ["en", "fil"] as const;

export type Language = (typeof supportedLanguages)[number];
