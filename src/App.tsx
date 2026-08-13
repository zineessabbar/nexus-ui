import Sidebar from '@/components/chat/Sidebar/Sidebar'
import { ChatArea } from '@/components/chat/ChatArea'

function App() {
  return (
    <div className="flex h-screen bg-background/80">
      <Sidebar />
      <ChatArea />
    </div>
  )
}

export default App
