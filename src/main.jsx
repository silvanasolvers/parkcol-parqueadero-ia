import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Camera,
  Car,
  Bike,
  CreditCard,
  ShieldCheck,
  Smartphone,
  BarChart3,
  Clock3,
  AlertTriangle,
  CheckCircle2,
  ScanLine,
  ReceiptText,
  Zap,
  RotateCcw,
  LogIn,
  LogOut,
  QrCode,
  DoorOpen,
  Keyboard,
  Plus,
  WalletCards,
  UserCheck,
  CircleDollarSign,
} from 'lucide-react';
import './styles.css';

const money = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});


const automationSteps = [
  {
    title: 'Ingreso',
    current: 'Hoy: cámara sirve de apoyo y el cajero digita la placa.',
    automated: 'Smart Control lee la placa, toma foto y crea el ticket automático.',
  },
  {
    title: 'Pago',
    current: 'Hoy: el cliente depende de caja para saber cuánto debe.',
    automated: 'El cliente paga por QR/link y el pago queda conciliado con la placa.',
  },
  {
    title: 'Salida',
    current: 'Hoy: alguien valida manualmente si puede salir.',
    automated: 'La cámara de salida valida pago/reglas y abre o bloquea la barrera.',
  },
  {
    title: 'Cierre',
    current: 'Hoy: cierres y diferencias dependen del cajero y de revisar sistemas.',
    automated: 'El dueño recibe Turno 02 cerrado: efectivo, digital, diferencias y recibos.',
  },
];

const startingVehicles = [
  { plate: 'PVT33F', type: 'Moto', service: 'Mensualidad', status: 'Dentro', paid: true, entry: '10:50', amount: 0, owner: 'Juan Camilo Londoño' },
  { plate: 'HZH40F', type: 'Moto', service: 'Horas', status: 'Debe pagar', paid: false, entry: '09:16', amount: 9000, owner: 'Visitante' },
  { plate: 'KXL70E', type: 'Carro', service: 'Valet', status: 'Valet solicitado', paid: true, entry: '08:42', amount: 18000, owner: 'Valet Parkcol' },
  { plate: 'IXA14F', type: 'Moto', service: 'Amanecida', status: 'Debe pagar', paid: false, entry: '22:31', amount: 15000, owner: 'Visitante' },
];

