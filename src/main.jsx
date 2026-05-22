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
  LockKeyhole,
  Crown,
  Zap,
  ArrowRight,
  Play,
  RotateCcw,
  MonitorSmartphone,
  BadgeDollarSign,
  Users,
  CalendarCheck,
  KeyRound,
  QrCode,
  DoorOpen,
  WalletCards,
  RadioTower,
  CircleDollarSign,
  ClipboardCheck,
} from 'lucide-react';
import './styles.css';

const money = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

const baseVehicles = [
  { plate: 'PVT33F', type: 'Moto', service: 'Mensualidad', status: 'Dentro', paid: true, entry: '10:50', amount: 0, owner: 'Juan Camilo Londoño', camera: 'CAMARA INGRESO 02', gate: 'Ingreso motos', note: 'Mensualidad activa · placa principal' },
  { plate: 'HZH40F', type: 'Moto', service: 'Horas', status: 'Debe pagar', paid: false, entry: '09:16', amount: 9000, owner: 'Visitante', camera: 'CAMARA INGRESO 01', gate: 'Salida motos', note: 'Ticket por horas pendiente' },
  { plate: 'KXL70E', type: 'Carro', service: 'Valet', status: 'Valet solicitado', paid: true, entry: '08:42', amount: 18000, owner: 'Valet Parkcol', camera: 'CAMARA INGRESO 03', gate: 'Valet recepción', note: 'Entrega solicitada por el cliente' },
  { plate: 'IXA14F', type: 'Moto', service: 'Amanecida', status: 'Dentro', paid: false, entry: '22:31', amount: 15000, owner: 'Visitante', camera: 'CAMARA INGRESO 02', gate: 'Zona amanecida', note: 'Tarifa nocturna pendiente' },
];

const modules = [
  { key: 'entrada', icon: ScanLine, label: 'Ingreso con placa', action: 'Detectar placa' },
  { key: 'pago', icon: QrCode, label: 'Pago autoservicio', action: 'Generar QR de pago' },
  { key: 'salida', icon: DoorOpen, label: 'Salida automática', action: 'Validar salida' },
  { key: 'cierre', icon: Smartphone, label: 'Cierre móvil', action: 'Cerrar Turno 02' },
];

const services = [
  { title: 'Mensualidad', icon: Crown, detail: 'Dos placas autorizadas, pero solo una puede estar adentro.', value: 'Consecutivo mensual intacto' },
  { title: 'Por horas', icon: Clock3, detail: 'Tarifa calculada por placa, tiempo y tipo de vehículo.', value: 'Carro / moto separado' },
  { title: 'Amanecida', icon: CalendarCheck, detail: 'Regla nocturna automática con alerta de permanencia.', value: 'Control especial' },
  { title: 'Valet parking', icon: KeyRound, detail: 'Recepción, custodia, solicitud y entrega trazable.', value: 'Sin perder llaves' },
  { title: 'Caja y cierres', icon: ReceiptText, detail: '3 turnos, recaudos, diferencias y cierre desde celular.', value: 'TURNO02 auditado' },
];

