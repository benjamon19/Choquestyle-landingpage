import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  RefreshCw,
  Lock,
  Unlock,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Filter,
  Download,
  Settings,
  X,
  AlertCircle,
  Database,
  ArrowLeft,
  UserCheck,
} from 'lucide-react';
import {
  WheelUser,
  ADMIN_DEFAULT_PIN,
  cleanRut,
  fetchWinnersFromCloud,
  updateWinnerStatus,
  getGoogleSheetsUrl,
  saveGoogleSheetsUrl,
} from './wheelConfig';

export default function DiscountWheelAdmin() {
  // Estado de autenticación
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('wheel_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [authError, setAuthError] = useState('');

  // Datos
  const [winners, setWinners] = useState<WheelUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pendiente' | 'Canjeado'>('all');
  const [discountFilter, setDiscountFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Configuración de Google Sheets
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [sheetUrlInput, setSheetUrlInput] = useState('');
  const [sheetSaveSuccess, setSheetSaveSuccess] = useState(false);

  // Cargar URL inicial de Google Sheets
  useEffect(() => {
    setSheetUrlInput(getGoogleSheetsUrl());
  }, []);

  // Cargar ganadores
  const loadWinners = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchWinnersFromCloud();
      setWinners(data);
    } catch (err) {
      console.error('Error cargando ganadores:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadWinners();
    }
  }, [isAuthenticated, loadWinners]);

  // Manejo de autenticación
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === ADMIN_DEFAULT_PIN) {
      setIsAuthenticated(true);
      setAuthError('');
      try {
        sessionStorage.setItem('wheel_admin_auth', 'true');
      } catch {}
    } else {
      setAuthError('PIN de seguridad incorrecto.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPin('');
    try {
      sessionStorage.removeItem('wheel_admin_auth');
    } catch {}
  };

  // Cambiar estado de ganador (Pendiente <-> Canjeado)
  const handleToggleStatus = async (winner: WheelUser) => {
    const nextStatus = winner.status === 'Canjeado' ? 'Pendiente' : 'Canjeado';
    
    // Optimista
    setWinners(prev =>
      prev.map(w =>
        (cleanRut(w.rut) && cleanRut(w.rut) === cleanRut(winner.rut)) ||
        w.email.toLowerCase() === winner.email.toLowerCase()
          ? { ...w, status: nextStatus }
          : w
      )
    );

    await updateWinnerStatus(winner.rut || winner.email, nextStatus);
  };

  // Guardar nueva URL de Google Sheets
  const handleSaveSheetUrl = (e: React.FormEvent) => {
    e.preventDefault();
    saveGoogleSheetsUrl(sheetUrlInput);
    setSheetSaveSuccess(true);
    setTimeout(() => {
      setSheetSaveSuccess(false);
      setShowConfigModal(false);
      loadWinners();
    }, 1200);
  };

  // Copiar al portapapeles
  const handleCopyWinner = (w: WheelUser, key: string) => {
    const text = `Ganador Choquestyle:
Nombre: ${w.name}
RUT: ${w.rut}
Correo: ${w.email}
Descuento: ${w.discount}
Fecha: ${w.date}
Estado: ${w.status || 'Pendiente'}`;

    navigator.clipboard.writeText(text);
    setCopiedId(key);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Exportar a CSV
  const handleExportCSV = () => {
    if (winners.length === 0) return;

    const headers = ['Fecha y Hora', 'Nombre', 'RUT', 'Email', 'Descuento', 'Estado'];
    const rows = filteredWinners.map(w => [
      `"${w.date}"`,
      `"${w.name}"`,
      `"${w.rut}"`,
      `"${w.email}"`,
      `"${w.discount}"`,
      `"${w.status || 'Pendiente'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ganadores_choquestyle_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtrado reactivo en tiempo real
  const filteredWinners = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const queryCleanRut = cleanRut(searchQuery);

    return winners.filter(w => {
      // Filtro de texto (RUT, Nombre, Email, Descuento)
      const matchesText =
        !query ||
        w.name.toLowerCase().includes(query) ||
        w.email.toLowerCase().includes(query) ||
        w.discount.toLowerCase().includes(query) ||
        (queryCleanRut && cleanRut(w.rut).includes(queryCleanRut)) ||
        w.rut.toLowerCase().includes(query);

      // Filtro de estado
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'Canjeado' && w.status === 'Canjeado') ||
        (statusFilter === 'Pendiente' && w.status !== 'Canjeado');

      // Filtro de descuento
      const matchesDiscount =
        discountFilter === 'all' || w.discount.includes(discountFilter);

      return matchesText && matchesStatus && matchesDiscount;
    });
  }, [winners, searchQuery, statusFilter, discountFilter]);

  // Métricas
  const totalCount = winners.length;
  const pendingCount = winners.filter(w => w.status !== 'Canjeado').length;
  const redeemedCount = winners.filter(w => w.status === 'Canjeado').length;

  const currentSheetUrl = getGoogleSheetsUrl();

  // ─────────────────────────────────────────────────────────────
  // 1. PANTALLA DE BLOQUEO CON PIN
  // ─────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[999999] bg-[#0A0A0A] flex items-center justify-center p-4 text-white">
        {/* Fondo decorativo */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#FFD600_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFD600]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 w-full max-w-md bg-[#141414] border border-[#262626] p-8 shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#FFD600] flex items-center justify-center text-black font-black">
              <Lock size={20} />
            </div>
            <div>
              <span
                className="text-[10px] text-[#FFD600] uppercase tracking-[0.25em] font-bold block"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                ADMINISTRACIÓN CHOQUESTYLE
              </span>
              <h1
                className="text-xl font-bold uppercase tracking-tight text-white"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Buscador de Ganadores
              </h1>
            </div>
          </div>

          <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
            Área privada protegida. Ingresa el PIN de seguridad para consultar el registro de cupones y buscar por RUT o nombre.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-bold mb-2">
                PIN de Acceso:
              </label>
              <input
                type="password"
                value={pin}
                onChange={e => {
                  setPin(e.target.value);
                  setAuthError('');
                }}
                placeholder="Ingresa tu clave..."
                autoFocus
                className="w-full bg-[#0A0A0A] border border-[#333333] focus:border-[#FFD600] focus:ring-1 focus:ring-[#FFD600] text-white px-4 py-3 text-sm outline-none transition-all placeholder:text-neutral-600 font-mono tracking-widest"
              />
              {authError && (
                <div className="flex items-center gap-1.5 text-red-400 text-xs mt-2">
                  <AlertCircle size={14} />
                  <span>{authError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#FFD600] hover:bg-[#ffe033] text-black font-extrabold uppercase tracking-wider text-xs transition-all shadow-[0_0_20px_rgba(255,214,0,0.3)] cursor-pointer"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Desbloquear Panel
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-neutral-800 flex justify-between items-center text-[11px] text-neutral-500">
            <span>PIN predeterminado: <strong className="text-neutral-300 font-mono">choque2025</strong></span>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '';
                window.location.search = '';
                window.location.href = '/';
              }}
              className="text-[#FFD600] hover:underline flex items-center gap-1"
            >
              <ArrowLeft size={12} /> Volver al sitio
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. PANEL ADMINISTRATIVO PRINCIPAL
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-[#FFD600] selection:text-black">
      {/* Barra superior / Navbar Admin */}
      <header className="sticky top-0 z-40 bg-[#111111]/90 backdrop-blur-md border-b border-[#222222] px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Título y badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#FFD600] flex items-center justify-center text-black font-black shrink-0">
              <UserCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] bg-[#FFD600]/15 text-[#FFD600] border border-[#FFD600]/30 px-2 py-0.5 uppercase tracking-widest font-bold"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  ADMIN PRIVADO
                </span>
                <span className="text-[11px] text-neutral-400">Choquestyle</span>
              </div>
              <h2
                className="text-base sm:text-lg font-bold uppercase tracking-tight text-white"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Buscador de Ganadores Ruleta
              </h2>
            </div>
          </div>

          {/* Acciones del header */}
          <div className="flex items-center gap-2.5">
            {/* Estado de sincronización */}
            <button
              onClick={() => setShowConfigModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181818] hover:bg-[#222222] border border-[#333333] text-xs transition-colors cursor-pointer"
              title="Configurar Google Sheets"
            >
              <Database size={13} className={currentSheetUrl ? 'text-[#FFD600]' : 'text-neutral-500'} />
              <span className="hidden sm:inline text-[11px] text-neutral-300">
                {currentSheetUrl ? 'Google Sheets Conectado' : 'Guardado Local (Conectar Sheets)'}
              </span>
              <Settings size={12} className="text-neutral-500 ml-1" />
            </button>

            {/* Refrescar */}
            <button
              onClick={loadWinners}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#181818] hover:bg-[#222222] border border-[#333333] text-xs text-white transition-colors cursor-pointer disabled:opacity-50"
              title="Recargar datos"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin text-[#FFD600]' : ''} />
              <span className="hidden md:inline text-[11px]">Actualizar</span>
            </button>

            {/* Salir al sitio */}
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '';
                window.location.search = '';
                window.location.href = '/';
              }}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-300 transition-colors"
            >
              Ver Web
            </a>

            {/* Cerrar sesión */}
            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 bg-red-950/40 hover:bg-red-900/50 border border-red-800/40 text-red-400 text-xs transition-colors cursor-pointer"
              title="Cerrar sesión"
            >
              <Unlock size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Banner de métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#141414] border border-[#222222] p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Total Registrados</p>
              <p className="text-2xl font-black text-white mt-0.5" style={{ fontFamily: 'var(--font-heading)' }}>
                {totalCount}
              </p>
            </div>
            <div className="w-10 h-10 bg-[#FFD600]/10 border border-[#FFD600]/30 flex items-center justify-center text-[#FFD600]">
              <UserCheck size={20} />
            </div>
          </div>

          <div className="bg-[#141414] border border-[#222222] p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-amber-400 font-bold">Pendientes de Canje</p>
              <p className="text-2xl font-black text-amber-400 mt-0.5" style={{ fontFamily: 'var(--font-heading)' }}>
                {pendingCount}
              </p>
            </div>
            <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock size={20} />
            </div>
          </div>

          <div className="bg-[#141414] border border-[#222222] p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Cupones Canjeados</p>
              <p className="text-2xl font-black text-emerald-400 mt-0.5" style={{ fontFamily: 'var(--font-heading)' }}>
                {redeemedCount}
              </p>
            </div>
            <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
          </div>

          <div className="bg-[#141414] border border-[#222222] p-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Destino en la Nube</p>
              <p className="text-xs font-bold text-neutral-200 mt-1 truncate max-w-[170px]" title={currentSheetUrl || 'No configurado'}>
                {currentSheetUrl ? 'Google Sheet Activo' : 'Almacenamiento Local'}
              </p>
            </div>
            <button
              onClick={() => setShowConfigModal(true)}
              className="text-xs text-[#FFD600] hover:underline cursor-pointer flex items-center gap-1"
            >
              Configurar <ExternalLink size={12} />
            </button>
          </div>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <div className="bg-[#141414] border border-[#222222] p-4 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* Input de Búsqueda */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar por RUT (ej. 12.345.678-9), Nombre o Correo..."
                className="w-full bg-[#0A0A0A] border border-[#333333] focus:border-[#FFD600] text-white pl-10 pr-4 py-2.5 text-xs outline-none transition-all placeholder:text-neutral-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Botón Exportar */}
            <button
              onClick={handleExportCSV}
              disabled={winners.length === 0}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#333333] text-xs font-bold uppercase tracking-wider text-neutral-200 transition-colors cursor-pointer disabled:opacity-40 shrink-0"
            >
              <Download size={14} />
              <span>Exportar CSV</span>
            </button>
          </div>

          {/* Filtros tipo pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#222222] text-xs">
            <span className="text-neutral-500 flex items-center gap-1 mr-1 text-[11px]">
              <Filter size={12} /> Estado:
            </span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 text-[11px] font-bold uppercase transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-[#FFD600] text-black'
                  : 'bg-[#1F1F1F] text-neutral-400 hover:text-white'
              }`}
            >
              Todos ({totalCount})
            </button>
            <button
              onClick={() => setStatusFilter('Pendiente')}
              className={`px-2.5 py-1 text-[11px] font-bold uppercase transition-all cursor-pointer ${
                statusFilter === 'Pendiente'
                  ? 'bg-amber-400 text-black'
                  : 'bg-[#1F1F1F] text-neutral-400 hover:text-white'
              }`}
            >
              Pendientes ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('Canjeado')}
              className={`px-2.5 py-1 text-[11px] font-bold uppercase transition-all cursor-pointer ${
                statusFilter === 'Canjeado'
                  ? 'bg-emerald-500 text-black'
                  : 'bg-[#1F1F1F] text-neutral-400 hover:text-white'
              }`}
            >
              Canjeados ({redeemedCount})
            </button>

            {/* Separador */}
            <span className="text-neutral-600 mx-2">|</span>

            <span className="text-neutral-500 text-[11px]">Premio:</span>
            {['all', '5%', '10%', '20%', '30%'].map(val => (
              <button
                key={val}
                onClick={() => setDiscountFilter(val)}
                className={`px-2.5 py-1 text-[11px] font-bold uppercase transition-all cursor-pointer ${
                  discountFilter === val
                    ? 'bg-white text-black'
                    : 'bg-[#1F1F1F] text-neutral-400 hover:text-white'
                }`}
              >
                {val === 'all' ? 'Cualquiera' : val}
              </button>
            ))}
          </div>
        </div>

        {/* Tabla de Ganadores */}
        <div className="bg-[#141414] border border-[#222222] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#181818] border-b border-[#262626] text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Fecha / Hora</th>
                  <th className="py-3 px-4">RUT</th>
                  <th className="py-3 px-4">Nombre Completo</th>
                  <th className="py-3 px-4">Correo Electrónico</th>
                  <th className="py-3 px-4 text-center">Descuento</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {filteredWinners.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-neutral-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Search size={28} className="text-neutral-600" />
                        <p className="text-sm font-bold text-neutral-400">No se encontraron ganadores</p>
                        <p className="text-xs text-neutral-600">
                          {searchQuery
                            ? `Ningún resultado coincide con "${searchQuery}"`
                            : 'Aún no hay registros en la ruleta.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredWinners.map((winner, idx) => {
                    const uniqueKey = `${winner.rut}-${winner.email}-${idx}`;
                    const isCopied = copiedId === uniqueKey;
                    const isRedeemed = winner.status === 'Canjeado';

                    return (
                      <tr
                        key={uniqueKey}
                        className="hover:bg-[#1A1A1A] transition-colors group"
                      >
                        {/* Fecha */}
                        <td className="py-3 px-4 text-neutral-400 whitespace-nowrap font-mono text-[11px]">
                          {winner.date
                            ? new Date(winner.date).toLocaleDateString('es-CL', {
                                day: '2-digit',
                                month: '2-digit',
                                year: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '—'}
                        </td>

                        {/* RUT */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-mono font-bold text-[#FFD600] bg-black/40 px-2 py-0.5 border border-[#333333]">
                            {winner.rut || 'Sin RUT'}
                          </span>
                        </td>

                        {/* Nombre */}
                        <td className="py-3 px-4 font-bold text-white uppercase tracking-tight">
                          {winner.name}
                        </td>

                        {/* Email */}
                        <td className="py-3 px-4 text-neutral-300 font-mono text-[11px]">
                          {winner.email}
                        </td>

                        {/* Descuento */}
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-2.5 py-0.5 font-black text-[11px] uppercase tracking-wide bg-[#FFD600] text-black">
                            {winner.discount}
                          </span>
                        </td>

                        {/* Estado */}
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleStatus(winner)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer border ${
                              isRedeemed
                                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
                                : 'bg-amber-950/60 border-amber-500/50 text-amber-300 hover:bg-amber-900/60'
                            }`}
                            title="Haz clic para alternar entre Pendiente y Canjeado"
                          >
                            {isRedeemed ? (
                              <>
                                <CheckCircle2 size={12} /> Canjeado
                              </>
                            ) : (
                              <>
                                <Clock size={12} /> Pendiente
                              </>
                            )}
                          </button>
                        </td>

                        {/* Acciones */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Copiar datos */}
                            <button
                              onClick={() => handleCopyWinner(winner, uniqueKey)}
                              className="p-1.5 bg-[#222222] hover:bg-[#333333] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                              title="Copiar datos al portapapeles"
                            >
                              {isCopied ? <Check size={13} className="text-[#FFD600]" /> : <Copy size={13} />}
                            </button>

                            {/* Contactar por WhatsApp */}
                            <a
                              href={`https://wa.me/?text=${encodeURIComponent(
                                `Hola ${winner.name}! Te escribimos de Choquestyle para validar tu cupón del ${winner.discount} ganado en la ruleta con tu RUT ${winner.rut}.`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-1 bg-[#222222] hover:bg-emerald-950 text-neutral-300 hover:text-emerald-300 transition-colors text-[10px] uppercase font-bold"
                              title="Enviar mensaje de validación"
                            >
                              WhatsApp
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ─────────────────────────────────────────────────────────────
          MODAL DE CONFIGURACIÓN DE GOOGLE SHEETS
         ───────────────────────────────────────────────────────────── */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-[#141414] border border-[#2B2B2B] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div className="flex items-center gap-2">
                <Database size={18} className="text-[#FFD600]" />
                <h3 className="text-sm font-bold uppercase tracking-tight text-white">
                  Conexión con Google Sheets
                </h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Pega aquí la <strong>URL de tu Web App de Google Apps Script</strong> (terminada en <code className="text-[#FFD600]">/exec</code>).
              Todos los ganadores que jueguen en sus teléfonos se guardarán automáticamente en tu hoja de Google Sheets en tiempo real.
            </p>

            <form onSubmit={handleSaveSheetUrl} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-bold mb-1.5">
                  URL de Aplicación Web (Apps Script):
                </label>
                <input
                  type="url"
                  value={sheetUrlInput}
                  onChange={e => setSheetUrlInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full bg-[#0A0A0A] border border-[#333333] focus:border-[#FFD600] text-white px-3 py-2.5 text-xs font-mono outline-none"
                />
              </div>

              {sheetSaveSuccess && (
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
                  <CheckCircle2 size={14} />
                  <span>¡URL guardada con éxito! Conectando...</span>
                </div>
              )}

              <div className="bg-[#0A0A0A] border border-[#222222] p-3 text-[11px] text-neutral-400 space-y-1">
                <p className="font-bold text-white uppercase tracking-wider text-[10px]">Información de Conexión</p>
                <p>Tu Google Sheet ya está conectado. Si necesitas cambiar de hoja en el futuro, solo pega aquí la nueva URL de la aplicación web.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs uppercase font-bold"
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#FFD600] hover:bg-[#ffe033] text-black text-xs font-extrabold uppercase tracking-wider"
                >
                  Guardar Conexión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