function Pill({ children, tone = 'blue' }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

function LoginScreen({ onLogin }) {
  return <main className="login-page">
    <section className="pitch-panel">
      <Pill>Demo privado para Parkcol</Pill>
      <h1>Su parqueadero, convertido en un centro de control inteligente.</h1>
      <p>Una demostración simple: ingresar, leer placa, cobrar, validar salida y cerrar caja desde el celular.</p>
      <div className="pitch-points">
        <span><CheckCircle2 /> Menos filas en caja</span>
        <span><CheckCircle2 /> Menos errores por digitación</span>
        <span><CheckCircle2 /> Más control para el dueño</span>
      </div>
    </section>

    <section className="login-card">
      <div className="brand-lockup">
        <div className="brand-mark">P</div>
        <div>
          <strong>Parkcol Smart Control</strong>
          <small>Acceso operador / administrador</small>
        </div>
      </div>

      <label>Usuario</label>
      <input value="oswaldo" readOnly />
      <label>Contraseña</label>
      <input value="••••••••" readOnly type="password" />
      <button className="primary full" onClick={onLogin}><LogIn size={18} /> Iniciar demo</button>
      <p className="login-hint">Para la presentación: solo dale clic a “Iniciar demo”.</p>
    </section>
  </main>;
}

function Metric({ icon: Icon, label, value, hint }) {
  return <article className="metric">
    <Icon size={21} />
    <div><small>{label}</small><strong>{value}</strong><span>{hint}</span></div>
  </article>;
}

function ActionButton({ icon: Icon, title, subtitle, onClick, tone = 'blue' }) {
  return <button className={`big-action ${tone}`} onClick={onClick}>
    <span><Icon size={24} /></span>
    <div><strong>{title}</strong><small>{subtitle}</small></div>
  </button>;
}


function WowAutomation({ onRun }) {
  return <section className="wow-panel">
    <div className="wow-copy">
      <Pill>Modo futuro Parkcol</Pill>
      <h2>Un operador IA vigilando ingreso, pago y salida en tiempo real.</h2>
      <p>La idea visual: Parkcol ya no depende de perseguir placas y recibos. El sistema ve, decide y avisa.</p>
      <button className="primary" onClick={onRun}><Zap size={17} /> Activar escena automática</button>
    </div>

    <div className="holo-stage" aria-label="Escena futurista de automatización">
      <div className="holo-orbit orbit-one" />
      <div className="holo-orbit orbit-two" />
      <div className="ai-robot">
        <div className="robot-antenna" />
        <div className="robot-head">
          <div className="robot-eye left" />
          <div className="robot-eye right" />
          <div className="robot-mouth" />
        </div>
        <div className="robot-body">
          <span>AI</span>
          <small>CONTROL</small>
        </div>
      </div>
      <div className="scan-beam" />
      <div className="smart-road">
        <div className="road-line" />
        <div className="moving-car"><Car size={28} /></div>
        <div className="smart-gate"><span /></div>
      </div>
      <div className="floating-card plate-float"><strong>HZH40F</strong><small>Placa leída</small></div>
      <div className="floating-card pay-float"><QrCode size={20} /><small>Pago QR OK</small></div>
      <div className="floating-card exit-float"><ShieldCheck size={20} /><small>Salida aprobada</small></div>
      <div className="pulse-dot dot-a" />
      <div className="pulse-dot dot-b" />
      <div className="pulse-dot dot-c" />
    </div>
  </section>;
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [vehicles, setVehicles] = useState(startingVehicles);
  const [selectedPlate, setSelectedPlate] = useState('HZH40F');
  const [manualPlate, setManualPlate] = useState('');
  const [manualType, setManualType] = useState('Moto');
  const [message, setMessage] = useState('Selecciona una acción para iniciar la operación.');
  const [gateOpen, setGateOpen] = useState(false);
  const [qrPlate, setQrPlate] = useState(null);
  const [shiftClosed, setShiftClosed] = useState(false);
  const [automationStep, setAutomationStep] = useState(0);
  const [events, setEvents] = useState([
    'PVT33F ingresó como mensualidad activa',
    'HZH40F pendiente de pago',
    'Turno 02 abierto en caja principal',
  ]);

  const selected = vehicles.find((v) => v.plate === selectedPlate) || vehicles[0];
  const unpaid = vehicles.filter((v) => !v.paid).reduce((sum, v) => sum + v.amount, 0);
  const paidToday = 135000 + vehicles.filter((v) => v.paid).reduce((sum, v) => sum + v.amount, 0);
  const activeAutomation = automationSteps[automationStep];

  const statusTone = useMemo(() => {
    if (!selected) return 'blue';
    if (selected.status.includes('Bloqueado') || selected.status.includes('Debe')) return 'orange';
    if (selected.status.includes('Salida')) return 'green';
    return 'blue';
  }, [selected]);

  function addEvent(text) {
    setEvents((prev) => [`Ahora · ${text}`, ...prev].slice(0, 5));
  }

  function advanceAutomation() {
    const next = (automationStep + 1) % automationSteps.length;
    setAutomationStep(next);
    const step = automationSteps[next];

    if (next === 0) {
      setSelectedPlate('HZH40F');
      setGateOpen(false);
      setQrPlate(null);
      setMessage('Escenario ingreso: la cámara lee la placa y crea el ticket sin que el cajero tenga que digitar todo.');
      addEvent('Escenario: lectura automática de placa en ingreso');
    }
    if (next === 1) {
      setSelectedPlate('HZH40F');
      setQrPlate('HZH40F');
      setGateOpen(false);
      setMessage('Escenario pago: HZH40F recibe QR/link y el pago queda unido automáticamente a su placa.');
      addEvent('Escenario: QR de pago enviado al cliente');
    }
    if (next === 2) {
      setSelectedPlate('HZH40F');
      setQrPlate(null);
      setGateOpen(true);
      setVehicles((prev) => prev.map((v) => v.plate === 'HZH40F' ? { ...v, paid: true, status: 'Salida aprobada' } : v));
      setMessage('Escenario salida: la cámara valida que HZH40F ya pagó y la barrera abre automáticamente.');
      addEvent('Escenario: salida automática aprobada para HZH40F');
    }
    if (next === 3) {
      setShiftClosed(true);
      setGateOpen(false);
      setMessage('Escenario cierre: Turno 02 queda resumido para el dueño con efectivo, digital y diferencias.');
      addEvent('Escenario: cierre automático enviado al celular');
    }
  }


  function runWowScene() {
    setAutomationStep(2);
    setSelectedPlate('HZH40F');
    setQrPlate(null);
    setGateOpen(true);
    setShiftClosed(false);
    setVehicles((prev) => prev.map((v) => v.plate === 'HZH40F' ? { ...v, paid: true, status: 'Salida aprobada' } : v));
    setMessage('Escena automática: la IA leyó HZH40F, confirmó pago QR, autorizó salida y abrió barrera sin intervención manual.');
    addEvent('WOW: IA leyó placa + validó pago + abrió barrera');
  }

  function cameraScan() {
    const monthlyInside = vehicles.some((v) => v.service === 'Mensualidad' && v.status === 'Dentro');
    const newVehicle = {
      plate: 'LPR24A', type: 'Moto', service: 'Mensualidad', status: monthlyInside ? 'Bloqueado' : 'Dentro', paid: true,
      entry: 'Ahora', amount: 0, owner: 'Mensualidad Familia Ríos',
    };
    setVehicles((prev) => prev.some((v) => v.plate === 'LPR24A') ? prev.map((v) => v.plate === 'LPR24A' ? newVehicle : v) : [newVehicle, ...prev]);
    setSelectedPlate('LPR24A');
    setGateOpen(!monthlyInside);
    setQrPlate(null);
    setMessage(monthlyInside ? 'La cámara leyó LPR24A, pero el sistema bloqueó la entrada: esa mensualidad ya tiene una placa adentro.' : 'La cámara leyó LPR24A y autorizó el ingreso automáticamente.');
    addEvent(monthlyInside ? 'LPR24A bloqueada por regla 2 placas / 1 adentro' : 'LPR24A ingresó por cámara');
  }

  function manualEntry() {
    const plate = manualPlate.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    if (!plate) {
      setMessage('Escribe una placa para ingresarla manualmente.');
      return;
    }
    const newVehicle = {
      plate,
      type: manualType,
      service: 'Horas',
      status: 'Dentro',
      paid: false,
      entry: 'Ahora',
      amount: manualType === 'Carro' ? 12000 : 9000,
      owner: 'Ingreso manual por cajero',
    };
    setVehicles((prev) => prev.some((v) => v.plate === plate) ? prev.map((v) => v.plate === plate ? newVehicle : v) : [newVehicle, ...prev]);
    setSelectedPlate(plate);
    setManualPlate('');
    setGateOpen(true);
    setQrPlate(null);
    setMessage(`${plate} fue ingresada manualmente. Queda registrada con foto pendiente y cobro por horas.`);
    addEvent(`${plate} ingresada manualmente por caja`);
  }

  function generateQR() {
    setQrPlate(selected.plate);
    setGateOpen(false);
    setMessage(`QR de pago generado para ${selected.plate}. El cliente puede pagar sin pasar por caja.`);
    addEvent(`QR generado para ${selected.plate}`);
  }

  function approvePayment() {
    setVehicles((prev) => prev.map((v) => v.plate === selectedPlate ? { ...v, paid: true, status: 'Pago aprobado', amount: v.amount } : v));
    setQrPlate(null);
    setMessage(`Pago aprobado para ${selectedPlate}. La salida queda habilitada.`);
    addEvent(`Pago aprobado para ${selectedPlate}`);
  }

  function validateExit() {
    const vehicle = vehicles.find((v) => v.plate === selectedPlate);
    if (vehicle?.paid && !vehicle.status.includes('Bloqueado')) {
      setGateOpen(true);
      setVehicles((prev) => prev.map((v) => v.plate === selectedPlate ? { ...v, status: 'Salida aprobada' } : v));
      setMessage(`${selectedPlate} puede salir. Barrera abierta automáticamente.`);
      addEvent(`Salida aprobada para ${selectedPlate}`);
    } else {
      setGateOpen(false);
      setMessage(`${selectedPlate} no puede salir todavía: tiene pago pendiente o una regla bloqueada.`);
      addEvent(`Salida bloqueada para ${selectedPlate}`);
    }
  }

  function closeShift() {
    setShiftClosed(true);
    setMessage('Turno 02 cerrado. El dueño recibe resumen de caja, pagos digitales, efectivo y diferencias.');
    addEvent('Cierre TURNO02 enviado al celular del dueño');
  }

  function resetDemo() {
    setVehicles(startingVehicles);
    setSelectedPlate('HZH40F');
    setManualPlate('');
    setManualType('Moto');
    setMessage('Selecciona una acción para iniciar la operación.');
    setGateOpen(false);
    setQrPlate(null);
    setShiftClosed(false);
    setAutomationStep(0);
    setEvents(['PVT33F ingresó como mensualidad activa', 'HZH40F pendiente de pago', 'Turno 02 abierto en caja principal']);
  }

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  return <main className="system-page">
    <header className="app-header">
      <div className="brand-lockup">
        <div className="brand-mark">P</div>
        <div><strong>Parkcol Smart Control</strong><small>Principal · TURNO02</small></div>
      </div>
      <div className="header-actions">
        <button className="ghost" onClick={resetDemo}><RotateCcw size={17} /> Reiniciar</button>
        <button className="ghost" onClick={() => setLoggedIn(false)}><LogOut size={17} /> Salir</button>
      </div>
    </header>

    <section className="attention-strip">
      <div>
        <Pill>Operación en vivo</Pill>
        <h1>Así se vería la automatización en Parkcol.</h1>
      </div>
      <p>La diferencia frente a lo que ya tienen: el sistema no solo registra; automatiza ingreso, pago, salida y cierre.</p>
    </section>

    <WowAutomation onRun={runWowScene} />

    <section className="automation-story panel">
      <div className="story-head">
        <div>
          <Pill>Diferencia clave</Pill>
          <h2>{activeAutomation.title}: de operación manual a operación automática</h2>
        </div>
        <button className="primary" onClick={advanceAutomation}><Zap size={17} /> Avanzar escenario</button>
      </div>
      <div className="compare-grid">
        <div className="compare-card current"><span>Lo que hoy pasa</span><strong>{activeAutomation.current}</strong></div>
        <div className="compare-arrow">→</div>
        <div className="compare-card future"><span>Con Parkcol Smart Control</span><strong>{activeAutomation.automated}</strong></div>
      </div>
      <div className="automation-flow">
        {automationSteps.map((item, index) => <button key={item.title} onClick={() => setAutomationStep(index)} className={index === automationStep ? 'flow-chip active' : 'flow-chip'}>{index + 1}. {item.title}</button>)}
      </div>
    </section>

    <section className="metrics-row">
      <Metric icon={Car} label="Ocupación" value="114" hint="486 celdas restantes" />
      <Metric icon={Camera} label="Cámaras" value="10" hint="Ingreso, salida y zonas" />
      <Metric icon={CircleDollarSign} label="Recaudo" value={money.format(paidToday)} hint={`Pendiente ${money.format(unpaid)}`} />
      <Metric icon={ReceiptText} label="Turno" value="02" hint={shiftClosed ? 'Cerrado' : 'En operación'} />
    </section>

    <section className="main-grid">
      <div className="left-stack">
        <article className="panel hero-panel">
          <div className="camera-stage">
            <div className="camera-label"><ScanLine size={16} /> CAMARA INGRESO / SALIDA</div>
            <div className={gateOpen ? 'barrier open' : 'barrier'}>{gateOpen ? 'BARRERA ABIERTA' : 'BARRERA CERRADA'}</div>
            <div className="plate-focus">
              <span>PLACA ACTUAL</span>
              <strong>{selected.plate}</strong>
              <small>{selected.type} · {selected.service}</small>
            </div>
          </div>
          <div className="result-message"><AlertTriangle size={18} /> {message}</div>
        </article>

        <article className="panel manual-panel">
          <div className="panel-title"><Keyboard size={20} /><div><strong>Ingreso manual de placa</strong><small>Para cuando la cámara no lea bien una moto o una placa esté tapada.</small></div></div>
          <div className="manual-form">
            <input placeholder="Ej: HZH40F" value={manualPlate} onChange={(e) => setManualPlate(e.target.value.toUpperCase())} maxLength={6} />
            <select value={manualType} onChange={(e) => setManualType(e.target.value)}>
              <option>Moto</option>
              <option>Carro</option>
            </select>
            <button className="primary" onClick={manualEntry}><Plus size={18} /> Ingresar</button>
          </div>
        </article>
      </div>

      <aside className="panel action-panel">
        <div className="panel-title"><Zap size={20} /><div><strong>Acciones rápidas</strong><small>Haz clic y mira cómo cambia el sistema.</small></div></div>
        <div className="action-grid">
          <ActionButton icon={Camera} title="Leer placa por cámara" subtitle="Simula LPR / ANPR" onClick={cameraScan} />
          <ActionButton icon={QrCode} title="Generar QR de pago" subtitle="Pago autoservicio" onClick={generateQR} tone="green" />
          <ActionButton icon={DoorOpen} title="Validar salida" subtitle="Abre o bloquea barrera" onClick={validateExit} tone="purple" />
          <ActionButton icon={Smartphone} title="Cerrar turno" subtitle="Enviar al celular" onClick={closeShift} tone="gold" />
        </div>

        {qrPlate && <div className="qr-card">
          <div className="qr-icon"><QrCode size={54} /></div>
          <div><strong>QR listo para {qrPlate}</strong><small>Valor: {money.format(selected.amount)}</small><button onClick={approvePayment} className="secondary"><WalletCards size={16} /> Aprobar pago demo</button></div>
        </div>}
      </aside>
    </section>

    <section className="bottom-grid">
      <article className="panel">
        <div className="panel-title"><UserCheck size={20} /><div><strong>Placas dentro</strong><small>Selecciona una para cobrar o validar salida.</small></div></div>
        <div className="vehicle-list">
          {vehicles.map((v) => <button key={v.plate} className={selectedPlate === v.plate ? 'vehicle selected' : 'vehicle'} onClick={() => { setSelectedPlate(v.plate); setMessage(`${v.plate} seleccionada. Servicio: ${v.service}.`); }}>
            <strong>{v.plate}</strong>
            <span>{v.type}</span>
            <span>{v.service}</span>
            <small className={v.paid ? 'ok' : 'debt'}>{v.paid ? 'Pago OK' : money.format(v.amount)}</small>
          </button>)}
        </div>
      </article>

      <article className="panel">
        <div className="panel-title"><BarChart3 size={20} /><div><strong>Caja resumida</strong><small>Lo que el dueño quiere ver.</small></div></div>
        <div className="cash-cards">
          <div><span>Horas carro</span><strong>{money.format(45000)}</strong></div>
          <div><span>Horas moto</span><strong>{money.format(90000)}</strong></div>
          <div><span>Digital</span><strong>{money.format(76000)}</strong></div>
          <div><span>Efectivo</span><strong>{money.format(59000)}</strong></div>
        </div>
      </article>

      <article className="panel">
        <div className="panel-title"><Clock3 size={20} /><div><strong>Bitácora</strong><small>Cada clic deja rastro.</small></div></div>
        <div className="events">
          {events.map((event) => <div key={event}>{event}</div>)}
        </div>
      </article>
    </section>

  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
