import { useState } from "react";
import { X } from "lucide-react";
import { MUSCLES } from "../catalog";
import type { MuscleId } from "../types";
import { useStore } from "../store";

export function AddExerciseModal({
  initialMuscle,
  onClose,
}: {
  initialMuscle: MuscleId;
  onClose: () => void;
}) {
  const { addExercise } = useStore();
  const [name, setName] = useState("");
  const [muscle, setMuscle] = useState<MuscleId>(initialMuscle);

  const canSave = name.trim().length > 0;

  function save() {
    if (!canSave) return;
    addExercise(name, muscle);
    onClose();
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>New Exercise</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={22} />
          </button>
        </div>

        <label className="field-label">Name</label>
        <input
          className="text-input"
          placeholder="e.g. Bench Press"
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
        />

        <label className="field-label">Muscle Group</label>
        <select
          className="text-input"
          value={muscle}
          onChange={(e) => setMuscle(e.target.value as MuscleId)}
        >
          {MUSCLES.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>

        <button className="btn btn-primary full" disabled={!canSave} onClick={save}>
          Save Exercise
        </button>
      </div>
    </div>
  );
}
