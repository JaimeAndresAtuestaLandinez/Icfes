import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronRight, ChevronLeft, Send, CheckCircle2 } from 'lucide-react';

const Exam = ({ user }) => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [examId, setExamId] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const initExam = async () => {
      try {
        const qRes = await api.get(`/questions?subjectId=${subjectId}&limit=10`);
        setQuestions(qRes.data);
        
        const eRes = await api.post('/exams/start', { 
          userId: user.id, 
          totalQuestions: qRes.data.length 
        });
        setExamId(eRes.data.examId);
      } catch (err) {
        console.error('Error starting exam', err);
      }
    };
    initExam();
  }, [subjectId, user.id]);

  useEffect(() => {
    if (timeLeft <= 0 && !isFinished) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const handleSelect = (option) => {
    setAnswers({ ...answers, [questions[currentIndex].id]: option });
  };

  const handleSubmit = async () => {
    try {
      const responses = Object.entries(answers).map(([qId, opt]) => ({
        questionId: parseInt(qId),
        selectedOption: opt
      }));
      const { data } = await api.post('/exams/submit', { 
        examId, 
        responses,
        userId: user.id,
        subjectName: subjectId // En este caso subjectId es el nombre de la materia
      });
      setResults(data);
      setIsFinished(true);
    } catch (err) {
      console.error('Error submitting exam', err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isFinished) {
    return (
      <div className="animate-fade-in" style={{ textAlign: 'center', maxWidth: '600px', margin: '4rem auto' }}>
        <div className="glass-card" style={{ padding: '3rem', borderRadius: '2rem' }}>
          <CheckCircle2 size={64} color="hsl(var(--success))" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>¡Examen Finalizado!</h2>
          <div style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '1rem', color: 'hsl(var(--primary))' }}>
            {results?.score}%
          </div>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Has respondido correctamente {results?.correctAnswers} de {results?.totalQuestions} preguntas.
          </p>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/stats')}>
            Ver Estadísticas
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return <div>Cargando preguntas...</div>;

  const currentQ = questions[currentIndex];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: timeLeft < 60 ? 'hsl(var(--error))' : 'inherit' }}>
          <Clock size={20} /> {formatTime(timeLeft)}
        </div>
        <div style={{ background: 'hsl(var(--accent))', padding: '0.4rem 1rem', borderRadius: '1rem', fontSize: '0.9rem', fontWeight: '600' }}>
          Pregunta {currentIndex + 1} de {questions.length}
        </div>
      </div>

      <div style={{ height: '8px', background: 'hsl(var(--border))', borderRadius: '4px', marginBottom: '3rem', overflow: 'hidden' }}>
        <div style={{ height: '100%', background: 'hsl(var(--primary))', width: `${((currentIndex + 1) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card"
          style={{ padding: '2.5rem', borderRadius: '1.5rem', marginBottom: '2rem' }}
        >
          <h2 style={{ fontSize: '1.25rem', marginBottom: '2rem', lineHeight: '1.6' }}>{currentQ.question_text}</h2>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {['A', 'B', 'C', 'D'].map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                style={{ 
                  textAlign: 'left', 
                  padding: '1.25rem', 
                  borderRadius: '1rem', 
                  border: `2px solid ${answers[currentQ.id] === opt ? 'hsl(var(--primary))' : 'hsl(var(--border))'}`,
                  background: answers[currentQ.id] === opt ? 'hsl(var(--accent))' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  gap: '1rem'
                }}
              >
                <span style={{ fontWeight: '700', color: answers[currentQ.id] === opt ? 'hsl(var(--primary))' : '#999' }}>{opt}.</span>
                <span>{currentQ[`option_${opt.toLowerCase()}`]}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Botón anterior eliminado para impedir retroceder */}
        <div></div> 

        
        {currentIndex === questions.length - 1 ? (
          <button className="btn btn-primary" style={{ background: 'hsl(var(--success))' }} onClick={handleSubmit}>
            Finalizar Examen <Send size={18} />
          </button>
        ) : (
          <button className="btn btn-primary" onClick={() => setCurrentIndex(prev => prev + 1)}>
            Siguiente <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Exam;
