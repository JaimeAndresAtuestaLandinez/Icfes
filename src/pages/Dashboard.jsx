import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Calculator, Globe, FlaskConical, Languages, Play } from 'lucide-react';

const icons = {
  'Matemáticas': <Calculator size={24} />,
  'Lectura Crítica': <BookOpen size={24} />,
  'Sociales y Ciudadanas': <Globe size={24} />,
  'Ciencias Naturales': <FlaskConical size={24} />,
  'Inglés': <Languages size={24} />
};

const Dashboard = ({ user }) => {
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const { data } = await api.get(`/questions/subjects?userId=${user.id}`);
        setSubjects(data);
      } catch (err) {
        console.error('Error fetching subjects', err);
      }
    };
    fetchSubjects();
  }, [user.id]);

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Hola, {user.username} 👋</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Selecciona una materia para comenzar tu práctica.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {subjects.map((subject, index) => (
          <motion.div 
            key={subject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card"
            style={{ 
                padding: '2rem', 
                borderRadius: '1.5rem', 
                cursor: subject.completed ? 'default' : 'pointer', 
                transition: 'transform 0.2s',
                opacity: subject.completed ? 0.8 : 1,
                border: subject.completed ? '2px solid hsl(var(--success))' : '1px solid transparent'
            }}
            whileHover={!subject.completed ? { scale: 1.03 } : {}}
            onClick={() => !subject.completed && navigate(`/exam/${subject.id}`)}
          >
            <div style={{ 
                background: subject.completed ? 'hsl(var(--success))' : 'hsl(var(--primary))', 
                color: 'white', 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '1.5rem' 
            }}>
              {icons[subject.name] || <BookOpen size={24} />}
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{subject.name}</h3>
            <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                {subject.completed 
                    ? 'Ya has completado esta práctica. Revisa tus estadísticas para ver tu progreso.' 
                    : 'Práctica con preguntas reales tipo ICFES y obtén resultados al instante.'}
            </p>
            <button 
                className={`btn ${subject.completed ? 'btn-success' : 'btn-primary'}`} 
                style={{ width: '100%', opacity: subject.completed ? 0.7 : 1 }}
                disabled={subject.completed}
            >
              {subject.completed ? 'Completado ✓' : 'Comenzar'} {!subject.completed && <Play size={16} />}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );

};

export default Dashboard;
