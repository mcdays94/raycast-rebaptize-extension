/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** TMDB API Key - Optional. Get a free API key at themoviedb.org to enable automatic season/episode lookup for Smart Organize Episodes. */
  "tmdbApiKey"?: string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `rebaptize` command */
  export type Rebaptize = ExtensionPreferences & {}
  /** Preferences accessible in the `smart-organize` command */
  export type SmartOrganize = ExtensionPreferences & {}
  /** Preferences accessible in the `sort-by-date` command */
  export type SortByDate = ExtensionPreferences & {}
  /** Preferences accessible in the `sort-by-location` command */
  export type SortByLocation = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `rebaptize` command */
  export type Rebaptize = {}
  /** Arguments passed to the `smart-organize` command */
  export type SmartOrganize = {}
  /** Arguments passed to the `sort-by-date` command */
  export type SortByDate = {}
  /** Arguments passed to the `sort-by-location` command */
  export type SortByLocation = {}
}

