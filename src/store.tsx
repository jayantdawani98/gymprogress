import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DayPoint, Exercise, MuscleId, SetEntry } from "./types";
import { DEFAULT_EXERCISES } from "./catalog";

const EXERCISES_KEY = "gym.exercises";
const ENTRIES_KEY = "gym.entries";
const WORKOUT_KEY = "gym.workoutStart";

function uid(): string {
  return crypto.randomUUID();
}

export function todayISO(): string {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function seedExercises(): Exercise[] {
  const list: Exercise[] = [];
  (Object.keys(DEFAULT_EXERCISES) as MuscleId[]).forEach((muscle) => {
    DEFAULT_EXERCISES[muscle].forEach((item) => {
      list.push({ id: uid(), name: item.name, muscle, icon: item.icon });
    });
  });
  return list;
}

interface StoreValue {
  exercises: Exercise[];
  entries: SetEntry[];
  workoutStart: number | null;
  expandedMuscles: MuscleId[];
  homeFocusExerciseId: string | null;

  addExercise: (name: string, muscle: MuscleId, icon?: string) => void;
  deleteExercise: (id: string) => void;
  toggleMuscle: (id: MuscleId) => void;
  rememberHomeFocus: (exerciseId: string, muscle: MuscleId) => void;

  setsFor: (exerciseId: string, date: string) => SetEntry[];
  saveDay: (exerciseId: string, date: string, rows: { reps: number; weight: number }[]) => void;
  deleteDay: (exerciseId: string, date: string) => void;

  loggedDays: (exerciseId: string) => string[];
  dailyMax: (exerciseId: string) => DayPoint[];
  maxWeight: (exerciseId: string) => number;
  latestEntry: (exerciseId: string) => SetEntry | undefined;

  startWorkout: () => void;
  endWorkout: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const existing = load<Exercise[]>(EXERCISES_KEY, []);
    return existing.length ? existing : seedExercises();
  });
  const [entries, setEntries] = useState<SetEntry[]>(() => load<SetEntry[]>(ENTRIES_KEY, []));
  const [workoutStart, setWorkoutStart] = useState<number | null>(() =>
    load<number | null>(WORKOUT_KEY, null)
  );
  const [expandedMuscles, setExpandedMuscles] = useState<MuscleId[]>(["chest"]);
  const [homeFocusExerciseId, setHomeFocusExerciseId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(EXERCISES_KEY, JSON.stringify(exercises));
  }, [exercises]);
  useEffect(() => {
    localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  }, [entries]);
  useEffect(() => {
    localStorage.setItem(WORKOUT_KEY, JSON.stringify(workoutStart));
  }, [workoutStart]);

  const value = useMemo<StoreValue>(() => {
    const setsFor = (exerciseId: string, date: string) =>
      entries
        .filter((e) => e.exerciseId === exerciseId && e.date === date)
        .sort((a, b) => a.setNumber - b.setNumber);

    return {
      exercises,
      entries,
      workoutStart,
      expandedMuscles,
      homeFocusExerciseId,

      addExercise: (name, muscle, icon = "Dumbbell") => {
        setExercises((prev) => [...prev, { id: uid(), name: name.trim(), muscle, icon }]);
      },

      toggleMuscle: (id) => {
        setExpandedMuscles((prev) =>
          prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
        );
      },

      rememberHomeFocus: (exerciseId, muscle) => {
        setHomeFocusExerciseId(exerciseId);
        setExpandedMuscles((prev) => (prev.includes(muscle) ? prev : [...prev, muscle]));
      },

      deleteExercise: (id) => {
        setExercises((prev) => prev.filter((e) => e.id !== id));
        setEntries((prev) => prev.filter((e) => e.exerciseId !== id));
      },

      setsFor,

      saveDay: (exerciseId, date, rows) => {
        setEntries((prev) => {
          const others = prev.filter((e) => !(e.exerciseId === exerciseId && e.date === date));
          const fresh: SetEntry[] = [];
          let setNumber = 1;
          for (const row of rows) {
            if (row.reps > 0 || row.weight > 0) {
              fresh.push({
                id: uid(),
                exerciseId,
                date,
                setNumber,
                reps: row.reps,
                weight: row.weight,
              });
              setNumber += 1;
            }
          }
          return [...others, ...fresh];
        });
      },

      deleteDay: (exerciseId, date) => {
        setEntries((prev) =>
          prev.filter((e) => !(e.exerciseId === exerciseId && e.date === date))
        );
      },

      loggedDays: (exerciseId) => {
        const days = new Set(
          entries.filter((e) => e.exerciseId === exerciseId).map((e) => e.date)
        );
        return [...days].sort((a, b) => (a < b ? 1 : -1));
      },

      dailyMax: (exerciseId) => {
        const byDay = new Map<string, number>();
        for (const e of entries) {
          if (e.exerciseId !== exerciseId) continue;
          byDay.set(e.date, Math.max(byDay.get(e.date) ?? 0, e.weight));
        }
        return [...byDay.entries()]
          .map(([date, weight]) => ({ date, weight }))
          .sort((a, b) => (a.date < b.date ? -1 : 1));
      },

      maxWeight: (exerciseId) => {
        let max = 0;
        for (const e of entries) {
          if (e.exerciseId === exerciseId) max = Math.max(max, e.weight);
        }
        return max;
      },

      latestEntry: (exerciseId) => {
        const list = entries
          .filter((e) => e.exerciseId === exerciseId)
          .sort((a, b) => (a.date < b.date ? 1 : -1));
        return list[0];
      },

      startWorkout: () => setWorkoutStart(Date.now()),
      endWorkout: () => setWorkoutStart(null),
    };
  }, [exercises, entries, workoutStart, expandedMuscles, homeFocusExerciseId]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
