import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="p-4 rounded-2xl bg-muted mb-5">
        <FileQuestion className="w-10 h-10 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-display font-bold mb-2">Page not found</h1>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <a>
          <Button className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </a>
      </Link>
    </div>
  );
}
