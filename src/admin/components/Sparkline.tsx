import React from 'react';

interface SparklineProps {
    data: number[];
    color?: string; // hex or tailwind-friendly color
    fillColor?: string;
    height?: number;
    className?: string;
}

export const Sparkline: React.FC<SparklineProps> = ({
    data,
    color = '#8b5cf6',
    fillColor,
    height = 50,
    className = '',
}) => {
    if (!data || data.length < 2) return null;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const width = 300;
    const padding = 6;
    const effectiveHeight = height - padding * 2;

    const points = data.map((val, idx) => {
        const x = (idx / (data.length - 1)) * width;
        const y = height - padding - ((val - min) / range) * effectiveHeight;
        return { x, y };
    });

    // Generate smooth cubic bezier curve
    const buildPath = () => {
        let path = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i === 0 ? 0 : i - 1];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[i + 2] || p2;

            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;

            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }
        return path;
    };

    const strokePath = buildPath();
    const areaPath = `${strokePath} L ${width} ${height} L 0 ${height} Z`;
    const gradientId = `sparkline-grad-${color.replace('#', '')}-${Math.random().toString(36).substring(2, 7)}`;

    return (
        <div className={`w-full overflow-hidden ${className}`}>
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={fillColor || color} stopOpacity="0.25" />
                        <stop offset="100%" stopColor={fillColor || color} stopOpacity="0.02" />
                    </linearGradient>
                </defs>
                <path d={areaPath} fill={`url(#${gradientId})`} />
                <path
                    d={strokePath}
                    fill="none"
                    stroke={color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};
