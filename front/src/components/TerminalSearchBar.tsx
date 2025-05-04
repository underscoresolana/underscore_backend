import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockTokens } from '@/lib/mock-data';
import { Terminal } from 'lucide-react';
import './TerminalSearchBar.css';

const TerminalSearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<typeof mockTokens>([]);
  const [showResults, setShowResults] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine if we're on the Deep Dive page
  const isDeepDivePage = location.pathname === '/deep-dive';
  
  // Set placeholder text based on current page
  const placeholderText = isDeepDivePage
    ? "Search for another token to analyze : enter token's name or ticker"
    : "Dive deeper into particular token scoring : enter token's name or ticker";
  
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
  
  // Determine the terminal prompt based on current page
  const terminalPrompt = isDeepDivePage
    ? "user@underscore:~/analysis$"
    : "user@underscore:~$";
  
  return (
    <div className="relative w-full mb-6" ref={searchRef}>
      <div className={`
        terminal-container relative transition-all
        ${isFocused ? 'shadow-[0_0_20px_rgba(68,215,235,0.3)]' : ''}
      `}>
        {/* Terminal body */}
        <div className="terminal-body bg-black border border-[#333]">
          <div className="flex items-center px-3 py-3 text-green-400 font-mono text-sm">
            <span className="mr-2">{terminalPrompt}</span>
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder={placeholderText}
                className={`
                  w-full bg-transparent border-none
                  font-mono text-green-400 
                  focus:outline-none transition-all duration-300
                  terminal-input
                `}
                value={query}
                onChange={handleSearch}
                onFocus={() => {
                  setIsFocused(true);
                  if (results.length > 0) setShowResults(true);
                }}
              />
              {isFocused && query.length === 0 && (
                <span className="terminal-cursor"></span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showResults && results.length > 0 && (
        <div 
          className="absolute z-10 w-full mt-1 bg-black/95 backdrop-blur-md 
                     border border-[#333] shadow-[0_10px_25px_rgba(0,0,0,0.5)] 
                     max-h-60 overflow-auto fade-in"
        >
          {results.map(token => (
            <div 
              key={token.id}
              className="p-3 border-b border-[#333] last:border-0 
                         hover:bg-[#111] cursor-pointer transition-colors 
                         duration-200"
              onClick={() => handleSelect(token.id)}
            >
              <div className="font-medium text-green-400">
                <span className="text-green-500">$</span> {token.name} <span className="text-gray-500">({token.symbol})</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TerminalSearchBar; 