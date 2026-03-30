/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** TheTVDB API Key - Optional. Get a free API key at thetvdb.com to enable automatic season/episode lookup for Smart Organize Episodes. */
  "tvdbApiKey"?: string
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
  /** Preferences accessible in the `smart-find-replace` command */
  export type SmartFindReplace = ExtensionPreferences & {}
  /** Preferences accessible in the `preset-tv-show` command */
  export type PresetTvShow = ExtensionPreferences & {}
  /** Preferences accessible in the `preset-anime` command */
  export type PresetAnime = ExtensionPreferences & {}
  /** Preferences accessible in the `preset-movie` command */
  export type PresetMovie = ExtensionPreferences & {}
  /** Preferences accessible in the `preset-sequential` command */
  export type PresetSequential = ExtensionPreferences & {}
  /** Preferences accessible in the `preset-date-based` command */
  export type PresetDateBased = ExtensionPreferences & {}
  /** Preferences accessible in the `preset-change-case` command */
  export type PresetChangeCase = ExtensionPreferences & {}
  /** Preferences accessible in the `preset-swap-delimiter` command */
  export type PresetSwapDelimiter = ExtensionPreferences & {}
  /** Preferences accessible in the `preset-auto-enumerate` command */
  export type PresetAutoEnumerate = ExtensionPreferences & {}
  /** Preferences accessible in the `preset-change-extension` command */
  export type PresetChangeExtension = ExtensionPreferences & {}
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
  /** Arguments passed to the `smart-find-replace` command */
  export type SmartFindReplace = {}
  /** Arguments passed to the `preset-tv-show` command */
  export type PresetTvShow = {}
  /** Arguments passed to the `preset-anime` command */
  export type PresetAnime = {}
  /** Arguments passed to the `preset-movie` command */
  export type PresetMovie = {}
  /** Arguments passed to the `preset-sequential` command */
  export type PresetSequential = {}
  /** Arguments passed to the `preset-date-based` command */
  export type PresetDateBased = {}
  /** Arguments passed to the `preset-change-case` command */
  export type PresetChangeCase = {}
  /** Arguments passed to the `preset-swap-delimiter` command */
  export type PresetSwapDelimiter = {}
  /** Arguments passed to the `preset-auto-enumerate` command */
  export type PresetAutoEnumerate = {}
  /** Arguments passed to the `preset-change-extension` command */
  export type PresetChangeExtension = {}
}

