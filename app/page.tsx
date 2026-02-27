import ChatWindow from "@/components/chatWindow";

export const metadata = {
  title: "Chat Copilot",
  description: "Streaming Chat Copilot with Gemini + Tool Calling"
};

export default function Page() {
  return (
    <main className="h-screen w-screen bg-white text-black">
      <ChatWindow />
    </main>
  );
}