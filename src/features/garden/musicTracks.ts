/** Public room track ids, shared by browser playback and server-side room rendering. */
export type GardenTrackId = "orgel" | "waltz" | "walk" | "lullaby" | "festival";
export const DEFAULT_TRACK: GardenTrackId = "orgel";
export const TRACK_ORDER: GardenTrackId[] = ["orgel", "waltz", "walk", "lullaby", "festival"];

export function isGardenTrack(id: unknown): id is GardenTrackId {
  return typeof id === "string" && TRACK_ORDER.some((track) => track === id);
}
