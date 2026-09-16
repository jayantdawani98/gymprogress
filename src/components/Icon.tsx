import {
  Dumbbell,
  BicepsFlexed,
  HandFist,
  HeartPulse,
  PersonStanding,
  Accessibility,
  Footprints,
  Flame,
  Activity,
} from "lucide-react";
import {
  MdSportsGymnastics,
  MdRowing,
  MdAccessibilityNew,
  MdFitnessCenter,
  MdSportsMartialArts,
  MdDirectionsRun,
  MdSelfImprovement,
  MdStar,
} from "react-icons/md";

// Muscle-group icons are Material Design "figure" glyphs chosen to match the
// iOS app's SF Symbols (which can't be rendered on the web). Exercise-row
// icons keep the existing lucide set.
const MAP: Record<string, any> = {
  // muscle groups (Material, mirrors iOS SF Symbols)
  "figure.strengthtraining": MdSportsGymnastics,
  "figure.rower": MdRowing,
  "figure.arms.open": MdAccessibilityNew,
  "dumbbell.fill": MdFitnessCenter,
  "figure.cross.training": MdSportsMartialArts,
  "figure.run": MdDirectionsRun,
  "figure.core.training": MdSelfImprovement,
  "star.fill": MdStar,
  // general / exercise icons (lucide)
  Dumbbell,
  BicepsFlexed,
  HandFist,
  HeartPulse,
  PersonStanding,
  Accessibility,
  Footprints,
  Flame,
  Activity,
};

export function Icon({
  name,
  size = 24,
  color,
}: {
  name: string;
  size?: number;
  color?: string;
}) {
  const Component = MAP[name] ?? Dumbbell;
  return <Component size={size} color={color} />;
}
