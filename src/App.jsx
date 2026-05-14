import React, { useState, useMemo } from 'react';

// --- Mock Data ---
const INITIAL_TASKS = [
  { id: 1, title: '完成專案提案報告', project: '工作', priority: 'urgent', dueDate: '2026-05-15', completed: false },
  { id: 2, title: '預約牙醫門診', project: '個人', priority: 'normal', dueDate: '2026-05-16', completed: true },
  { id: 3, title: '健身房運動 1 小時', project: '健康', priority: 'normal', dueDate: '2026-05-15', completed: false },
  { id: 4, title: '規劃週末旅行行程', project: '個人', priority: 'low', dueDate: '2026-05-20', completed: false },
];

const PROJECTS = ['全部', '工作', '個人', '健康', '學習'];

// --- Components ---

const Sidebar = ({ activeView, setActiveView }) => {
  const menuItems = [
    { id: 'dashboard', label: '儀表板', icon: '📊' },
    { id: 'tasks', label: '我的任務', icon: '✅' },
    { id: 'calendar', label: '行事曆', icon: '📅' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span style={{fontSize: '2rem'}}>🎯</span>
        <span>TaskMaster</span>
      </div>
      <nav className="nav-section">
        <p className="nav-label">主要選單</p>
        {menuItems.map(item => (
          <button 
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => setActiveView(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <nav className="nav-section">
        <p className="nav-label">專案分類</p>
        {PROJECTS.slice(1).map(project => (
          <button key={project} className="nav-item">
            <span style={{fontSize: '0.8rem'}}>📁</span>
            {project}
          </button>
        ))}
      </nav>
    </aside>
  );
};

const Header = ({ searchQuery, setSearchQuery }) => {
  return (
    <header className="header">
      <div className="search-bar">
        <span>🔍</span>
        <input 
          type="text" 
          placeholder="搜尋任務..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>管理員用戶</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>專業版帳號</p>
        </div>
        <div style={{ 
          width: '40px', height: '40px', borderRadius: '50%', 
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold'
        }}>
          U
        </div>
      </div>
    </header>
  );
};

const TaskCard = ({ task, onToggle, onDelete }) => {
  const getTagClass = (priority) => {
    if (priority === 'urgent') return 'tag-urgent';
    if (priority === 'normal') return 'tag-work';
    return 'tag-personal';
  };

  const getPriorityLabel = (priority) => {
    const labels = { urgent: '緊急', normal: '普通', low: '低度' };
    return labels[priority] || '普通';
  };

  return (
    <div className="task-card">
      <div 
        className={`checkbox ${task.completed ? 'checked' : ''}`}
        onClick={() => onToggle(task.id)}
      >
        {task.completed && <span style={{color: 'white', fontSize: '12px'}}>✓</span>}
      </div>
      <div className="task-info">
        <p className={`task-title ${task.completed ? 'completed' : ''}`}>{task.title}</p>
        <div className="task-meta">
          <span className={`tag ${getTagClass(task.priority)}`}>{getPriorityLabel(task.priority)}</span>
          <span>📂 {task.project}</span>
          <span>📅 {task.dueDate}</span>
        </div>
      </div>
      <button 
        style={{ color: 'var(--danger)', opacity: 0.6 }}
        onClick={() => onDelete(task.id)}
      >
        🗑️
      </button>
    </div>
  );
};

const Dashboard = ({ tasks, setActiveView }) => {
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      <div className="dashboard-grid">
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)' }}>
          <p className="stat-title">總任務數</p>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)' }}>
          <p className="stat-title">待處理</p>
          <p className="stat-value" style={{ color: 'var(--warning)' }}>{stats.pending}</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)' }}>
          <p className="stat-title">已完成</p>
          <p className="stat-value" style={{ color: 'var(--success)' }}>{stats.completed}</p>
        </div>
      </div>
      
      <div className="task-container">
        <div className="section-header">
          <h2 style={{ fontSize: '1.25rem' }}>近期重點</h2>
          <button style={{ color: var(--primary), fontWeight: 600 }} onClick={() => setActiveView('tasks')}>查看全部 →</button>
        </div>
        {tasks.filter(t => !t.completed).slice(0, 3).map(task => (
          <TaskCard key={task.id} task={task} onToggle={() => {}} onDelete={() => {}} />
        ))}
      </div>
    </div>
  );
};

const CalendarView = ({ tasks }) => {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  // Mocking current month (May 2026)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const startDayOffset = 5; // May 1st 2026 is Friday

  return (
    <div className="task-container" style={{ animation: 'fadeIn 0.3s ease' }}>
      <div className="section-header">
        <h2 style={{ fontSize: '1.25rem' }}>2026年 5月</h2>
      </div>
      <div className="calendar-grid">
        {days.map(d => <div key={d} className="calendar-day-header">{d}</div>)}
        {Array.from({ length: startDayOffset }).map((_, i) => <div key={`empty-${i}`} className="calendar-cell" style={{background: '#f8fafc'}}></div>)}
        {daysInMonth.map(day => {
          const dateStr = `2026-05-${day.toString().padStart(2, '0')}`;
          const dayTasks = tasks.filter(t => t.dueDate === dateStr);
          const isToday = day === 15;

          return (
            <div key={day} className={`calendar-cell ${isToday ? 'today' : ''}`}>
              <p className="calendar-date" style={{ color: isToday ? 'var(--primary)' : 'inherit' }}>{day}</p>
              <div className="calendar-task-dots">
                {dayTasks.map(t => (
                  <div key={t.id} className="task-dot" style={{ 
                    background: t.priority === 'urgent' ? '#fee2e2' : '#dbeafe',
                    color: t.priority === 'urgent' ? '#b91c1c' : '#1d4ed8',
                    borderLeft: `2px solid ${t.priority === 'urgent' ? '#ef4444' : '#3b82f6'}`
                  }}>
                    {t.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TaskModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ title: '', project: '工作', priority: 'normal', dueDate: '2026-05-15' });

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 style={{ marginBottom: '1.5rem' }}>新增任務</h2>
        <div className="form-group">
          <label>任務名稱</label>
          <input 
            type="text" 
            placeholder="要做什麼呢？" 
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>專案分類</label>
            <select value={formData.project} onChange={(e) => setFormData({...formData, project: e.target.value})}>
              {PROJECTS.slice(1).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>優先級</label>
            <select value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
              <option value="urgent">緊急</option>
              <option value="normal">普通</option>
              <option value="low">低度</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>截止日期</label>
          <input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button className="btn-add" style={{ flex: 1, justifyContent: 'center' }} onClick={() => onSave(formData)}>儲存任務</button>
          <button style={{ flex: 1, background: '#f1f5f9', borderRadius: 'var(--radius-md)' }} onClick={onClose}>取消</button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [activeView, setActiveView] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [tasks, searchQuery]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    if (window.confirm('確定要刪除此任務嗎？')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const addTask = (data) => {
    const newTask = {
      id: Date.now(),
      ...data,
      completed: false
    };
    setTasks([newTask, ...tasks]);
    setIsModalOpen(false);
  };

  return (
    <div className="app-container">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <main className="main-content">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        {activeView === 'dashboard' && <Dashboard tasks={filteredTasks} setActiveView={setActiveView} />}
        
        {activeView === 'tasks' && (
          <div className="task-container" style={{ animation: 'fadeIn 0.3s ease' }}>
            <div className="section-header">
              <div>
                <h2 style={{ fontSize: '1.5rem' }}>我的任務</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>今日有 {tasks.filter(t => !t.completed).length} 個待辦事項</p>
              </div>
              <button className="btn-add" onClick={() => setIsModalOpen(true)}>
                <span>+</span> 新增任務
              </button>
            </div>
            
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                <button style={{ paddingBottom: '0.5rem', borderBottom: '2px solid var(--primary)', fontWeight: 600 }}>全部</button>
                <button style={{ paddingBottom: '0.5rem', color: 'var(--text-muted)' }}>待處理</button>
                <button style={{ paddingBottom: '0.5rem', color: 'var(--text-muted)' }}>已完成</button>
              </div>
              
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <TaskCard key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍃</p>
                  <p>目前沒有符合條件的任務</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === 'calendar' && <CalendarView tasks={filteredTasks} />}
      </main>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={addTask} 
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
