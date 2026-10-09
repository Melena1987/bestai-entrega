import { useState } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { FiX, FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error al iniciar sesión con Google');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Cuenta creada con éxito');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Sesión iniciada con éxito');
      }
      onClose();
    } catch (error) {
      console.error(error);
      alert('Error en la autenticación: ' + error.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}><FiX size={24} /></button>
        <h2>{isRegister ? 'Crear Cuenta' : 'Iniciar Sesión'}</h2>
        
        <button className="btn-social" onClick={handleGoogleLogin}>
          <FcGoogle size={20} style={{ marginRight: '10px' }} />
          Continuar con Google
        </button>

        <div className="divider">
          <span>O</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FiMail className="input-icon" />
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <FiLock className="input-icon" />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {isRegister ? 'Registrarse' : 'Entrar'}
          </button>
        </form>

        <p className="toggle-auth" onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
