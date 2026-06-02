import React from 'react';
import { useAppState } from '../../../context/AppStateContext';

export const BellCurveWidget: React.FC = () => {
  const { appraisals, language } = useAppState();

  const outstanding = appraisals.filter(ap => ap.cr5db_finalscore >= 90).length;
  const exceeds = appraisals.filter(ap => ap.cr5db_finalscore >= 80 && ap.cr5db_finalscore < 90).length;
  const meets = appraisals.filter(ap => ap.cr5db_finalscore >= 70 && ap.cr5db_finalscore < 80).length;
  const improvement = appraisals.filter(ap => ap.cr5db_finalscore >= 50 && ap.cr5db_finalscore < 70).length;
  const unsatisfactory = appraisals.filter(ap => ap.cr5db_finalscore > 0 && ap.cr5db_finalscore < 50).length;

  const data = [unsatisfactory, improvement, meets, exceeds, outstanding];
  const labels = ['<50', '50-69', '70-79', '80-89', '>=90'];
  const maxVal = Math.max(...data, 1);

  const width = 360;
  const height = 150;
  const padding = 20;

  const points = data.map((val, idx) => {
    const x = padding + (idx * (width - 2 * padding) / 4);
    const y = height - padding - (val * (height - 2 * padding) / maxVal);
    return { x, y, val };
  });

  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const cpX1 = p0.x + (p1.x - p0.x) / 2;
    const cpY1 = p0.y;
    const cpX2 = p0.x + (p1.x - p0.x) / 2;
    const cpY2 = p1.y;
    pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="curveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`} fill="url(#curveGrad)" />
        <path d={pathD} fill="none" stroke="var(--color-primary)" strokeWidth="3" />
        {points.map((p, idx) => (
          <g key={idx}>
            <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="var(--color-primary)" strokeWidth="2" />
            <circle cx={p.x} cy={p.y} r="5" fill="#ffffff" stroke="var(--color-primary)" strokeWidth="2" />
            <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="11px" fontWeight="bold" fill="var(--color-text)">
              {p.val}
            </text>
            <text x={p.x} y={height - 2} textAnchor="middle" fontSize="10px" fill="var(--color-text-secondary)">
              {labels[idx]}
            </text>
          </g>
        ))}
      </svg>
      <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '8px', textAlign: 'center' }}>
        {language === 'vi' ? 'Số lượng nhân sự phân bố theo khung điểm đánh giá' : 'Number of staff distributed by rating scores'}
      </div>
    </div>
  );
};
