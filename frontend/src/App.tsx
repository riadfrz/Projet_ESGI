import { ToastProvider } from '@/components/ui/Toast'
import AppRoutes from '@/routes/AppRoutes'
import './App.css'

function App() {
  return (
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
  )
}

export default App
