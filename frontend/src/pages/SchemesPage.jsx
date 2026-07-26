import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import SchemeCard from '../components/SchemeCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import LoadingSpinner from '../components/LoadingSpinner';
import { schemeService } from '../services/api';
import { Sparkles, SlidersHorizontal } from 'lucide-react';

const defaultFilters = { state: 'All', occupation: 'All', category: 'All', gender: 'All' };

const SchemesPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const data = await schemeService.getSchemes({ search: query, ...filters });
        setSchemes(data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [query, filters]);

  const updateFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val }));
  const resetFilters = () => { setFilters(defaultFilters); setQuery(''); };

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-sky-600" /> Scheme Recommendations
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {schemes.length} scheme{schemes.length !== 1 ? 's' : ''} found matching your profile
          </p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className="sm:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm">
          <SlidersHorizontal className="w-4 h-4 text-sky-600" /> Filters
        </button>
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar — desktop always visible, mobile toggled */}
        <div className={`flex-shrink-0 w-64 space-y-4 ${showFilters ? 'block' : 'hidden'} sm:block`}>
          <FilterPanel filters={filters} onChange={updateFilter} onReset={resetFilters} />
        </div>

        {/* Results Area */}
        <div className="flex-1 min-w-0 space-y-4">
          <SearchBar value={query} onChange={setQuery} />

          {loading ? (
            <LoadingSpinner label="Evaluating schemes against your profile..." />
          ) : schemes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
              <p className="text-gray-500 font-medium">No schemes match your current filters.</p>
              <button onClick={resetFilters} className="mt-3 text-sky-600 text-sm font-semibold hover:underline">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {schemes.map((s) => <SchemeCard key={s.scheme_id} scheme={s} />)}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default SchemesPage;
