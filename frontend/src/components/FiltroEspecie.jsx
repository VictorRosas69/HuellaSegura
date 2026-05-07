const FILTROS = [
  { valor: 'todos',  label: 'Todos',   icon: 'bi-grid' },
  { valor: 'perro',  label: 'Perros',  icon: 'bi-emoji-smile' },
  { valor: 'gato',   label: 'Gatos',   icon: 'bi-emoji-wink' },
  { valor: 'ave',    label: 'Aves',    icon: 'bi-feather' },
  { valor: 'reptil', label: 'Reptiles',icon: 'bi-bug' },
  { valor: 'otro',   label: 'Otros',   icon: 'bi-question-circle' },
];

export default function FiltroEspecie({ filtroActivo, onFiltroChange }) {
  return (
    <div className="d-flex flex-wrap gap-2" data-testid="filtro-especie">
      {FILTROS.map(({ valor, label, icon }) => (
        <button
          key={valor}
          className={`btn btn-sm ${filtroActivo === valor ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => onFiltroChange(valor)}
          data-testid={`filtro-${valor}`}
        >
          <i className={`bi ${icon} me-1`} />
          {label}
        </button>
      ))}
    </div>
  );
}
