
import { ChatMessage, ChatSession } from "@/types/chat";
import { jsPDF } from "jspdf";

// Format the chat messages for export
export function formatChatForExport(session: ChatSession, format: "markdown" | "text"): string {
  const title = `# ${session.title}\n\n`;
  const date = `Date: ${new Date(session.createdAt).toLocaleDateString()}\n\n`;
  
  const messages = session.messages.map((msg) => {
    const sender = msg.role === "user" ? "You" : "Assistant";
    if (format === "markdown") {
      return `**${sender}**:\n\n${msg.content}\n\n---\n\n`;
    } else {
      return `${sender}:\n${msg.content}\n\n`;
    }
  }).join("");
  
  return title + date + messages;
}

// Export chat as a text file (markdown or plain text)
export function exportChatAsText(session: ChatSession, format: "markdown" | "text") {
  if (!session) return;
  
  const content = formatChatForExport(session, format);
  const fileExtension = format === "markdown" ? "md" : "txt";
  const fileName = `${session.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_${new Date().toISOString().split("T")[0]}.${fileExtension}`;
  
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Export chat as PDF
export async function exportChatAsPDF(session: ChatSession) {
  if (!session) return;
  
  const doc = new jsPDF();
  const titleFontSize = 16;
  const regularFontSize = 12;
  const smallFontSize = 10;
  const lineHeight = 7;
  const margin = 20;
  let y = margin;
  
  // Add title
  doc.setFontSize(titleFontSize);
  doc.text(session.title, margin, y);
  y += lineHeight * 1.5;
  
  // Add date
  doc.setFontSize(smallFontSize);
  doc.text(`Date: ${new Date(session.createdAt).toLocaleDateString()}`, margin, y);
  y += lineHeight * 2;
  
  // Add messages
  doc.setFontSize(regularFontSize);
  
  session.messages.forEach((msg, index) => {
    const sender = msg.role === "user" ? "You" : "Assistant";
    
    // Add sender
    doc.setFont("helvetica", "bold");
    doc.text(`${sender}:`, margin, y);
    y += lineHeight;
    
    // Add message content
    doc.setFont("helvetica", "normal");
    
    // Split long text into multiple lines
    const contentLines = doc.splitTextToSize(msg.content, doc.internal.pageSize.width - margin * 2);
    
    // Check if we need a new page
    if (y + contentLines.length * lineHeight > doc.internal.pageSize.height - margin) {
      doc.addPage();
      y = margin;
    }
    
    doc.text(contentLines, margin, y);
    y += contentLines.length * lineHeight + lineHeight;
    
    // Add separator
    if (index < session.messages.length - 1) {
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y - lineHeight / 2, doc.internal.pageSize.width - margin, y - lineHeight / 2);
      y += lineHeight;
    }
    
    // Check if we need a new page for the next message
    if (y > doc.internal.pageSize.height - margin * 2) {
      doc.addPage();
      y = margin;
    }
  });
  
  const fileName = `${session.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
}
