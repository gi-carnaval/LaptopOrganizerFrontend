import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/axios';
import { passwordIncorrect } from '../pages/Cart/AddLaptop/LaptopNotifications';

export async function useAdminAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPassword = async () => {

      const sessionPassword = sessionStorage.getItem('adminPassword');

      if (!sessionPassword) {
        const password = prompt("Por favor, insira a senha de administrador:");
        console.log("password: ", password);
        if (password) {
          try {
            await api.put('/auth', { password });
            sessionStorage.setItem('adminPassword', password);
            
          } catch (error) {
            passwordIncorrect('Senha incorreta');
            navigate("..", { relative: "path" });
          }
        } else {
          console.log("Entrou no else")
          navigate("..", { relative: "path" });
        }
      }
    };

    verifyPassword();
  }, [navigate]);
}