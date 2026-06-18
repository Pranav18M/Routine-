'use client';
import { useEffect, useRef } from 'react';

export default function ProgressRing({
  percentage = 0,
  size = 80,
  strokeWidth = 7,
  color = '#6C47FF',
  trackColor = 'rgba(255,255,255,0.06)',
  label,
  sublabel,
  animate = true,
}) {
  const circleRef = useRef(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPct = Math.min(100, Math.max(0, percentage));
  const offset = circumference - (clampedPct / 100) * circumference;

  useEffect(() => {
    if (!circleRef.current || !animate) return;
    const el = circleRef.current;
    // Start from full offset (empty), animate to target
    el.style.strokeDashoffset = circumference;
    requestAnimationFrame(() => {
      el.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
      el.style.strokeDashoffset = offset;
    });
  }, [percentage, circumference, offset, animate]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-label={`Progress: ${clampedPct}%`}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animate ? circumference : offset}
          style={!animate ? { strokeDashoffset: offset } : undefined}
        />
      </svg>
      {/* Center label */}
      {(label !== undefined || sublabel) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {label !== undefined && (
            <span
              className="font-bold text-primary leading-none"
              style={{ fontSize: size * 0.22 }}
            >
              {label}
            </span>
          )}
          {sublabel && (
            <span
              className="text-secondary leading-none mt-0.5"
              style={{ fontSize: size * 0.13 }}
            >
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}