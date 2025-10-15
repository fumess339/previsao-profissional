import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";

export default function ProtectedAdminRoute({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const userData = await base44.auth.me();
        
        if (userData.role !== "admin") {
          // User is not an admin, redirect to admin login
          navigate(createPageUrl("AdminLogin"), { replace: true });
          return;
        }
        
        setIsAuthorized(true);
      } catch (error) {
        // User is not authenticated, redirect to admin login
        navigate(createPageUrl("AdminLogin"), { replace: true });
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return children;
}
