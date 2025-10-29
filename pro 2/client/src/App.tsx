import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminBarbers from "./pages/admin/Barbers";
import AdminServices from "./pages/admin/Services";
import AdminAppointments from "./pages/admin/Appointments";
import AdminRoute from "./components/AdminRoute";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/servicos"} component={Services} />
      <Route path={"/agendar"} component={Booking} />
      
      {/* Admin Routes */}
      <Route path="/admin">
        {() => (
          <AdminRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminRoute>
        )}
      </Route>
      <Route path="/admin/barbeiros">
        {() => (
          <AdminRoute>
            <AdminLayout>
              <AdminBarbers />
            </AdminLayout>
          </AdminRoute>
        )}
      </Route>
      <Route path="/admin/servicos">
        {() => (
          <AdminRoute>
            <AdminLayout>
              <AdminServices />
            </AdminLayout>
          </AdminRoute>
        )}
      </Route>
      <Route path="/admin/agendamentos">
        {() => (
          <AdminRoute>
            <AdminLayout>
              <AdminAppointments />
            </AdminLayout>
          </AdminRoute>
        )}
      </Route>
      
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
