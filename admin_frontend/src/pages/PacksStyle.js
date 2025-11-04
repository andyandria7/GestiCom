const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #f9fafb 0%, #ffffff 50%, #f1f5f9 100%)',
    padding: '20px',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
    color: '#0f172a'
  },
  header: {
    marginBottom: '20px'
  },
  title: {
    fontSize: '2rem',
    fontWeight: 800,
    background: 'linear-gradient(135deg, #0ea5e9, #6366f1, #10b981)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  productImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
    display: 'block',
    margin: '12px auto',
  }, grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', // ← plus petit
    gap: '20px'
  },
  newStyle: {
    color: 'red',
    fontWeight: 900
  },
  subtitle: {
    fontSize: '1rem', fontWeight: 500, color: '#475569'
  },
  alert: {
    padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px'
  },
  alertSuccess: {
    background: '#ecfdf5', color: '#065f46', borderLeft: '4px solid #10b981'
  },
  alertError: {
    background: '#fef2f2', color: '#7f1d1d', borderLeft: '4px solid #ef4444'
  },
  grid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '20px'
  },
  card: {
    background: '#fff', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', cursor: 'pointer', transition: '0.2s'
  },
  cardHover: {
    transform: 'translateY(-4px)', borderColor: '#c7d2fe', boxShadow: '0 10px 20px rgba(37,99,235,0.15)'
  },
  cardIcon: {
    width: '40px', height: '40px', borderRadius: '8px', background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem'
  },
  cardTitle: {
    fontSize: '1.2rem', fontWeight: 700, margin: '8px 0'
  },
  metric: {
    display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#f9fafb', marginTop: '8px'
  },
  metricLabel: {
    fontSize: '0.85rem', fontWeight: 600
  },
  metricValue: {
    fontWeight: 700
  },
  emptyState: {
    textAlign: 'center', padding: '40px 16px', background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb'
  },
  emptyIcon: {
    width: '70px', height: '70px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '2rem', color: '#475569'
  },
  form: {
    background: '#fff', borderRadius: '12px', padding: '20px', maxWidth: '500px', margin: '0 auto', boxShadow: '0 8px 20px rgba(0,0,0,0.05)'
  },
  input: {
    padding: '10px', fontSize: '1rem', border: '1px solid #d1d5db', borderRadius: '8px', width: '100%', marginBottom: '12px'
  },
  label: {
    display: 'block', fontWeight: 600, marginBottom: '6px'
  },
  row: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'
  },
  button: {
    padding: '10px', background: 'linear-gradient(to right,#10b981,#0ea5e9)', color: '#fff', fontWeight: 700, borderRadius: '8px', border: 'none', cursor: 'pointer', width: '100%'
  },
  modalOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '10px'
  },
  modal: {
    background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '600px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #e5e7eb'
  },
  modalTitle: {
    fontSize: '1.2rem', fontWeight: 700
  },
  closeBtn: {
    background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#6b7280'
  },
  openerWrap: {
    display: 'flex', justifyContent: 'flex-end', margin: '10px 0'
  },
  openerBtn: {
    padding: '8px 12px', background: 'linear-gradient(to right,#10b981,#0ea5e9)', color: '#fff', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer'
  },
  menuBtn: {
    position: 'absolute', top: '8px', right: '8px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#6b7280'
  },
  dropdown: {
    position: 'absolute', top: '28px', right: 0, background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 10px 15px rgba(0,0,0,0.1)', zIndex: 10, minWidth: '140px'
  },
  item: {
    width: '100%', textAlign: 'left', padding: '8px 10px', background: 'white', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#374151'
  },
  itemDestructive: {
    width: '100%', textAlign: 'left', padding: '8px 10px', background: 'white', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#dc2626'
  }
};

export default styles;
