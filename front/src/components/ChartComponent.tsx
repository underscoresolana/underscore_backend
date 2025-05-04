import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface ChartData {
  x: string | number;
  y: number;
  [key: string]: any;
}

interface ChartComponentProps {
  data: ChartData[];
  dataKey: string;
  xAxisDataKey?: string;
  color?: string;
  height?: number | string;
  width?: number | string;
  domain?: [number | string, number | string];
  className?: string;
  disableTooltip?: boolean;
  precision?: number;
  showGrid?: boolean;
}

const ChartComponent = ({
  data,
  dataKey,
  xAxisDataKey = "x",
  color = "#44D7EB",
  height = 100,
  width = "100%",
  domain = ['auto', 'auto'],
  className,
  disableTooltip = false,
  precision = 0,
  showGrid = true
}: ChartComponentProps) => {
  return (
    <div className={className} style={{ width: width, height: height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={data} 
          margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
        >
          {/* Gradient definition for the area under the line */}
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={true} 
              horizontal={true} 
              stroke="rgba(255, 255, 255, 0.1)" 
            />
          )}
          
          {/* Reference line at the middle */}
          <ReferenceLine 
            y={(domain[0] === 'auto' || domain[1] === 'auto') 
              ? undefined 
              : (Number(domain[0]) + Number(domain[1])) / 2} 
            stroke="rgba(255, 255, 255, 0.15)" 
            strokeWidth={1} 
          />
          
          {/* The main data line */}
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            dot={false}
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={1500}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          
          <YAxis 
            domain={domain as [number, number]}
            axisLine={false}
            tick={false}
            tickLine={false}
            hide={true}
          />
          
          <XAxis 
            dataKey={xAxisDataKey} 
            hide={true} 
          />
          
          {!disableTooltip && (
            <Tooltip 
              formatter={(value: number) => [value.toFixed(precision), '']}
              contentStyle={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                padding: '6px 10px'
              }}
              labelStyle={{ color: '#aaa' }}
              itemStyle={{ color: '#fff' }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartComponent;
