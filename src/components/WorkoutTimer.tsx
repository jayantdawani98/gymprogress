import { useEffect, useState } from "react";
import { Play, Square, Timer } from "lucide-react";
import { useStore } from "../store";

function format(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

export function WorkoutTimer() {
  const { workoutStart, startWorkout, endWorkout } = useStore();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (workoutStart == null) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [workoutStart]);

  const active = workoutStart != null;
  const elapsed = active ? Math.max(0, (now - workoutStart) / 1000) : 0;

  return (
    <div className={`timer-card ${active ? "active" : ""}`}>
      {active ? (
        <>
          <div className="timer-display">
            <Timer size={26} />
            <span>{format(elapsed)}</span>
          </div>
          <button className="btn btn-on-color" onClick={endWorkout}>
            <Square size={18} fill="currentColor" /> End Workout
          </button>
        </>
      ) : (
        <button className="btn btn-on-color btn-big" onClick={startWorkout}>
          <Play size={20} fill="currentColor" /> Start Workout
        </button>
      )}
    </div>
  );
}
