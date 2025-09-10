import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (term: string) => void;
  isLoading?: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm.trim());
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="flex gap-2 mb-6">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search proposals by lead name, email, or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          className="bg-green-800/50 border-green-600 text-green-100 placeholder-green-300"
          disabled={isLoading}
        />
        {searchTerm && (
          <Button
            onClick={handleClear}
            size="sm"
            variant="ghost"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-green-700"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <Button
        onClick={handleSearch}
        disabled={isLoading}
        className="bg-green-600 hover:bg-green-500"
      >
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  );
}