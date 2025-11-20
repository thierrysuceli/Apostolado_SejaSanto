import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AdminArticleEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para create com query param editId
    navigate(`/admin/articles/create?editId=${id}`, { replace: true });
  }, [id, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
    </div>
  );
};

export default AdminArticleEdit;
