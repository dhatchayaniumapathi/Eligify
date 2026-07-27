import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LoadingSpinner from "../components/LoadingSpinner";
import { schemeService } from "../services/api";
import { ArrowLeft, Gift, FileText } from "lucide-react";

const SchemeDetailPage = () => {
  const { id } = useParams();

  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        const data = await schemeService.getSchemeById(id);
        
        setScheme(data);
      } catch (error) {
        console.error("Error loading scheme:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScheme();
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <LoadingSpinner label="Loading Scheme..." />
      </MainLayout>
    );
  }

  if (!scheme) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold">Scheme Not Found</h2>
          <Link
            to="/schemes"
            className="inline-block mt-4 text-sky-600 hover:underline"
          >
            Back to Schemes
          </Link>
        </div>
      </MainLayout>
    );
  }

  const documents = String(scheme.required_documents || "")
    .split(",")
    .map((doc) => doc.trim())
    .filter(Boolean);

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">

        <Link
          to="/schemes"
          className="inline-flex items-center gap-2 text-sky-600 mb-6 hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Schemes
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border p-8">

          <h1 className="text-3xl font-bold mb-6">
            {scheme.scheme_name}
          </h1>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              Description
            </h2>

            <p className="text-gray-700 leading-7">
              {scheme.description}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
              <Gift size={20} />
              Benefits
            </h2>

            <p className="text-gray-700 leading-7">
              {scheme.benefits}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
              <FileText size={20} />
              Required Documents
            </h2>

            <ul className="list-disc pl-6 space-y-2">
              {documents.length > 0 ? (
                documents.map((doc, index) => (
                  <li key={index}>{doc}</li>
                ))
              ) : (
                <li>No documents specified.</li>
              )}
            </ul>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default SchemeDetailPage;