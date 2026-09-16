export type MuscleId =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "legs"
  | "core"
  | "other";

export interface Exercise {
  id: string;
  name: string;
  muscle: MuscleId;
  icon: string;
}

/** A single logged set: the weight & reps for one set of an exercise on a day. */
export interface SetEntry {
  id: string;
  exerciseId: string;
  /** ISO calendar day, e.g. "2026-05-31". */
  date: string;
  setNumber: number;
  reps: number;
  weight: number;
}

/** A point on the progress chart: a day and that day's heaviest set. */
export interface DayPoint {
  date: string;
  weight: number;
}
