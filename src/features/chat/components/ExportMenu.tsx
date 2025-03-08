
import { useState } from "react";
import { ChatSession } from "@/types/chat";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileText } from "lucide-react";
import { exportChatAsText, exportChatAsPDF } from "@/lib/export-utils";
import { useToast } from "@/components/ui/use-toast";

interface ExportMenuProps {
  session: ChatSession | null;
}

export default function ExportMenu({ session }: ExportMenuProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (type: "markdown" | "pdf" | "text") => {
    if (!session || session.messages.length === 0) {
      toast({
        title: "Cannot Export",
        description: "There are no messages to export.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    
    try {
      if (type === "pdf") {
        await exportChatAsPDF(session);
      } else {
        exportChatAsText(session, type);
      }
      
      toast({
        title: "Export Successful",
        description: `Chat exported as ${type.toUpperCase()} file.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting the chat.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          disabled={!session || session.messages.length === 0 || isExporting}
          className="text-xs gap-1"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("markdown")}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Export as Markdown</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("text")}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Export as Text</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Export as PDF</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
