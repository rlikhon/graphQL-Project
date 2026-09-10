import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import UserList from "./components/UserList";


function App() {  

  return (
    <>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Navigate to="/login" />} /> */}
          <Route path="/" element={<UserList />} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/register" element={<div>Register Page</div>} />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
          <Route path="/users" element={<UserList />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
