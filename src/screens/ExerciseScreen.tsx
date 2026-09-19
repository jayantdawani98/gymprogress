import { useEffect, useState, type CSSProperties } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Pencil } from "lucide-react";
import { useStore } from "../store";
import { muscleMeta } from "../catalog";
import { ProgressChart } from "../components/ProgressChart";
import { WeightScroller } from "../components/WeightScroller";

interface Row {
  reps: number;
  weight: number;
}

export function ExerciseScreen() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const store = useStore();

  const exercise = store.exercises.find((e) => e.id === id);
  const meta = muscleMeta(exercise?.muscle ?? "other");

  useEffect(() => {
    if (!exercise) return;
    store.rememberHomeFocus(exercise.id, exercise.muscle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise?.id, exercise?.muscle]);

  const [date, setDate] = useState(() => {
    const d = new Date();
    const tz = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - tz).toISOString().slice(0, 10);
  });
  const [rows, setRows] = useState<Row[]>([]);
  const [savedFlash, setSavedFlash] = useState(false);

  // Load the selected day's saved sets (or 3 default rows) whenever the
  // exercise or date changes.
  useEffect(() => {
    if (!exercise) return;
    const saved = store.setsFor(exercise.id, date);
    if (saved.length > 0) {
      setRows(saved.map((s) => ({ reps: s.reps, weight: s.weight })));
    } else {
      const prefill = store.latestEntry(exercise.id)?.weight ?? 0;
      setRows([
        { reps: 12, weight: prefill },
        { reps: 12, weight: prefill },
        { reps: 12, weight: prefill },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, date]);

  if (!exercise) {
    return (
      <div className="screen">
        <header className="detail-header">
          <button className="icon-btn" onClick={() => navigate("/")}>
            <ArrowLeft size={22} />
          </button>
          <h1>Not found</h1>
        </header>
      </div>
    );
  }

  const color = meta.color;
  const chartData = store.dailyMax(exercise.id);
  const days = store.loggedDays(exercise.id);

  function update(index: number, field: keyof Row, value: number) {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  }
  function addRow() {
    const last = rows[rows.length - 1];
    setRows((prev) => [...prev, { reps: last?.reps ?? 12, weight: last?.weight ?? 0 }]);
  }
  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index));
  }
  function save() {
    store.saveDay(exercise!.id, date, rows);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1200);
  }

  return (
    <div className="screen" style={{ "--accent": color } as CSSProperties}>
      <header className="detail-header">
        <button className="icon-btn" onClick={() => navigate("/")} aria-label="Back">
          <ArrowLeft size={22} />
        </button>
        <h1>{exercise.name}</h1>
      </header>

      <div className="card">
        <h3 className="card-title">Top Set Progress</h3>
        <p className="card-sub">Heaviest set logged each day</p>
        <ProgressChart data={chartData} color={color} />
      </div>

      <div className="card">
        <h3 className="card-title">Add / Update Weight</h3>

        <label className="field-label">Date</label>
        <input
          className="text-input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="set-table">
          <div className="set-row head">
            <span className="col-set">Set</span>
            <span className="col-reps">Reps</span>
            <span className="col-weight">Weight (kg)</span>
            <span className="col-del" />
          </div>

          {rows.map((row, i) => (
            <div className="set-row" key={i}>
              <span className="col-set set-number">{i + 1}</span>
              <span className="col-reps">
                {/* Reps wheel: whole numbers 1–50 */}
                <WeightScroller
                  value={row.reps}
                  onChange={(v) => update(i, "reps", v)}
                  min={1}
                  max={50}
                  step={1}
                  tint={color}
                />
              </span>
              <span className="col-weight">
                {/* Weight wheel: 0.5 kg increments */}
                <WeightScroller
                  value={row.weight}
                  onChange={(v) => update(i, "weight", v)}
                  step={0.5}
                  tint={color}
                />
              </span>
              <button
                className="icon-btn danger col-del"
                aria-label="Remove set"
                onClick={() => removeRow(i)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <button className="add-row inline" onClick={addRow}>
          <Plus size={18} /> Add Set
        </button>

        <button className="btn btn-primary full" onClick={save}>
          {savedFlash ? "Saved \u2713" : "Save"}
        </button>
      </div>

      <div className="card">
        <h3 className="card-title">History</h3>
        {days.length === 0 ? (
          <p className="card-sub">No entries yet. Add your sets above and tap Save.</p>
        ) : (
          <div className="history-list">
            {days.map((day) => {
              const sets = store.setsFor(exercise.id, day);
              const top = Math.max(...sets.map((s) => s.weight));
              return (
                <div className="history-row" key={day}>
                  <button
                    className="history-main"
                    onClick={() => {
                      setDate(day);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <span>
                      <strong>{new Date(day + "T00:00:00").toLocaleDateString(undefined, {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}</strong>
                      <small>
                        {sets.length} sets · top {top} kg
                      </small>
                    </span>
                    <Pencil size={16} style={{ color }} />
                  </button>
                  <button
                    className="icon-btn danger"
                    aria-label="Delete day"
                    onClick={() => {
                      if (confirm("Delete this day's entries?")) {
                        store.deleteDay(exercise.id, day);
                      }
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div aria-hidden style={{ height: 32 }} />
    </div>
  );
}
