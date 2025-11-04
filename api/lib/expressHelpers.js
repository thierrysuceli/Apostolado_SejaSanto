// =====================================================
// HELPERS PARA EXPRESS
// Converte middlewares Vercel para Express
// =====================================================

/**
 * Wrapper para converter middleware Express em Promise
 * @param {Function} middleware - Middleware Express (req, res, next)
 * @returns {Promise}
 */
export function runMiddleware(middleware) {
  return (req, res) => new Promise((resolve, reject) => {
    middleware(req, res, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

/**
 * Executa múltiplos middlewares em sequência
 * @param {Array<Function>} middlewares - Array de middlewares
 * @returns {Function} - Função async que executa os middlewares
 */
export function composeMiddlewares(...middlewares) {
  return async (req, res) => {
    for (const middleware of middlewares) {
      await runMiddleware(middleware)(req, res);
    }
  };
}