const scriptByScenario = {
  entrada: [
    { icon: Camera, title: 'Cámara captura', text: 'Una de las 10 cámaras toma foto de la placa al entrar.' },
    { icon: ScanLine, title: 'Lectura automática', text: 'Smart Control lee placa, tipo de vehículo y carril.' },
    { icon: LockKeyhole, title: 'Reglas Parkcol', text: 'Valida mensualidad, pico y placa, valet o visitante por horas.' },
    { icon: ClipboardCheck, title: 'Ticket digital', text: 'Crea el registro y lo deja visible en caja, tablero y celular.' },
  ],
  pago: [
    { icon: QrCode, title: 'QR / link', text: 'Cliente escanea, digita placa o usa kiosko para ver valor.' },
    { icon: WalletCards, title: 'Medios de pago', text: 'Nequi, PSE, tarjeta, efectivo o convenio según operación.' },
    { icon: CheckCircle2, title: 'Conciliación', text: 'Pago entra directo a caja y queda unido al recibo/consecutivo.' },
    { icon: ShieldCheck, title: 'Salida habilitada', text: 'La placa queda autorizada para salir sin fila.' },
  ],
  salida: [
    { icon: Camera, title: 'Cámara salida', text: 'Lee placa en carril de salida y busca el registro activo.' },
    { icon: CreditCard, title: 'Valida pago', text: 'Revisa si hay deuda, mensualidad activa o autorización valet.' },
    { icon: DoorOpen, title: 'Abre barrera', text: 'Si cumple las reglas, marca salida aprobada.' },
    { icon: AlertTriangle, title: 'Alerta si falla', text: 'Si falta pago o hay regla bloqueada, avisa a caja y celular.' },
  ],
  cierre: [
    { icon: ReceiptText, title: 'Turno 02', text: 'Cajero finaliza turno desde caja o desde celular autorizado.' },
    { icon: CircleDollarSign, title: 'Recaudo separado', text: 'Horas carro, horas moto, mensualidad, valet y amanecida.' },
    { icon: BarChart3, title: 'Cruce automático', text: 'Compara efectivo, digital, recibos y diferencias.' },
    { icon: Smartphone, title: 'Dueño informado', text: 'Envía cierre con resumen, alertas y auditoría.' },
  ],
};

function Pill({ children, tone = 'neutral' }) {
  return <span className={`pill ${tone}`}>{children}</span>;
}

function Metric({ icon: Icon, label, value, hint, tone = 'blue' }) {
  return <article className={`metric ${tone}`}>
    <span className="metric-icon"><Icon size={20} /></span>
    <div>
      <p>{label}</p>
      <strong>{value}</strong>
      <small>{hint}</small>
    </div>
  </article>;
}

