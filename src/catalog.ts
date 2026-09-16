import type { MuscleId } from "./types";

export interface MuscleMeta {
  id: MuscleId;
  name: string;
  /** Signature colour used across the UI for this muscle. */
  color: string;
  /** lucide-react icon name. */
  icon: string;
}

// Colors match Apple's system colors used in the iOS app (deeper/more
// saturated than Tailwind). Icons use the SF Symbol names from the iOS app as
// keys, mapped in Icon.tsx to the closest Material Design "figure" glyphs.
export const MUSCLES: MuscleMeta[] = [
  { id: "chest", name: "Chest", color: "#ff2d55", icon: "figure.strengthtraining" }, // systemPink
  { id: "back", name: "Back", color: "#007aff", icon: "figure.rower" }, // systemBlue
  { id: "shoulders", name: "Shoulders", color: "#ff9500", icon: "figure.arms.open" }, // systemOrange
  { id: "biceps", name: "Biceps", color: "#af52de", icon: "dumbbell.fill" }, // systemPurple
  { id: "triceps", name: "Triceps", color: "#5856d6", icon: "figure.cross.training" }, // systemIndigo
  { id: "legs", name: "Legs", color: "#34c759", icon: "figure.run" }, // systemGreen
  { id: "core", name: "Core", color: "#30b0c7", icon: "figure.core.training" }, // systemTeal
  { id: "other", name: "Other", color: "#8e8e93", icon: "star.fill" }, // systemGray
];

export function muscleMeta(id: MuscleId): MuscleMeta {
  return MUSCLES.find((m) => m.id === id) ?? MUSCLES[MUSCLES.length - 1];
}

/** Default exercises seeded for each muscle on first run. */
export const DEFAULT_EXERCISES: Record<MuscleId, { name: string; icon: string }[]> = {
  chest: [
    { name: "Bench Press", icon: "Dumbbell" },
    { name: "Incline Bench Press", icon: "Dumbbell" },
    { name: "Chest Fly", icon: "HeartPulse" },
    { name: "Push Up", icon: "Activity" },
    { name: "Cable Crossover", icon: "Dumbbell" },
  ],
  back: [
    { name: "Deadlift", icon: "Dumbbell" },
    { name: "Pull Up", icon: "Activity" },
    { name: "Lat Pulldown", icon: "PersonStanding" },
    { name: "Bent Over Row", icon: "Dumbbell" },
    { name: "Seated Row", icon: "PersonStanding" },
  ],
  shoulders: [
    { name: "Overhead Press", icon: "Dumbbell" },
    { name: "Lateral Raise", icon: "Accessibility" },
    { name: "Front Raise", icon: "Accessibility" },
    { name: "Rear Delt Fly", icon: "Accessibility" },
    { name: "Shrug", icon: "Dumbbell" },
  ],
  biceps: [
    { name: "Barbell Curl", icon: "BicepsFlexed" },
    { name: "Dumbbell Curl", icon: "Dumbbell" },
    { name: "Hammer Curl", icon: "BicepsFlexed" },
    { name: "Preacher Curl", icon: "BicepsFlexed" },
  ],
  triceps: [
    { name: "Tricep Pushdown", icon: "HandFist" },
    { name: "Skull Crusher", icon: "Dumbbell" },
    { name: "Overhead Extension", icon: "Dumbbell" },
    { name: "Dips", icon: "Activity" },
  ],
  legs: [
    { name: "Squat", icon: "Footprints" },
    { name: "Leg Press", icon: "Footprints" },
    { name: "Lunge", icon: "Footprints" },
    { name: "Leg Curl", icon: "Footprints" },
    { name: "Leg Extension", icon: "Footprints" },
    { name: "Calf Raise", icon: "Footprints" },
  ],
  core: [
    { name: "Plank", icon: "Flame" },
    { name: "Crunch", icon: "Flame" },
    { name: "Russian Twist", icon: "Flame" },
    { name: "Leg Raise", icon: "Flame" },
  ],
  other: [],
};
