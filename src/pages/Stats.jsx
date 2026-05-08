import { useState, useEffect } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Award, History, TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Stats = ({ user }) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get(`/exams/stats/${user.id}`);
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user.id]);

  const formatDate = (dateString) => {
    if (!dateString) return '---';
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short' }).format(date);
    } catch (e) {
        return '---';
    }
  };

  const chartData = {
    labels: stats.map(s => formatDate(s.created_at)).reverse(),
    datasets: [
      {
        label: 'Puntaje (%)',
        data: stats.map(s => s.score).reverse(),
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };


  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false }
    },
    scales: {
      y: { min: 0, max: 100 }
    }
  };

  if (loading) return <div>Cargando estadísticas...</div>;

  const averageScore = stats.length > 0 
    ? Math.round(stats.reduce((acc, curr) => acc + curr.score, 0) / stats.length) 
    : 0;

  return (
    <div className="animate-fade-in">
      <h1 style={{ fontSize: '2.25rem', marginBottom: '2.5rem' }}>Tu Progreso</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <Award size={32} color="hsl(var(--warning))" />
            <div>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Puntaje Promedio</p>
              <h2 style={{ fontSize: '1.75rem' }}>{averageScore}%</h2>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#888' }}>Basado en tus últimos {stats.length} exámenes.</p>
        </div>

        <div className="glass-card" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <TrendingUp size={32} color="hsl(var(--success))" />
            <div>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Exámenes Completados</p>
              <h2 style={{ fontSize: '1.75rem' }}>{stats.length}</h2>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#888' }}>¡Sigue practicando para mejorar!</p>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem', borderRadius: '1.5rem', marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={20} /> Tendencia de Rendimiento
        </h3>
        <div style={{ height: '300px' }}>
          {stats.length > 0 ? <Line data={chartData} options={options} /> : <p style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>No hay datos suficientes para mostrar el gráfico.</p>}
        </div>
      </div>

      <div className="glass-card" style={{ padding: '2rem', borderRadius: '1.5rem' }}>
        <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <History size={20} /> Historial de Exámenes
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid hsl(var(--border))', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Fecha</th>
                <th style={{ padding: '1rem' }}>Preguntas</th>
                <th style={{ padding: '1rem' }}>Materia</th>

                <th style={{ padding: '1rem' }}>Puntaje</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '1rem' }}>{formatDate(s.created_at)}</td>
                  <td style={{ padding: '1rem' }}>{s.total_questions}</td>
                  <td style={{ padding: '1rem' }}>{s.exam_title || 'Práctica'}</td>
                  <td style={{ padding: '1rem', fontWeight: '700', color: s.score >= 60 ? 'hsl(var(--success))' : 'hsl(var(--error))' }}>{s.score}%</td>
                </tr>

              ))}
            </tbody>
          </table>
          {stats.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Aún no has realizado ningún examen.</p>}
        </div>
      </div>
    </div>
  );
};

export default Stats;
