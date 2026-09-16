import { useEffect, useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { useStore } from "../store";
import { MUSCLES } from "../catalog";
import type { Exercise, MuscleId } from "../types";
import { Icon } from "../components/Icon";
import { WorkoutTimer } from "../components/WorkoutTimer";
import { AddExerciseModal } from "../components/AddExerciseModal";

export function HomeScreen() {
  const { exercises, deleteExercise, maxWeight, expandedMuscles, toggleMuscle, homeFocusExerciseId } =
    useStore();
  const [addMuscle, setAddMuscle] = useState<MuscleId | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!homeFocusExerciseId) return;
    const el = document.getElementById(`exercise-${homeFocusExerciseId}`);
    if (!el) return;
    el.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [homeFocusExerciseId, expandedMuscles]);

  function exercisesIn(muscle: MuscleId): Exercise[] {
    return exercises
      .filter((e) => e.muscle === muscle)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="screen">
      <header className="app-header">
        <h1>My Gym Progress</h1>
      </header>

      <WorkoutTimer />

      {MUSCLES.map((m) => {
        const items = exercisesIn(m.id);
        const isOpen = expandedMuscles.includes(m.id);
        return (
          <section
            key={m.id}
            className={`muscle-card ${isOpen ? "open" : ""}`}
            style={{ "--accent": m.color } as CSSProperties}
          >
            <button className="muscle-header" onClick={() => toggleMuscle(m.id)}>
              <span className="muscle-icon">
                <Icon name={m.icon} size={22} color="#fff" />
              </span>
              <span className="muscle-title">
                <strong>{m.name}</strong>
                <small>{items.length} exercises</small>
              </span>
              <ChevronRight
                size={20}
                className="chevron"
                style={{ transform: isOpen ? "rotate(90deg)" : "none" }}
              />
            </button>

            {isOpen && (
              <div className="muscle-body">
                {items.map((ex) => {
                  const best = maxWeight(ex.id);
                  return (
                    <div id={`exercise-${ex.id}`} key={ex.id} className="exercise-row">
                      <button
                        className="exercise-main"
                        onClick={() => navigate(`/exercise/${ex.id}`)}
                      >
                        <span className="exercise-icon">
                          <Icon name={ex.icon} size={18} color="#fff" />
                        </span>
                        <span className="exercise-name">{ex.name}</span>
                        <span className="exercise-best">
                          {best > 0 ? `${best} kg` : "—"}
                        </span>
                        <ChevronRight size={16} className="muted" />
                      </button>
                      <button
                        className="icon-btn danger"
                        aria-label={`Delete ${ex.name}`}
                        onClick={() => {
                          if (confirm(`Delete "${ex.name}" and its history?`)) {
                            deleteExercise(ex.id);
                          }
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  );
                })}

                <button className="add-row" onClick={() => setAddMuscle(m.id)}>
                  <Plus size={18} /> Add Exercise
                </button>
              </div>
            )}
          </section>
        );
      })}

      {addMuscle && (
        <AddExerciseModal initialMuscle={addMuscle} onClose={() => setAddMuscle(null)} />
      )}

      <p className="footer-note">
        Tip: add this app to your Home Screen for an app-like experience.
      </p>
      <div aria-hidden style={{ height: 24 }} />
    </div>
  );
}
