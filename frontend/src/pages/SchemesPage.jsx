import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import SchemeCard from "../components/SchemeCard";
import SearchBar from "../components/SearchBar";
import LoadingSpinner from "../components/LoadingSpinner";
import { schemeService } from "../services/api";
import { Sparkles } from "lucide-react";

const SchemesPage = () => {
  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchSchemes = async () => {
      setLoading(true);

      try {
        const data = await schemeService.getSchemes();

        setSchemes(data);
        setFilteredSchemes(data);
      } catch (error) {
        console.error("Failed to fetch schemes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setFilteredSchemes(schemes);
      return;
    }

    const filtered = schemes.filter((scheme) =>
      scheme.scheme_name
        ?.toLowerCase()
        .includes(query.toLowerCase())
    );

    setFilteredSchemes(filtered);
  }, [query, schemes]);

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-sky-600" />
          Government Schemes
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          {filteredSchemes.length} scheme
          {filteredSchemes.length !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="mb-6">
        <SearchBar
          value={query}
          onChange={setQuery}
        />
      </div>

      {loading ? (
        <LoadingSpinner label="Loading schemes..." />
      ) : filteredSchemes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-700">
            No schemes found
          </h3>

          <p className="text-gray-500 mt-2">
            Try searching with a different keyword.
          </p>

          <button
            onClick={() => setQuery("")}
            className="mt-4 text-sky-600 font-semibold hover:underline"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {filteredSchemes.map((scheme) => (
            <SchemeCard
              key={scheme.scheme_id}
              scheme={scheme}
            />
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default SchemesPage;