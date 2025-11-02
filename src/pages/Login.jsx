import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = ({ onNavigate }) => {
  const { login, register, loginAsMember, loginAsAdmin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const result = login(formData.email, formData.password);
      if (result.success) {
        onNavigate('home');
      } else {
        setError(result.error);
      }
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Todos os campos são obrigatórios');
        return;
      }
      const result = register(formData.name, formData.email, formData.password);
      if (result.success) {
        onNavigate('home');
      } else {
        setError(result.error);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleQuickLogin = (type) => {
    if (type === 'member') {
      loginAsMember();
    } else {
      loginAsAdmin();
    }
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-beige-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-6">
            <img 
              src="/Apostolado_PNG.png" 
              alt="Apostolado Seja Santo" 
              className="w-full h-full object-contain drop-shadow-xl"
            />
          </div>
          <h2 className="text-3xl font-bold text-secondary-700">
            {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
          </h2>
          <p className="mt-2 text-secondary-600">
            {isLogin ? 'Entre com suas credenciais' : 'Junte-se ao apostolado'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-beige-100 border border-beige-200 rounded-xl p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-secondary-500 mb-2">
                  Nome Completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white text-secondary-500 rounded-lg px-4 py-3 border border-beige-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                  placeholder="Seu nome"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-500 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white text-secondary-500 rounded-lg px-4 py-3 border border-beige-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-500 mb-2">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white text-secondary-500 rounded-lg px-4 py-3 border border-beige-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-600 transition-colors shadow-md"
            >
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ name: '', email: '', password: '' });
              }}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              {isLogin ? 'Não tem uma conta? Registre-se' : 'Já tem uma conta? Faça login'}
            </button>
          </div>

          {/* Quick Login Buttons (for testing) */}
          <div className="mt-8 pt-6 border-t border-beige-200">
            <p className="text-secondary-600 text-sm text-center mb-4">Login Rápido (Demonstração)</p>
            <div className="space-y-3">
              <button
                onClick={() => handleQuickLogin('member')}
                className="w-full bg-white border border-beige-200 text-secondary-500 py-2 rounded-lg hover:bg-beige-50 transition-colors text-sm shadow-sm"
              >
                Login como Membro
              </button>
              <button
                onClick={() => handleQuickLogin('admin')}
                className="w-full bg-white border border-beige-200 text-secondary-500 py-2 rounded-lg hover:bg-beige-50 transition-colors text-sm shadow-sm"
              >
                Login como Admin
              </button>
            </div>
          </div>

          {isLogin && (
            <div className="mt-6 bg-white border border-beige-200 rounded-lg p-4">
              <p className="text-secondary-600 text-xs mb-2">Credenciais de teste:</p>
              <p className="text-secondary-500 text-xs"><strong>Membro:</strong> membro@apostolado.com / membro123</p>
              <p className="text-secondary-500 text-xs"><strong>Admin:</strong> admin@apostolado.com / admin123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
