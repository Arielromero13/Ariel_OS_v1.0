import React, { useState } from 'react';
import { WorkItem, MeasurementPoint } from '../types';
import { Plus, Trash2, RotateCw, CheckCircle2, AlertTriangle, Eye, Image as ImageIcon, Camera, Check, X, SlidersHorizontal } from 'lucide-react';

interface MeasurementMatrixViewProps {
  workItem: WorkItem;
  onUpdateWorkItem: (updated: WorkItem) => void;
}

export const MeasurementMatrixView: React.FC<MeasurementMatrixViewProps> = ({ workItem, onUpdateWorkItem }) => {
  const [selectedPhotoPoint, setSelectedPhotoPoint] = useState<MeasurementPoint | null>(null);

  // Update a single measurement point
  const updateMeasurement = (id: string, updates: Partial<MeasurementPoint>) => {
    const updatedPoints = workItem.measurements.map((p) => {
      if (p.id !== id) return p;
      const newP = { ...p, ...updates };

      // Auto calculate compliance status if resistance or max changed
      if (updates.measured_resistance_ohm !== undefined || updates.max_allowed_ohm !== undefined) {
        if (newP.measured_resistance_ohm <= newP.max_allowed_ohm) {
          newP.status = 'Conforme';
        } else {
          newP.status = 'No conforme';
        }
      }
      return newP;
    });

    // Update findings if non-compliance occurs
    const newFindings = updatedPoints
      .filter((p) => p.status === 'No conforme')
      .map((p) => ({
        id: `FIND-${p.point_code}`,
        point_id: p.id,
        finding_type: 'non_compliance' as const,
        title: `Resistencia Elevada en ${p.point_code}`,
        description: `Medición de ${p.measured_resistance_ohm} Ω supera el máximo permitido de ${p.max_allowed_ohm} Ω.`,
        severity: 'critical' as const,
        status: 'open' as const,
      }));

    onUpdateWorkItem({
      ...workItem,
      measurements: updatedPoints,
      findings: newFindings,
    });
  };

  // Rotate photo for a measurement point
  const rotatePhoto = (id: string) => {
    const point = workItem.measurements.find((p) => p.id === id);
    if (!point) return;
    const nextDeg = ((point.photo_rotation_deg + 90) % 360) as 0 | 90 | 180 | 270;
    updateMeasurement(id, { photo_rotation_deg: nextDeg });
    if (selectedPhotoPoint?.id === id) {
      setSelectedPhotoPoint({ ...selectedPhotoPoint, photo_rotation_deg: nextDeg });
    }
  };

  // Toggle legibility
  const toggleLegibility = (id: string) => {
    const point = workItem.measurements.find((p) => p.id === id);
    if (!point) return;
    updateMeasurement(id, { photo_legible: !point.photo_legible });
  };

  // Add new measurement point
  const handleAddPoint = () => {
    const nextIdx = workItem.measurements.length + 1;
    const newPoint: MeasurementPoint = {
      id: `M-0${nextIdx}`,
      point_code: `PAT-AUX-0${nextIdx}`,
      location_description: 'Jabalina auxiliar de prueba recién agregada',
      measured_resistance_ohm: 4.5,
      max_allowed_ohm: 10.0,
      method: '3_point_fall_of_potential',
      photo_id: `IMG_PAT_0${nextIdx}.jpg`,
      photo_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
      photo_rotation_deg: 0,
      photo_legible: true,
      status: 'Conforme',
      notes: 'Punto ingresado mediante la consola de control.',
    };

    onUpdateWorkItem({
      ...workItem,
      measurements: [...workItem.measurements, newPoint],
    });
  };

  // Delete measurement point
  const handleDeletePoint = (id: string) => {
    onUpdateWorkItem({
      ...workItem,
      measurements: workItem.measurements.filter((p) => p.id !== id),
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Matriz de Control de Mediciones de P.A.T.
            <span className="text-xs px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-mono">
              Skill: analyze-grounding-report
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Registro trazable de lecturas de campo en Ohmios (Ω), vinculación fotográfica 1:1 y verificación de límites R ≤ R_max.
          </p>
        </div>

        <button
          onClick={handleAddPoint}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Punto de Medición</span>
        </button>
      </div>

      {/* Measurement Points Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono uppercase text-[11px]">
                <th className="p-3">Código Punto</th>
                <th className="p-3">Ubicación / Descripción</th>
                <th className="p-3 text-center">Medido R (Ω)</th>
                <th className="p-3 text-center">Máximo R (Ω)</th>
                <th className="p-3">Método</th>
                <th className="p-3 text-center">Estado</th>
                <th className="p-3 text-center">Evidencia Foto</th>
                <th className="p-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {workItem.measurements.map((pt) => {
                const isNonCompliant = pt.status === 'No conforme';
                return (
                  <tr key={pt.id} className={`hover:bg-slate-850/50 transition-colors ${isNonCompliant ? 'bg-rose-950/10' : ''}`}>
                    
                    {/* Code */}
                    <td className="p-3 font-mono font-bold text-sky-300">{pt.point_code}</td>

                    {/* Location Description */}
                    <td className="p-3 max-w-[240px]">
                      <input
                        type="text"
                        value={pt.location_description}
                        onChange={(e) => updateMeasurement(pt.id, { location_description: e.target.value })}
                        className="bg-transparent border border-transparent hover:border-slate-700 focus:border-sky-500 rounded px-1.5 py-1 w-full text-xs text-white focus:outline-none"
                      />
                    </td>

                    {/* Measured Resistance */}
                    <td className="p-3 text-center font-mono">
                      <input
                        type="number"
                        step="0.01"
                        value={pt.measured_resistance_ohm}
                        onChange={(e) => updateMeasurement(pt.id, { measured_resistance_ohm: parseFloat(e.target.value) || 0 })}
                        className={`w-20 text-center font-bold border rounded px-1.5 py-1 text-xs focus:outline-none ${
                          isNonCompliant ? 'bg-rose-950/80 border-rose-700 text-rose-200' : 'bg-slate-950 border-slate-800 text-emerald-300'
                        }`}
                      />
                    </td>

                    {/* Max Allowed Resistance */}
                    <td className="p-3 text-center font-mono text-slate-400">
                      <input
                        type="number"
                        step="0.1"
                        value={pt.max_allowed_ohm}
                        onChange={(e) => updateMeasurement(pt.id, { max_allowed_ohm: parseFloat(e.target.value) || 0 })}
                        className="w-16 text-center bg-slate-950 border border-slate-800 rounded px-1 py-1 text-xs text-slate-300 focus:outline-none"
                      />
                    </td>

                    {/* Method */}
                    <td className="p-3">
                      <select
                        value={pt.method}
                        onChange={(e) => updateMeasurement(pt.id, { method: e.target.value as any })}
                        className="bg-slate-950 border border-slate-800 rounded p-1 text-[11px] text-slate-300 focus:outline-none"
                      >
                        <option value="3_point_fall_of_potential">3 Puntos (Caída Potencial)</option>
                        <option value="clamp_on">Pinza de Tierra (Clamp-on)</option>
                        <option value="4_point_wenner">4 Puntos (Wenner)</option>
                      </select>
                    </td>

                    {/* Status Badge */}
                    <td className="p-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                        pt.status === 'Conforme' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        pt.status === 'No conforme' ? 'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse' :
                        'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {pt.status === 'Conforme' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {pt.status}
                      </span>
                    </td>

                    {/* Photo Evidence Preview */}
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setSelectedPhotoPoint(pt)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition cursor-pointer"
                      >
                        <Camera className="w-3.5 h-3.5 text-sky-400" />
                        <span className="font-mono">{pt.photo_id || 'Foto'}</span>
                        {pt.photo_rotation_deg !== 0 && (
                          <span className="text-[9px] text-amber-400 font-mono">({pt.photo_rotation_deg}°)</span>
                        )}
                      </button>
                    </td>

                    {/* Delete */}
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeletePoint(pt.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Skill: manage-photo-evidence-gallery (Galería de Evidencias Fotográficas) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-sky-400" />
              Galería de Evidencias Fotográficas & Control Visual QA
            </h3>
            <p className="text-xs text-slate-400">
              Verificación de orientación (0°, 90°, 180°, 270°), legibilidad y correspondencia 1:1 con la lectura.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {workItem.measurements.filter(m => m.photo_url).length} fotografías vinculadas
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workItem.measurements.map((pt) => (
            <div key={pt.id} className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-sky-300">{pt.point_code}</span>
                <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                  pt.status === 'Conforme' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                }`}>
                  {pt.measured_resistance_ohm} Ω
                </span>
              </div>

              {/* Photo View Box with CSS rotation */}
              <div className="relative aspect-video bg-slate-900 rounded overflow-hidden border border-slate-800 flex items-center justify-center group">
                <img
                  src={pt.photo_url || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80'}
                  alt={pt.point_code}
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={{ transform: `rotate(${pt.photo_rotation_deg}deg)` }}
                />

                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => rotatePhoto(pt.id)}
                    className="p-1.5 rounded-full bg-slate-900 text-white hover:bg-sky-600 border border-slate-700 transition cursor-pointer"
                    title="Rotar 90°"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleLegibility(pt.id)}
                    className={`p-1.5 rounded-full border transition cursor-pointer ${
                      pt.photo_legible ? 'bg-emerald-900 text-emerald-200 border-emerald-700' : 'bg-rose-900 text-rose-200 border-rose-700'
                    }`}
                    title="Alternar Legibilidad"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Photo Controls Info Bar */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <button
                  onClick={() => rotatePhoto(pt.id)}
                  className="flex items-center gap-1 text-slate-300 hover:text-sky-400 transition cursor-pointer"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Ángulo: {pt.photo_rotation_deg}°</span>
                </button>

                <button
                  onClick={() => toggleLegibility(pt.id)}
                  className="flex items-center gap-1 transition cursor-pointer"
                >
                  {pt.photo_legible ? (
                    <span className="text-emerald-400 flex items-center gap-0.5"><Check className="w-3 h-3" /> Legible</span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-0.5"><X className="w-3 h-3" /> Ilegible</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
