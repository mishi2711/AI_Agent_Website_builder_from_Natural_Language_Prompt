import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import Navbar from './components/Navbar';

function App() {
    return (
        <BrowserRouter>
            <div className="app-root">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/workspace/:projectId" element={<Workspace />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;
