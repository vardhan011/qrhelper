import { Routes, Route } from 'react-router-dom';
import UserForm from './components/UserForm.jsx';
import ViewUser from './pages/ViewUser.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<UserForm />} />
      <Route path="/view/:id" element={<ViewUser />} />
    </Routes>
  );
}

export default App;
