import React, { useMemo, useState } from 'react';
import InfomerPeriodo from './Indicadores/InfomerPeriodo';
import TabProduccion from './Indicadores/TabProduccion';
import TabComercializacion from './Indicadores/TabComercializacion';
import TabMantenimiento from './Indicadores/TabMantenimiento';
import TabAdministracion from './Indicadores/TabAdministracion';

function polarToCartesian(cx, cy, r, angleDeg) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function donutSlicePath(cx, cy, rOuter, rInner, startAngle, endAngle) {
  const startOuter = polarToCartesian(cx, cy, rOuter, startAngle);
  const endOuter = polarToCartesian(cx, cy, rOuter, endAngle);

  const startInner = polarToCartesian(cx, cy, rInner, startAngle);
  const endInner = polarToCartesian(cx, cy, rInner, endAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 1 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${rInner} ${rInner} 0 ${largeArcFlag} 0 ${startInner.x} ${startInner.y}`,
    'Z',
  ].join(' ');
}

export default function RadialButtons() {
  const [active, setActive] = useState('produccion');
  const [pressedKey, setPressedKey] = useState(null);
  const [centerPressed, setCenterPressed] = useState(false);

  const items = useMemo(
    () => [
      {
        key: 'produccion',
        label: 'PRODUCCIÓN',
        sub: 'Indicadores',
        color: '#3B82F6',
      },
      {
        key: 'administracion',
        label: 'ADMINISTRACIÓN',
        sub: 'Indicadores',
        color: '#2563EB',
      },
      {
        key: 'mantenimiento',
        label: 'MANTENIMIENTO',
        sub: 'Indicadores',
        color: '#F97316',
      },
      {
        key: 'comercializacion',
        label: 'COMERCIALIZACIÓN',
        sub: 'Indicadores',
        color: '#EA580C',
      },
    ],
    [],
  );

  // Círculo
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;

  const rOuter = 142;
  const rInner = 86;
  const textR = (rInner + rOuter) / 2;

  const gap = 10;
  const strokeWidth = 9;

  const offset = -45;
  const slice = 360 / items.length;

  const segments = items.map((it, i) => {
    const start = offset + i * slice + gap / 2;
    const end = offset + (i + 1) * slice - gap / 2;
    return { ...it, start, end };
  });

  const onCenterClick = () => setActive('informe');

  const boxW = 112;
  const boxH = 66;

  return (
    // ✅ Layout igual al anterior: contenido izquierda / círculo derecha
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* IZQUIERDA: contenido (sin absolute, ocupa todo el espacio disponible) */}
        <div className="min-w-0 w-full">
          {active === 'informe' && (
            <div className="w-full">
              <InfomerPeriodo />
            </div>
          )}

          {active === 'produccion' && (
            <div className="w-full">
              <TabProduccion />
            </div>
          )}

          {active === 'administracion' && (
            <div className="w-full">
              <TabAdministracion />
            </div>
          )}

          {active === 'mantenimiento' && (
            <div className="w-full">
              <TabMantenimiento />
            </div>
          )}

          {active === 'comercializacion' && (
            <div className="w-ful">
              <TabComercializacion />
            </div>
          )}
        </div>

        {/* DERECHA: círculo arriba-derecha, “como antes” */}
        <div className="flex justify-end lg:sticky lg:top-6">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {segments.map((seg) => {
              const d = donutSlicePath(
                cx,
                cy,
                rOuter,
                rInner,
                seg.start,
                seg.end,
              );
              const isActive = active === seg.key;
              const isPressed = pressedKey === seg.key;

              const mid = (seg.start + seg.end) / 2;
              const textPos = polarToCartesian(cx, cy, textR, mid);

              const isVertical =
                seg.key === 'administracion' || seg.key === 'comercializacion';

              const rotate =
                seg.key === 'administracion'
                  ? 90
                  : seg.key === 'comercializacion'
                    ? -90
                    : 0;

              const w = isVertical ? 86 : boxW;
              const h = isVertical ? 130 : boxH;

              const baseTitleSize = isVertical ? 12 : 14;
              const titleSize =
                seg.label.length >= 16
                  ? baseTitleSize - 2
                  : seg.label.length >= 13
                    ? baseTitleSize - 1
                    : baseTitleSize;

              const subSize = isVertical ? 9 : 10;

              return (
                <g
                  key={seg.key}
                  style={{ cursor: 'pointer' }}
                  onPointerDown={() => setPressedKey(seg.key)}
                  onPointerUp={() => setPressedKey(null)}
                  onPointerLeave={() => setPressedKey(null)}
                  onClick={() => setActive(seg.key)}
                >
                  <path
                    d={d}
                    fill={seg.color}
                    stroke="white"
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                    opacity={isActive ? 1 : 0.94}
                    style={{
                      transformOrigin: `${cx}px ${cy}px`,
                      transform: isPressed
                        ? 'scale(0.99)'
                        : isActive
                          ? 'scale(1.02)'
                          : 'scale(1)',
                      filter: isPressed
                        ? 'drop-shadow(0px 4px 8px rgba(0,0,0,.25))'
                        : isActive
                          ? 'drop-shadow(0px 7px 14px rgba(0,0,0,.30))'
                          : 'drop-shadow(0px 4px 8px rgba(0,0,0,.15))',
                      transition: 'all .12s ease',
                    }}
                  />

                  <foreignObject
                    x={textPos.x - w / 2}
                    y={textPos.y - h / 2}
                    width={w}
                    height={h}
                    style={{
                      pointerEvents: 'none',
                      transformOrigin: `${textPos.x}px ${textPos.y}px`,
                      transform: isVertical
                        ? `rotate(${rotate}deg)`
                        : undefined,
                      overflow: 'visible',
                    }}
                  >
                    <div
                      xmlns="http://www.w3.org/1999/xhtml"
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        color: 'white',
                        fontFamily: 'Inter, system-ui, Arial',
                        lineHeight: 1.05,
                        padding: '4px 6px',
                        boxSizing: 'border-box',
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 900,
                          fontSize: titleSize,
                          letterSpacing: '0.3px',
                          whiteSpace: 'nowrap',
                          overflow: 'visible',
                          textShadow: '0 1px 1px rgba(0,0,0,.15)',
                        }}
                      >
                        {seg.label}
                      </div>

                      <div
                        style={{
                          marginTop: 5,
                          fontWeight: 700,
                          fontSize: subSize,
                          opacity: 0.95,
                          whiteSpace: 'nowrap',
                          textShadow: '0 1px 1px rgba(0,0,0,.12)',
                        }}
                      >
                        {seg.sub}
                      </div>
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {/* Centro */}
            <g
              style={{ cursor: 'pointer' }}
              onPointerDown={() => setCenterPressed(true)}
              onPointerUp={() => setCenterPressed(false)}
              onPointerLeave={() => setCenterPressed(false)}
              onClick={onCenterClick}
            >
              <circle
                cx={cx}
                cy={cy}
                r={70}
                fill="#0F172A"
                style={{
                  transformOrigin: `${cx}px ${cy}px`,
                  transform: centerPressed ? 'scale(0.97)' : 'scale(1)',
                  filter: centerPressed
                    ? 'drop-shadow(0px 5px 10px rgba(0,0,0,.35))'
                    : 'drop-shadow(0px 8px 16px rgba(0,0,0,.35))',
                  transition: 'all .12s ease',
                }}
              />
              <circle
                cx={cx}
                cy={cy}
                r={80}
                fill="none"
                stroke="white"
                strokeWidth={8}
                opacity={0.95}
              />

              <foreignObject
                x={cx - 120 / 2}
                y={cy - 74 / 2}
                width={120}
                height={74}
                style={{ pointerEvents: 'none' }}
              >
                <div
                  xmlns="http://www.w3.org/1999/xhtml"
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: 'white',
                    fontFamily: 'Inter, system-ui, Arial',
                    lineHeight: 1.05,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 900,
                      fontSize: 18,
                      letterSpacing: '0.3px',
                    }}
                  >
                    INFORME
                  </div>
                  <div
                    style={{
                      marginTop: 6,
                      fontWeight: 800,
                      fontSize: 10,
                      opacity: 0.92,
                    }}
                  >
                    {active === 'informe' ? 'PERIODO' : active.toUpperCase()}
                  </div>
                </div>
              </foreignObject>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
