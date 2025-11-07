import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          navigate('/');
        } else {
          setError(result.error);
        }
      } else {
        if (!formData.name || !formData.email || !formData.password) {
          setError('Todos os campos são obrigatórios');
          return;
        }
        const result = await register(formData.name, formData.email, formData.password);
        if (result.success) {
          navigate('/');
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('Erro ao processar sua solicitação');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-beige-50 dark:bg-gray-950 dark:bg-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
          <h2 className="text-3xl font-bold text-secondary-700 dark:text-gray-200">
            {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
          </h2>
          <p className="mt-2 text-secondary-600 dark:text-gray-300 dark:text-gray-300">
            {isLogin ? 'Entre com suas credenciais' : 'Junte-se ao apostolado'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-beige-100 dark:bg-gray-900 border border-beige-200 dark:border-gray-700 rounded-xl p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-secondary-500 dark:text-gray-400 mb-2">
                  Nome Completo
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white dark:bg-gray-800 text-secondary-500 dark:text-gray-400 rounded-lg px-4 py-3 border border-beige-200 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                  placeholder="Seu nome"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-500 dark:text-gray-400 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white dark:bg-gray-800 text-secondary-500 dark:text-gray-400 rounded-lg px-4 py-3 border border-beige-200 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-500 dark:text-gray-400 mb-2">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-white dark:bg-gray-800 text-secondary-500 dark:text-gray-400 rounded-lg px-4 py-3 border border-beige-200 dark:border-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
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
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold hover:bg-primary-600 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
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
        </div>
      </div>
    </div>
  );
};

export default Login;
