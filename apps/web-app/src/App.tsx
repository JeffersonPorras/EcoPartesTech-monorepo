import { LoginView } from './components/LoginView/LoginView';

export function App() {
  return (
    <LoginView
      onLoginSuccess={(user) => {
        console.log('Usuario autenticado:', user);
      }}
    />
  );
}

export default App;