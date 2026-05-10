import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Avicultura from "./pages/Avicultura";
import AviculturaSectorAvicola from "./pages/AviculturaSectorAvicola";
import AviculturaSectorGandero from "./pages/AviculturaSectorGandero";
import AviculturaSectorFructifero from "./pages/AviculturaSectorFructifero";
import Ganaderia from "./pages/Ganaderia";
import Sanitario from "./pages/Sanitario";
// import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas, sin login */}
          <Route path="/*" element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/avicultura" element={<Avicultura />} />
                <Route path="/avicultura/avicola" element={<AviculturaSectorAvicola />} />
                <Route path="/avicultura/gandero" element={<AviculturaSectorGandero />} />
                <Route path="/avicultura/fructifero" element={<AviculturaSectorFructifero />} />
                <Route path="/ganaderia" element={<Ganaderia />} />
                <Route path="/sanitario" element={<Sanitario />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