function App() {
  const [vehicles, setVehicles] = useState(baseVehicles);
  const [scenario, setScenario] = useState('entrada');
  const [selectedPlate, setSelectedPlate] = useState('HZH40F');
  const [stage, setStage] = useState(0);
  const [mobileMode, setMobileMode] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [qrReady, setQrReady] = useState(false);
  const [shiftClosed, setShiftClosed] = useState(false);
  const [events, setEvents] = useState([
    '09:16 · HZH40F ingresó por CAMARA INGRESO 01',
    '10:50 · PVT33F validada como mensualidad activa',
    '10:52 · Caja TURNO02 registra recaudo parcial $135.000',
  ]);

  const script = scriptByScenario[scenario];
  const selected = vehicles.find((v) => v.plate === selectedPlate) || vehicles[0];
  const unpaid = vehicles.filter((v) => !v.paid).reduce((sum, v) => sum + v.amount, 0);
  const paidToday = 135000 + vehicles.filter((v) => v.paid).reduce((sum, v) => sum + v.amount, 0);
  const occupancy = vehicles.filter((v) => v.status !== 'Salida aprobada').length + 110;

  const scenarioTitle = modules.find((m) => m.key === scenario)?.label;
  const scenarioAction = modules.find((m) => m.key === scenario)?.action;

  const ruleMessage = useMemo(() => {
    if (selected.plate === 'LPR24A') return 'Mensualidad bloqueada: este cliente tiene dos placas autorizadas, pero ya hay una adentro. Requiere salida previa o autorización.';
    if (selected.service === 'Valet') return 'Valet: se notifica al operador, se valida custodia de llaves y se registra hora de entrega.';
    if (!selected.paid) return 'Pago pendiente: el sistema puede generar QR/link de pago y habilitar salida cuando se apruebe.';
    return 'Vehículo validado: reglas cumplidas, sin alerta de caja.';
  }, [selected]);

  function log(message) {
    setEvents((prev) => [`Ahora · ${message}`, ...prev].slice(0, 6));
  }

  function selectModule(key) {
    setScenario(key);
    setStage(0);
    setGateOpen(false);
    if (key !== 'pago') setQrReady(false);
    log(`Módulo abierto: ${modules.find((m) => m.key === key).label}`);
  }

  function nextStep() {
    setStage((prev) => Math.min(prev + 1, script.length - 1));
    log(`${scenarioTitle}: ${script[Math.min(stage + 1, script.length - 1)].title}`);
  }

  function runScenario() {
    if (scenario === 'entrada') return simulateEntry();
    if (scenario === 'pago') return generatePayment();
    if (scenario === 'salida') return validateExit();
    return closeShift();
  }

  function simulateEntry() {
    const monthlyAlreadyInside = vehicles.some((v) => v.service === 'Mensualidad' && v.status === 'Dentro');
    const newVehicle = {
      plate: 'LPR24A', type: 'Moto', service: 'Mensualidad', status: monthlyAlreadyInside ? 'Bloqueado' : 'Dentro', paid: true,
      entry: 'Ahora', amount: 0, owner: 'Mensualidad: Familia Ríos', camera: 'CAMARA INGRESO 01', gate: 'Ingreso motos',
      note: monthlyAlreadyInside ? 'Segunda placa intentando entrar' : 'Mensualidad autorizada',
    };
    setVehicles((prev) => prev.some((v) => v.plate === 'LPR24A') ? prev.map((v) => v.plate === 'LPR24A' ? newVehicle : v) : [newVehicle, ...prev]);
    setSelectedPlate('LPR24A');
    setStage(3);
    setGateOpen(!monthlyAlreadyInside);
    log(monthlyAlreadyInside ? 'LPR24A bloqueada por regla mensualidad 2 placas / 1 adentro' : 'LPR24A ingresó automáticamente');
  }

  function generatePayment() {
    setQrReady(true);
    setStage(1);
    setScenario('pago');
    log(`QR de pago generado para ${selected.plate} por ${money.format(selected.amount)}`);
  }

  function approvePayment() {
    setVehicles((prev) => prev.map((v) => v.plate === selectedPlate ? { ...v, paid: true, status: 'Salida habilitada', note: 'Pago digital aprobado y conciliado' } : v));
    setQrReady(false);
    setStage(3);
    log(`Pago aprobado y conciliado para ${selectedPlate}`);
  }

  function validateExit() {
    setScenario('salida');
    const vehicle = vehicles.find((v) => v.plate === selectedPlate);
    if (vehicle?.paid && vehicle.status !== 'Bloqueado') {
      setGateOpen(true);
      setStage(2);
      setVehicles((prev) => prev.map((v) => v.plate === selectedPlate ? { ...v, status: 'Salida aprobada' } : v));
      log(`Salida aprobada para ${selectedPlate}; barrera abierta`);
    } else {
      setGateOpen(false);
      setStage(3);
      log(`Salida bloqueada para ${selectedPlate}; pago o regla pendiente`);
    }
  }

  function closeShift() {
    setScenario('cierre');
    setShiftClosed(true);
    setStage(3);
    log('TURNO02 cerrado desde vista móvil del dueño');
  }

  function resetDemo() {
    setVehicles(baseVehicles);
    setScenario('entrada');
    setSelectedPlate('HZH40F');
    setStage(0);
    setGateOpen(false);
    setQrReady(false);
    setShiftClosed(false);
    setEvents([
      '09:16 · HZH40F ingresó por CAMARA INGRESO 01',
      '10:50 · PVT33F validada como mensualidad activa',
      '10:52 · Caja TURNO02 registra recaudo parcial $135.000',
    ]);
  }

  return <main className={mobileMode ? 'app mobile-preview' : 'app'}>
    <section className="hero">
      <nav className="topbar">
        <div className="brand">
          <div className="brand-mark">P</div>
          <div>
            <strong>Parkcol Smart Control</strong>
            <span>Demo interactivo · Sistema propio para Parkcol</span>
          </div>
        </div>
        <div className="top-actions">
          <button onClick={() => setMobileMode(!mobileMode)} className="ghost"><MonitorSmartphone size={17} /> {mobileMode ? 'Volver a escritorio' : 'Ver como dueño en celular'}</button>
          <button onClick={resetDemo} className="ghost"><RotateCcw size={17} /> Reiniciar demo</button>
        </div>
      </nav>

      <div className="hero-grid">
        <div className="hero-copy">
          <Pill tone="blue">Tecnología clara · operación tipo Estados Unidos</Pill>
          <h1>El parqueadero de Parkcol operando desde un solo control inteligente.</h1>
          <p>Haz clic en los módulos y botones: el demo cambia placas, pagos, barrera, caja, alertas y bitácora en vivo. La idea es que Parkcol vea su propia operación convertida en sistema.</p>
          <div className="hero-actions">
            <button onClick={simulateEntry} className="primary"><Play size={18} /> Probar ingreso mensualidad</button>
            <button onClick={generatePayment} className="secondary"><QrCode size={18} /> Generar QR de pago</button>
            <button onClick={validateExit} className="secondary"><DoorOpen size={18} /> Intentar salida</button>
          </div>
        </div>
        <div className="impact-card">
          <span className="impact-kicker"><BadgeDollarSign size={18} /> ROI operativo</span>
          <strong>Menos fugas, menos filas, más control por turno.</strong>
          <p>El retorno se siente en caja: cada placa queda trazada, cada pago conciliado y cada cierre llega al celular del dueño.</p>
          <div className="impact-grid">
            <span><CheckCircle2 /> Cierre TURNO02</span>
            <span><CheckCircle2 /> Pagos conciliados</span>
            <span><CheckCircle2 /> Alertas por placa</span>
          </div>
        </div>
      </div>
    </section>

    <section className="control-shell">
      <aside className="sidebar">
        <span className="section-label">Haz clic para probar</span>
        {modules.map(({ key, icon: Icon, label }) => <button key={key} onClick={() => selectModule(key)} className={scenario === key ? 'nav-btn active' : 'nav-btn'}>
          <Icon size={18} /> {label}
        </button>)}
        <div className="sidebar-note">
          <RadioTower size={18} />
          <p><strong>Reglas Parkcol:</strong> 10 cámaras, 3 turnos, mensualidad con 2 placas / 1 adentro, valet, amanecida y pico y placa.</p>
        </div>
      </aside>

      <div className="dashboard">
        <div className="metrics-grid">
          <Metric icon={Car} label="Ocupación" value={occupancy} hint="Celdas restantes 486" />
          <Metric icon={Camera} label="Cámaras" value="10/10" hint="Ingreso · salida · zonas" tone="purple" />
          <Metric icon={CircleDollarSign} label="Recaudo hoy" value={money.format(paidToday)} hint={`Pendiente ${money.format(unpaid)}`} tone="green" />
          <Metric icon={ReceiptText} label="Caja activa" value="TURNO02" hint={shiftClosed ? 'Cierre enviado' : 'Lista para cierre'} tone="gold" />
        </div>

        <div className="demo-grid">
          <section className="panel camera-panel">
            <div className="panel-head">
              <div><span className="eyebrow">Lectura en vivo</span><h2>{selected.camera}</h2></div>
              <Pill tone={selected.status === 'Bloqueado' ? 'red' : selected.paid ? 'green' : 'orange'}>{selected.status}</Pill>
            </div>
            <div className="camera-feed">
              <div className="lane-grid" />
              <div className={gateOpen ? 'gate open' : 'gate'}>{gateOpen ? 'BARRERA ABIERTA' : 'BARRERA EN ESPERA'}</div>
              <div className="scan-line" />
              <div className="plate-card">
                <small>PLACA DETECTADA</small>
                <strong>{selected.plate}</strong>
                <span>{selected.type} · {selected.gate}</span>
              </div>
            </div>
            <div className="vehicle-summary">
              <div><span>Servicio</span><strong>{selected.service}</strong></div>
              <div><span>Cliente</span><strong>{selected.owner}</strong></div>
              <div><span>Entrada</span><strong>{selected.entry}</strong></div>
              <div><span>Valor</span><strong>{selected.amount ? money.format(selected.amount) : 'Cubierto'}</strong></div>
            </div>
            <div className={selected.status === 'Bloqueado' || !selected.paid ? 'rule-box warning' : 'rule-box'}>
              <AlertTriangle size={17} /> <span>{ruleMessage}</span>
            </div>
          </section>

          <section className="panel action-panel">
            <div className="panel-head">
              <div><span className="eyebrow">Demo interactivo</span><h2>{scenarioTitle}</h2></div>
              <Pill tone="blue">Paso {stage + 1}/4</Pill>
            </div>

            <div className="stepper">
              {script.map(({ icon: Icon, title, text }, index) => <button key={title} onClick={() => setStage(index)} className={index <= stage ? 'step-card done' : 'step-card'}>
                <span><Icon size={18} /></span>
                <div><strong>{title}</strong><p>{text}</p></div>
              </button>)}
            </div>

            <div className="action-row">
              <button onClick={runScenario} className="primary wide"><Zap size={17} /> {scenarioAction}</button>
              <button onClick={nextStep} className="ghost wide">Siguiente paso <ArrowRight size={16} /></button>
            </div>

            {qrReady && <div className="qr-box">
              <div className="fake-qr"><QrCode size={54} /></div>
              <div><strong>Pago listo para {selected.plate}</strong><p>Valor: {money.format(selected.amount)}. Al aprobar, caja y salida se actualizan automáticamente.</p><button onClick={approvePayment} className="secondary compact">Aprobar pago demo</button></div>
            </div>}
          </section>
        </div>

        <div className="operations-grid">
          <section className="panel">
            <div className="panel-head"><div><span className="eyebrow">Click en una placa</span><h2>Vehículos activos</h2></div><Pill>{vehicles.length} registros</Pill></div>
            <div className="vehicle-list">
              {vehicles.map((v) => <button key={v.plate} onClick={() => { setSelectedPlate(v.plate); log(`Placa seleccionada: ${v.plate}`); }} className={selectedPlate === v.plate ? 'vehicle-row selected' : 'vehicle-row'}>
                <strong>{v.plate}</strong>
                <span>{v.type}</span>
                <span>{v.service}</span>
                <small>{v.paid ? 'Pago OK' : `Debe ${money.format(v.amount)}`}</small>
              </button>)}
            </div>
          </section>

          <section className="panel">
            <div className="panel-head"><div><span className="eyebrow">Caja inteligente</span><h2>Cierre Turno 02</h2></div><Pill tone={shiftClosed ? 'green' : 'orange'}>{shiftClosed ? 'Enviado' : 'En proceso'}</Pill></div>
            <div className="cash-grid">
              <div><span>Horas carro</span><strong>{money.format(45000)}</strong><small>90 vehículos</small></div>
              <div><span>Horas moto</span><strong>{money.format(90000)}</strong><small>96 motos</small></div>
              <div><span>Digital</span><strong>{money.format(76000)}</strong><small>Conciliado</small></div>
              <div><span>Efectivo</span><strong>{money.format(59000)}</strong><small>Revisión cajero</small></div>
            </div>
            <button onClick={closeShift} className="full-action"><Smartphone size={17} /> Simular cierre desde celular</button>
          </section>

          <section className="panel live-log">
            <div className="panel-head"><div><span className="eyebrow">Bitácora en vivo</span><h2>Lo que cambia al hacer clic</h2></div></div>
            <div className="event-list">
              {events.map((event) => <div key={event} className="event-item"><span />{event}</div>)}
            </div>
          </section>
        </div>
      </div>
    </section>

    <section className="services-section">
      <div className="section-title">
        <Pill tone="blue">5 vertientes Parkcol</Pill>
        <h2>Diseñado para que ellos sientan que el sistema entiende su operación, no que les estamos vendiendo una plantilla.</h2>
      </div>
      <div className="service-grid">
        {services.map(({ title, icon: Icon, detail, value }) => <article className="service-card" key={title}>
          <Icon size={22} />
          <strong>{title}</strong>
          <p>{detail}</p>
          <span>{value}</span>
        </article>)}
      </div>
    </section>

    <section className="closing-section">
      <div>
        <Pill tone="gold">Mensaje comercial</Pill>
        <h2>Parkcol no compra “otro software”. Compra control, velocidad y tranquilidad administrativa.</h2>
      </div>
      <div className="closing-grid">
        <div><Users /><strong>Dueño con control</strong><p>Cierres, alertas y reportes desde celular sin depender de estar en caja.</p></div>
        <div><Zap /><strong>Cliente sin fila</strong><p>Pago digital, QR/link y salida validada automáticamente.</p></div>
        <div><ReceiptText /><strong>Caja auditable</strong><p>Turnos, recaudos, diferencias, consecutivos y pagos mensuales trazados.</p></div>
      </div>
    </section>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
