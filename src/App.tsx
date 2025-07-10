
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { TaskProvider } from "./contexts/TaskContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import Clients from "./pages/Clients";
import Prospects from "./pages/Prospects";
import InactiveClients from "./pages/InactiveClients";
import MHA from "./pages/MHA";
import Events from "./pages/Events";
import ClientAlumni from "./pages/ClientAlumni";
import OtherTasks from "./pages/OtherTasks";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <ProtectedRoute>
            <div className="min-h-screen bg-white">
              <Header />
              <div className="container mx-auto px-4 py-4">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/prospects" element={<Prospects />} />
                  <Route path="/inactive" element={<InactiveClients />} />
                  <Route path="/mha" element={<MHA />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/alumni" element={<ClientAlumni />} />
                  <Route path="/tasks" element={<OtherTasks />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </div>
          </ProtectedRoute>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
