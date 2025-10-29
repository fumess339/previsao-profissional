import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "./ui/button";
import { Shield } from "lucide-react";
import { Link } from "wouter";

export default function AdminLink() {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <Button asChild variant="outline" size="sm">
      <Link href="/admin">
        <Shield className="mr-2 h-4 w-4" />
        Área Administrativa
      </Link>
    </Button>
  );
}
