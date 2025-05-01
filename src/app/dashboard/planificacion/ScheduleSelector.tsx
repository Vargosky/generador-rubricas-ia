"use client";
import React from "react";

export type Schedule = Record<string, boolean[]>;

interface ScheduleSelectorProps {
  schedule: Schedule;
  setSchedule: (schedule: Schedule) => void;
}

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const HOURS = 8;

/**
 * Componente para seleccionar horarios: grilla de 6 días x 8 horas.
 */
export const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({ schedule, setSchedule }) => {
  const toggleCell = (day: string, hourIdx: number) => {
    const updated = { ...schedule };
    updated[day] = [...updated[day]];
    updated[day][hourIdx] = !updated[day][hourIdx];
    setSchedule(updated);
  };

  return (
    <div className="overflow-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th className="border p-2">Hora</th>
            {days.map((d) => (
              <th key={d} className="border p-2 text-center">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: HOURS }, (_, i) => i + 1).map((hor) => (
            <tr key={hor}>
              <td className="border p-1 text-center">{hor}</td>
              {days.map((d) => (
                <td key={`${d}-${hor}`} className="border p-1 text-center">
                  <input
                    type="checkbox"
                    checked={schedule[d][hor - 1]}
                    onChange={() => toggleCell(d, hor - 1)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
