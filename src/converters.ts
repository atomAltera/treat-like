import {provided} from "./validators";

export const bydefault = <T, D>(d: D) => (value: T | null | undefined) => provided(value) ? value as T : d;

export const trimmed = (value: string): string => value.trim();

export const lowercased = (value: string): string => value.toLowerCase();
export const uppercased = (value: string): string => value.toUpperCase();


