import Layout from "./components/layout"
import AppRoutes from "./components/layout/routes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "./context/auth-context"
//import './App.css'
function App() {
  const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
  return (
      <main>
          <QueryClientProvider client={queryClient}>
             <AuthProvider>
        <Layout>
          <AppRoutes />
        </Layout>
        </AuthProvider>
        </QueryClientProvider>
      </main>
   
  )
}

export default App
