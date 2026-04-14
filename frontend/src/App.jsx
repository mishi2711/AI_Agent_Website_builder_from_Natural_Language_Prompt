import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
    return (
        <BrowserRouter>
            <div className="app-root font-body text-on-background selection:bg-primary selection:text-black min-h-screen flex flex-col">
                <Navbar />
                <main className="main-content flex-grow flex flex-col pt-16">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/workspace/:projectId" element={<Workspace />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
