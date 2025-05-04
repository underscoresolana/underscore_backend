import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockTokens } from '@/lib/mock-data';
import { Search } from 'lucide-react';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof mockTokens>([]);
  const [showResults, setShowResults] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 1) {
      const filtered = mockTokens.filter(token => 
        token.name.toLowerCase().includes(value.toLowerCase()) || 
        token.symbol.toLowerCase().includes(value.toLowerCase())
      );
      setResults(filtered);
      setShowResults(true);
    } else {
      setResults([]);
      setShowResults(false);
    }
  };
  
  const handleSelect = (tokenId: string) => {
    navigate(`/deep-dive?token=${tokenId}`);
    setQuery('');
    setShowResults(false);
    setIsFocused(false);
  };
  
  return (
    <div className="relative" ref={searchRef}>
      <div className={`relative transition-all ${isFocused ? 'accent-border' : 'border-white/10 border'}`}>
        <Search 
          className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
            isFocused ? 'text-[var(--accent-color-1)]' : 'text-muted-foreground'
          }`} 
        />
        <input
          type="text"
          placeholder="Enter token name or ticker"
          className={`w-full bg-black/70 backdrop-blur-md pl-10 pr-4 py-3 
                      focus:outline-none transition-all duration-300
                      ${isFocused ? 'shadow-[0_0_15px_rgba(68,215,235,0.2)]' : ''}`}
          value={query}
          onChange={handleSearch}
          onFocus={() => {
            setIsFocused(true);
            if (results.length > 0) setShowResults(true);
          }}
        />
      </div>
      
      {showResults && results.length > 0 && (
        <div 
          className="absolute z-10 w-full mt-1 bg-black/80 backdrop-blur-md 
                     border border-white/10 shadow-[0_10px_25px_rgba(0,0,0,0.2)] 
                     max-h-60 overflow-auto fade-in"
        >
          {results.map(token => (
            <div 
              key={token.id}
              className="p-3 border-b border-white/5 last:border-0 
                         hover:bg-black/90 cursor-pointer transition-colors 
                         duration-200"
              onClick={() => handleSelect(token.id)}
            >
              <div className="font-medium">{token.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{token.symbol}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
