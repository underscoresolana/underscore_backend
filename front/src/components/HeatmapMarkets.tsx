import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';

// Define the Market interface with proper types
interface Market {
  id: string;
  name: string;
  size: number; // Changed from string enum to number
  marketCap: number;
  change24h: number;
  // Add grid position properties
  gridRow?: number;
  gridCol?: number;
  actualSize?: number;
}

const HeatmapMarkets = () => {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [allMarketCount, setAllMarketCount] = useState(0); // Track total markets from API
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const selectedCategory = searchParams.get('category');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/market-heatmap');
        if (!response.ok) {
          throw new Error('Failed to fetch market heatmap data');
        }
        const data = await response.json();
        
        // Store the total count from API
        setAllMarketCount(data.length);
        console.log(`API returned ${data.length} markets`);
        
        // Process the data to ensure size is a number
        const processedData = data.map((market: any) => ({
          ...market,
          size: typeof market.size === 'number' ? Math.min(Math.max(1, Math.floor(market.size)), 7) : 1
        }));
        
        // Sort markets by size (largest first) and then by market cap
        const sortedMarkets = [...processedData].sort((a: Market, b: Market) => {
          if (a.size !== b.size) return b.size - a.size;
          return b.marketCap - a.marketCap;
        });
        
        setMarkets(sortedMarkets);
      } catch (error) {
        console.error('Error fetching market heatmap data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getRelativeSize = (size: number): string => {
    // Ensure size is between 1 and 7
    const clampedSize = Math.min(Math.max(1, Math.floor(size)), 7);
    return `col-span-${clampedSize} row-span-${clampedSize}`;
  };

  const getBackgroundColor = (change: number): string => {
    // Red shades for negative changes
    if (change < -10) return 'bg-red-900';
    if (change < -5) return 'bg-red-800';
    if (change < -2) return 'bg-red-700';
    if (change < 0) return 'bg-red-600';
    
    // Green shades for positive changes
    if (change > 10) return 'bg-green-700';
    if (change > 5) return 'bg-green-600';
    if (change > 2) return 'bg-green-500';
    if (change > 0) return 'bg-green-400';
    
    // Neutral for zero
    return 'bg-gray-500';
  };

  const getTextColor = (change: number): string => {
    // For extreme colors, ensure text remains readable
    if (Math.abs(change) > 10) return 'text-white';
    return 'text-gray-100';
  };

  // Check if a market is selected
  const isSelected = (marketId: string): boolean => {
    // For markets with appended index, we need to check the base ID
    const baseId = marketId.split('-')[0];
    return selectedCategory === marketId || selectedCategory === baseId;
  };

  // Function to arrange markets in a grid with larger tiles at top and left
  const arrangeMarkets = () => {
    // Safety check - return original markets if empty
    if (!markets || markets.length === 0) return [];
    
    console.log(`Arranging ${markets.length} markets`);
    
    // Define the collapsed height for proper arrangement
    const collapsedMaxHeight = 12;
    
    // For both collapsed and expanded views, use this algorithm
    // Clone the markets array to avoid modifying the original
    const marketsToArrange = [...markets];
    let arrangedMarkets: Market[] = [];
    const gridSize = expanded ? 36 : 12; // Increase grid size for expanded view to fit all markets
    
    // Sort markets by size (largest first) and then by market cap
    marketsToArrange.sort((a, b) => {
      const sizeA = Math.min(Math.max(1, Math.floor(a.size)), expanded ? 5 : 7);
      const sizeB = Math.min(Math.max(1, Math.floor(b.size)), expanded ? 5 : 7);
      if (sizeA !== sizeB) return sizeB - sizeA;
      return b.marketCap - a.marketCap;
    });
    
    // Create a grid representation
    const grid: boolean[][] = Array(gridSize).fill(null).map(() => Array(12).fill(false));
    
    // Helper function to check if a position is available for a market of given size
    const isPositionAvailable = (row: number, col: number, size: number): boolean => {
      if (row + size > gridSize || col + size > 12) return false;
      
      for (let r = row; r < row + size; r++) {
        for (let c = col; c < col + size; c++) {
          if (grid[r][c]) return false;
        }
      }
      
      return true;
    };
    
    // Helper function to mark a position as occupied
    const markPosition = (row: number, col: number, size: number) => {
      for (let r = row; r < row + size; r++) {
        for (let c = col; c < col + size; c++) {
          grid[r][c] = true;
        }
      }
    };
    
    // Function to place a market in the grid
    const placeMarket = (market: Market, prioritizeTop: boolean = true) => {
      const size = Math.min(Math.max(1, Math.floor(market.size)), expanded ? 5 : 7);
      
      let placed = false;
      let startRow = 0;
      let endRow = gridSize;
      
      // In expanded mode, first try to place markets below the collapsed area
      // if we're not prioritizing the top
      if (expanded && !prioritizeTop) {
        startRow = collapsedMaxHeight;
      }
      
      // Find the first available position
      for (let row = startRow; row < endRow && !placed; row++) {
        for (let col = 0; col < 12 && !placed; col++) {
          if (isPositionAvailable(row, col, size)) {
            markPosition(row, col, size);
            arrangedMarkets.push({
              ...market,
              gridRow: row,
              gridCol: col,
              actualSize: size
            });
            placed = true;
          }
        }
      }
      
      // If couldn't place in the preferred area, try the whole grid
      if (!placed && !prioritizeTop && expanded) {
        for (let row = 0; row < collapsedMaxHeight && !placed; row++) {
          for (let col = 0; col < 12 && !placed; col++) {
            if (isPositionAvailable(row, col, size)) {
              markPosition(row, col, size);
              arrangedMarkets.push({
                ...market,
                gridRow: row,
                gridCol: col,
                actualSize: size
              });
              placed = true;
            }
          }
        }
      }
      
      // If still couldn't place, try smaller sizes
      if (!placed) {
        for (let s = size - 1; s >= 1 && !placed; s--) {
          for (let row = startRow; row < endRow && !placed; row++) {
            for (let col = 0; col < 12 && !placed; col++) {
              if (isPositionAvailable(row, col, s)) {
                markPosition(row, col, s);
                arrangedMarkets.push({
                  ...market,
                  gridRow: row,
                  gridCol: col,
                  actualSize: s
                });
                placed = true;
              }
            }
          }
          
          // Try the whole grid for expanded view
          if (!placed && !prioritizeTop && expanded) {
            for (let row = 0; row < startRow && !placed; row++) {
              for (let col = 0; col < 12 && !placed; col++) {
                if (isPositionAvailable(row, col, s)) {
                  markPosition(row, col, s);
                  arrangedMarkets.push({
                    ...market,
                    gridRow: row,
                    gridCol: col,
                    actualSize: s
                  });
                  placed = true;
                }
              }
            }
          }
        }
      }
      
      return placed;
    };
    
    // First, handle all large markets - place them at the top
    const largeMarkets = marketsToArrange.filter(m => Math.floor(m.size) >= 3);
    const smallMarkets = marketsToArrange.filter(m => Math.floor(m.size) < 3);
    
    // Place large markets first (prioritized at top)
    largeMarkets.forEach(market => placeMarket(market, true));
    
    // Calculate how many have been placed so far
    const placedCount = arrangedMarkets.length;
    
    // For small markets, in expanded mode, we want to promote filling rows below the visible area first
    if (expanded) {
      // Separate markets that will be visible in collapsed mode vs those that won't
      const visibleInCollapsed: Market[] = [];
      const hiddenInCollapsed: Market[] = [];
      
      // Place enough markets to fill the collapsed view first
      let remainingToPlace = smallMarkets;
      
      // Calculate the grid fullness in collapsed view
      const collapsedGrid = grid.slice(0, collapsedMaxHeight);
      const filledCells = collapsedGrid.flat().filter(cell => cell).length;
      const totalCells = collapsedMaxHeight * 12;
      const fullnessRatio = filledCells / totalCells;
      
      // If the collapsed grid is less than 80% full, try to fill it first
      if (fullnessRatio < 0.8) {
        // First pass: prioritize the top area
        const prioritizedMarkets = remainingToPlace.slice(0, 20); // Take a reasonable number to try in the top area
        const restMarkets = remainingToPlace.slice(20);
        
        for (const market of prioritizedMarkets) {
          const placed = placeMarket(market, true);
          if (placed) {
            visibleInCollapsed.push(market);
          } else {
            hiddenInCollapsed.push(market);
          }
        }
        
        // All remaining go below
        hiddenInCollapsed.push(...restMarkets);
      } else {
        // Grid is already full enough in collapsed view, place all remaining below
        hiddenInCollapsed.push(...remainingToPlace);
      }
      
      // Place the markets that should be hidden below the collapsed area
      for (const market of hiddenInCollapsed) {
        placeMarket(market, false);
      }
    } else {
      // In collapsed mode, just place them wherever they fit
      smallMarkets.forEach(market => placeMarket(market, true));
    }
    
    // Fallback: Place any markets that couldn't be placed as size 1 in any available spot
    if (arrangedMarkets.length < markets.length) {
      console.warn('Some markets could not be placed optimally, using fallback placement');
      
      // Get markets that haven't been placed
      const placedIds = new Set(arrangedMarkets.map(m => m.id));
      const unplacedMarkets = markets.filter(m => !placedIds.has(m.id));
      
      // Simply place them in the first available spot as size 1
      for (const market of unplacedMarkets) {
        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < 12; col++) {
            if (!grid[row][col]) {
              grid[row][col] = true;
              arrangedMarkets.push({
                ...market,
                gridRow: row,
                gridCol: col,
                actualSize: 1
              });
              break;
            }
          }
        }
      }
    }
    
    console.log(`Arranged ${arrangedMarkets.length} of ${markets.length} markets`);
    return arrangedMarkets;
  };

  // Function to limit visible markets to fit a 2:1 aspect ratio
  const getVisibleMarkets = (arrangedMarkets: any[]) => {
    if (expanded) return arrangedMarkets;
    
    // For a 2:1 ratio, limit height to half of max width (12 columns)
    const maxHeightForRatio = 12; // Extended height - twice the previous value
    
    // Filter markets to only include those that fit within the height limit
    const visible = arrangedMarkets.filter(market => {
      const row = market.gridRow || 0;
      const size = market.actualSize || Math.floor(market.size) || 1;
      return row + size <= maxHeightForRatio;
    });
    
    console.log(`Showing ${visible.length} of ${arrangedMarkets.length} markets in collapsed view`);
    return visible;
  };

  if (loading) {
    return <div className="mt-6">Loading market heatmap data...</div>;
  }

  // Memoize the arranged markets to prevent recalculation on every render
  // and wrap in try/catch to prevent crashes
  let arrangedMarkets: any[] = [];
  try {
    arrangedMarkets = arrangeMarkets();
  } catch (error) {
    console.error('Error arranging markets:', error);
    arrangedMarkets = markets.map((market, index) => ({
      ...market,
      gridRow: Math.floor(index / 4),
      gridCol: index % 4,
      size: 1
    }));
  }

  // Get the markets that should be visible based on expanded state
  const visibleMarkets = getVisibleMarkets(arrangedMarkets);
  
  // Force show button if we have more markets than we're showing
  const shouldShowExpandButton = !expanded && (
    visibleMarkets.length < arrangedMarkets.length || 
    markets.length < allMarketCount
  );

  return (
    <div className="mt-6">
      <h2 className="text-2xl mb-5">Market Heatmap</h2>
      <div className="text-sm text-muted-foreground mb-2">
        Showing {visibleMarkets.length} of {allMarketCount} markets
      </div>
      
      <div className={cn(
        "grid grid-cols-12 gap-0.5 w-full", 
        expanded ? "grid-rows-[repeat(36,minmax(0,1fr))]" : "grid-rows-[repeat(12,minmax(0,1fr))] relative pb-12"
      )}>
        {visibleMarkets.map((market) => (
          <Link
            key={market.id}
            to={`/markets?category=${market.id.split('-')[0]}`}
            style={{
              gridRow: (market.gridRow || 0) + 1,
              gridColumn: (market.gridCol || 0) + 1,
              gridRowEnd: (market.gridRow || 0) + (market.actualSize || Math.floor(market.size) || 1) + 1,
              gridColumnEnd: (market.gridCol || 0) + (market.actualSize || Math.floor(market.size) || 1) + 1
            }}
            className={cn(
              getBackgroundColor(market.change24h),
              "relative p-1 transition-opacity",
              isSelected(market.id) ? "ring-2 ring-[#0000FF] ring-offset-1 ring-offset-background z-10" : "hover:opacity-90"
            )}
          >
            <AspectRatio ratio={2} className="w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1">
                <span className={cn("font-medium text-xs sm:text-sm md:text-base", getTextColor(market.change24h))}>
                  {market.name}
                </span>
                <span className={cn("text-xs sm:text-sm", getTextColor(market.change24h))}>
                  {market.change24h > 0 ? '+' : ''}{market.change24h.toFixed(2)}%
                </span>
              </div>
            </AspectRatio>
          </Link>
        ))}
        
        {shouldShowExpandButton && (
          <button
            onClick={() => setExpanded(true)}
            className="absolute bottom-0 left-0 w-full bg-gradient-to-b from-transparent to-background dark:to-background py-6 pt-12 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity z-20"
          >
            <div className="bg-primary hover:bg-primary/80 transition-colors rounded-full px-5 py-2 flex items-center gap-2 text-sm font-medium text-primary-foreground shadow-md border border-primary-foreground/20">
              Show All {allMarketCount - visibleMarkets.length} More Markets
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 12 12" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 9L11 4H1L6 9Z" fill="currentColor" />
              </svg>
            </div>
          </button>
        )}
        
        {expanded && (
          <button
            onClick={() => setExpanded(false)}
            className="fixed bottom-4 right-4 z-50 bg-primary hover:bg-primary/80 transition-colors rounded-full px-5 py-2 flex items-center gap-2 text-sm font-medium text-primary-foreground shadow-md border border-primary-foreground/20"
          >
            Show Less
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 12 12" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="rotate-180"
            >
              <path d="M6 9L11 4H1L6 9Z" fill="currentColor" />
            </svg>
          </button>
        )}
      </div>
      
      <div className="mt-4 flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center">
          <div className="flex gap-2 items-center">
            <span className="w-3 h-3 inline-block bg-red-800"></span>
            <span>Decrease</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex gap-2 items-center">
            <span className="w-3 h-3 inline-block bg-green-600"></span>
            <span>Increase</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapMarkets;
