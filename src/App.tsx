import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signin from './Signin';
import Signup from './Signup';
import Todo from './todo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Todo />} />
        {/* <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} /> */}
        {/* <Route path="*" element={<Navigate to="/signin" replace />} /> */}
      </Routes>
    </Router>
  );
}

export default App;