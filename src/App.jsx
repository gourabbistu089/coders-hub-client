import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Body from "./components/Body";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";
import Connections from "./pages/Connections";
import Request from "./pages/Request";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Body />}>
          <Route index element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Feed />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/requests" element={<Request />} />

        </Route>
      </Routes>
    </>
  );
}

export default App;
