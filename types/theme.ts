export type Theme = "system" | "dark" | "light" | "blue";

export const THEME_VALUES: Exclude<Theme, "system">[] = ["dark", "light", "blue"];

export const THEMES: Theme[] = ["system", ...THEME_VALUES];
