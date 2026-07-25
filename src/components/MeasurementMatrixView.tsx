import React from 'react';
import { WorkItem, MeasurementPoint } from '../types';
import { Plus, AlertTriangle, Camera, TableProperties } from 'lucide-react';

interface MeasurementMatrixViewProps {
  workItem: WorkItem;
  onUpdateWorkItem: (updated: WorkItem) => void;
}

const METHODS: MeasurementPoint['method'][] = [
  '3_point_fall_of_potential',
  'clamp_on',
  '4_point_wenner',
  'high_frequency',
];

export const MeasurementMatrixView: React.FC<MeasurementMatrixViewProps> = ({ workItem, onUpdateWorkItem }) => {
  const updatePoint = (id: string, update: Partial<MeasurementPoint>) => {
    onUpdateWorkItem({
      ...workItem,
      measurements: workItem.measurements.map((point) => point.id === id ? { ...point, ...update } : point),
    });
  };

  const addPoint = () => {
    const next = workItem.measurements.length + 1;
    const point: MeasurementPoint = {
      id: 'M-NEW-' + next,
      point_code: 'PENDIENTE-' + next,
      location_description: 'Ubicación pendiente de registrar',
      measured_resistance_ohm: 0,
      method: '3_point_fall_of_potential',
      photo_rotation_deg: 0,
      photo_legible: false,
      status: 'Pendiente',
      evaluation_basis: 'not_evaluated',
      notes: 'Registro creado; requiere evidencia y criterio aplicable.',
    };
    onUpdateWorkItem({ ...workItem, measurements: [...workItem.measurements, point] });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><TableProperties className="w-5 h-5 text-sky-400" />Matriz de mediciones</h2>
          <p className="text-xs text-slate-400 mt-1">La matriz registra hechos de campo. La conformidad se asigna solo mediante un criterio trazable y verificado.</p>
        </div>
        <button onClick={addPoint} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold"><Plus className="w-4 h-4" />Agregar punto</button>
      </div>

      <div className="flex gap-3 p-4 rounded-xl border border-amber-700/70 bg-amber-950/30 text-amber-100 text-xs">
        <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
        <p>Esta pantalla no contiene umbrales genéricos. Una lectura por sí sola no prueba conformidad ni no conformidad.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="p-3">Punto</th>
              <th className="p-3">Ubicación / activo</th>
              <th className="p-3">Lectura Ω</th>
              <th className="p-3">Método</th>
              <th className="p-3">Foto</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Base</th>
            </tr>
          </thead>
          <tbody>
            {workItem.measurements.map((point) => (
              <tr key={point.id} className="border-t border-slate-800 bg-slate-900/60">
                <td className="p-3"><input value={point.point_code} onChange={(event) => updatePoint(point.id, { point_code: event.target.value })} className="w-28 bg-slate-950 border border-slate-700 rounded p-2 text-white font-mono" /></td>
                <td className="p-3"><input value={point.location_description} onChange={(event) => updatePoint(point.id, { location_description: event.target.value })} className="min-w-56 bg-slate-950 border border-slate-700 rounded p-2 text-white" /></td>
                <td className="p-3"><input type="number" step="any" value={point.measured_resistance_ohm} onChange={(event) => updatePoint(point.id, { measured_resistance_ohm: Number(event.target.value) })} className="w-24 bg-slate-950 border border-slate-700 rounded p-2 text-sky-300 font-mono" /></td>
                <td className="p-3"><select value={point.method} onChange={(event) => updatePoint(point.id, { method: event.target.value as MeasurementPoint['method'] })} className="bg-slate-950 border border-slate-700 rounded p-2 text-slate-200">{METHODS.map((method) => <option key={method}>{method}</option>)}</select></td>
                <td className="p-3"><span className={point.photo_legible ? 'inline-flex items-center gap-1 text-emerald-300' : 'inline-flex items-center gap-1 text-amber-300'}><Camera className="w-4 h-4" />{point.photo_legible ? 'Legible' : 'Pendiente'}</span></td>
                <td className="p-3"><span className="px-2 py-1 rounded border border-amber-800 bg-amber-950 text-amber-200">{point.status}</span></td>
                <td className="p-3 text-slate-400">{point.evaluation_basis || 'not_evaluated'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeasurementMatrixView;
