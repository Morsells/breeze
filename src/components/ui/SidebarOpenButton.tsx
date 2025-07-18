import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

export default function SidebarOpenButton() {
  const { open, setOpen } = useSidebar();
  if (open) return null;

  return (
    <button
      onClick={() => setOpen(true)}
      className="fixed top-4 left-4 z-50 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition"
      aria-label="Open sidebar"
    >
      <Menu className="w-6 h-6 text-primary" />
    </button>
  );
}
