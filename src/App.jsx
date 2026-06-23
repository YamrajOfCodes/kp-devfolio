import "./App.css";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import SmoothScroll from "./utils/SmoothScroll";
import Cursor from "./components/Cursor";
import { TransitionProvider } from "./components/PageTransition";
import MealManager from "./pages/Elevate";
import SnapSense from "./pages/ImageInteraction";

function App() {
  return (
    <SmoothScroll>
      <Cursor />
      <TransitionProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/meal-manager" element={<MealManager />} />
          <Route path="/image-interaction" element={<SnapSense />} />
        </Routes>
      </TransitionProvider>
    </SmoothScroll>
  );
}

export default App;
