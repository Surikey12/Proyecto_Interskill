import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Exchanges from "./pages/Exchange";
import ChatList from "./pages/ChatList";
import Chat from "./pages/Chat";
import History from "./pages/History";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = "/" element={<Home />} />
        <Route path = "/login" element={<Login />} />
        <Route path = "/profile" element={<Profile />} />
        <Route path = "/search" element={<Search />} />
        <Route path = "/exchanges" element={<Exchanges />} />
        <Route path = "/chat" element={<ChatList />} />
        <Route path = "/chat/:exchangeId" element={<Chat />} />
        <Route path = "/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
