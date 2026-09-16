import { Routes, Route } from "react-router-dom";
import { HomeScreen } from "./screens/HomeScreen";
import { ExerciseScreen } from "./screens/ExerciseScreen";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/exercise/:id" element={<ExerciseScreen />} />
    </Routes>
  );
}
