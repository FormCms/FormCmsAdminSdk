import { Asset,AssetLink } from "./asset";

/** Returns the string representation of a valid key from the `Asset` interface. */
export function AssetField(key: keyof Asset) {
    return key as string;
}

export function AssetLinkField(key: keyof AssetLink) {
    return key as string;
}

export type AssetLabels = {
    [K in keyof Asset]: string;
};

export type AssetLinkLabels = {
    [K in keyof AssetLink]: string;
}