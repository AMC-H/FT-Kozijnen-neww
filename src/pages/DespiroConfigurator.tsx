import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

// ALLE kleuren zoals bij Ekoline
const alleKleuren = [
  "RAL 9016", "RAL 9005", "RAL 7016", "RAL 9001", "RAL 9010", "RAL 1013", "RAL 6009",
  "RAL 6021", "RAL 7039", "RAL 7040", "RAL 5011", "RAL 5003", "RAL 3004", "RAL 8017",
  "RAL 9007", "RAL 9006", "RAL 1015", "RAL 7012", "RAL 7021", "RAL 7024", "RAL 7035",
  "RAL 7037", "RAL 7042", "RAL 8019", "RAL 8022", "RAL 9018", "RAL 7030", "RAL 5010",
  "RAL 6005", "RAL 7001", "RAL 7015", "RAL 7038", "RAL 9002", "RAL 7047", "RAL 8003",
  "RAL 8011", "RAL 8023"
];

// Afbeelding uit storage bucket "kozijnen-photos", bestandsnaam op basis van slug
const SUPABASE_STORAGE_URL =
  "https://nsmzfzdvesacindbgkdq.supabase.co/storage/v1/object/public/kozijnen-photos/";

interface DespiroPaneel {
  id: number;
  naam: string;
  slug: string;
  image_path: string | null;
  min_breedte: number | null;
  max_breedte: number | null;
  min_hoogte: number | null;
  max_hoogte: number | null;
  design_kenmerk: string | null;
  beglazing_standaard: string | null;
  config_options: { [key: string]: string[] } | null;
}

function parseConfigOptions(json: any): { [key: string]: string[] } {
  if (!json) return {};
  if (typeof json === "object") return json;
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
}

const DespiroConfigurator: React.FC = () => {
  const navigate = useNavigate();
  const [panelen, setPanelen] = useState<DespiroPaneel[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    async function loadPanelen() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("despiro_panelen")
        .select("*")
        .order("id", { ascending: true });
      if (error) setError(error.message);
      setPanelen(
        (data || []).map((row: any) => ({
          ...row,
          config_options: parseConfigOptions(row.config_options),
        }))
      );
      setLoading(false);
    }
    loadPanelen();
  }, []);

  const currentPanel = panelen[currentIndex] || null;
  const prevPanel = panelen[(currentIndex - 1 + panelen.length) % panelen.length];
  const nextPanel = panelen[(currentIndex + 1) % panelen.length];

  // Afbeelding uit Supabase storage bucket "kozijnen-photos", bestandsnaam = slug + ".jpg"
  const getPanelImageUrl = (panel: DespiroPaneel | null) => {
    if (!panel || !panel.slug) return "";
    return `${SUPABASE_STORAGE_URL}${panel.slug}.jpg`;
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      "Gegevens klaar voor verzending:\n" +
        JSON.stringify(
          {
            ...formData,
            paneelId: currentPanel?.id,
            paneelNaam: currentPanel?.naam,
          },
          null,
          2
        )
    );
  };

  const goToPrevious = () => {
    if (panelen.length === 0) return;
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : panelen.length - 1));
  };
  const goToNext = () => {
    if (panelen.length === 0) return;
    setCurrentIndex((prev) => (prev < panelen.length - 1 ? prev + 1 : 0));
  };

  // --- CARROUSEL ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Despiro deuren laden...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <button
            onClick={() => navigate("/configurator")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Terug naar configurator
          </button>
        </div>
      </div>
    );
  }

  if (!showConfig && currentPanel) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div></div>
            <button
              onClick={() => navigate("/configurator")}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center gap-1 bg-transparent border-none px-0 py-0"
              style={{ marginBottom: "0.5rem" }}
            >
              <span style={{ fontSize: "1.2rem" }}>&larr;</span>
              Terug naar configuratie
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-lg px-4 md:px-12 py-8">
            <h1 className="text-3xl font-bold text-center mb-2">Despiro Deuren</h1>
            <p className="text-center text-gray-600 mb-10">
              Kies uw gewenste deur design uit onze exclusieve Despiro collectie.
            </p>
            <div className="flex items-center justify-center gap-2 md:gap-6 mb-8">
              {/* Vorige thumbnail */}
              <button
                onClick={goToPrevious}
                aria-label="Vorige deur"
                className="rounded-full bg-white shadow-sm hover:bg-gray-100 transition p-2 mr-2"
                style={{ marginRight: "-1.5rem", zIndex: 2 }}
              >
                <ChevronLeft className="h-6 w-6 text-gray-500" />
              </button>
              <img
                src={getPanelImageUrl(prevPanel)}
                alt={prevPanel?.naam || "Vorige"}
                className="w-20 h-36 object-contain opacity-40 grayscale pointer-events-none select-none"
                draggable={false}
                style={{
                  boxShadow: "0 2px 8px #0001",
                  background: "#f8f8f8",
                  borderRadius: 16,
                }}
              />
              {/* Hoofdafbeelding */}
              <div
                className="bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center w-[400px] h-[500px]"
                style={{ maxWidth: 500, maxHeight: 600 }}
              >
                <img
                  src={getPanelImageUrl(currentPanel)}
                  alt={currentPanel?.naam}
                  className="h-full w-auto object-contain"
                  style={{ margin: "0 auto", maxWidth: 400, maxHeight: 500 }}
                />
              </div>
              <img
                src={getPanelImageUrl(nextPanel)}
                alt={nextPanel?.naam || "Volgende"}
                className="w-20 h-36 object-contain opacity-40 grayscale pointer-events-none select-none"
                draggable={false}
                style={{
                  boxShadow: "0 2px 8px #0001",
                  background: "#f8f8f8",
                  borderRadius: 16,
                }}
              />
              <button
                onClick={goToNext}
                aria-label="Volgende deur"
                className="rounded-full bg-white shadow-sm hover:bg-gray-100 transition p-2 ml-2"
                style={{ marginLeft: "-1.5rem", zIndex: 2 }}
              >
                <ChevronRight className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="text-center mb-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                {currentPanel?.slug
                  ? `Despiro deur ${currentPanel.slug.toUpperCase()}`
                  : currentPanel?.naam}
              </h2>
            </div>
            <div className="text-center">
              <button
                onClick={() => setShowConfig(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto text-lg"
              >
                <Check className="h-5 w-5" />
                <span>Configureer deze deur</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- FORMULIER ---
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setShowConfig(false)}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium flex items-center gap-1 bg-transparent border-none px-0 py-0"
          >
            <span style={{ fontSize: "1.2rem" }}>&larr;</span>
            Terug naar configuratie
          </button>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Titel + info */}
          <div className="text-center mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
              {currentPanel?.slug
                ? `Despiro deur ${currentPanel.slug.toUpperCase()}`
                : currentPanel?.naam}
            </h2>
            <div className="mb-4 text-gray-700 text-center">
              <div>
                <strong>Design kenmerk:</strong> {currentPanel?.design_kenmerk || "-"}
              </div>
              <div>
                <strong>Beglazing standaard:</strong>{" "}
                {currentPanel?.beglazing_standaard || "-"}
              </div>
              <div>
                <strong>Afmetingen:</strong>
                {" "}
                Breedte {currentPanel?.min_breedte} - {currentPanel?.max_breedte} mm,
                {" "}
                Hoogte {currentPanel?.min_hoogte} - {currentPanel?.max_hoogte} mm
              </div>
            </div>
          </div>
          <div className="text-center mb-5">
            <img
              src={getPanelImageUrl(currentPanel)}
              alt={`Despiro deur ${currentPanel?.naam}`}
              className="mx-auto rounded-lg shadow-xl w-[400px] h-[500px] object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%236b7280' font-family='sans-serif' font-size='18'%3EAfbeelding niet beschikbaar%3C/text%3E%3C/svg%3E";
              }}
              style={{ maxWidth: "100%", maxHeight: "80vh" }}
            />
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Breedte en Hoogte */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Breedte (mm) *
                </label>
                <input
                  type="number"
                  value={formData.breedte || ""}
                  onChange={(e) =>
                    handleFormChange("breedte", e.target.value)
                  }
                  min={currentPanel?.min_breedte || 500}
                  max={currentPanel?.max_breedte || 1400}
                  placeholder={
                    currentPanel?.min_breedte && currentPanel?.max_breedte
                      ? `Tussen ${currentPanel.min_breedte} en ${currentPanel.max_breedte} mm`
                      : "Geef breedte op"
                  }
                  className="w-full border border-gray-300 rounded-lg p-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hoogte (mm) *
                </label>
                <input
                  type="number"
                  value={formData.hoogte || ""}
                  onChange={(e) =>
                    handleFormChange("hoogte", e.target.value)
                  }
                  min={currentPanel?.min_hoogte || 1900}
                  max={currentPanel?.max_hoogte || 2600}
                  placeholder={
                    currentPanel?.min_hoogte && currentPanel?.max_hoogte
                      ? `Tussen ${currentPanel.min_hoogte} en ${currentPanel.max_hoogte} mm`
                      : "Geef hoogte op"
                  }
                  className="w-full border border-gray-300 rounded-lg p-3"
                  required
                />
              </div>
            </div>
            {/* Kleur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kleur *
              </label>
              <select
                value={formData.kleur || ""}
                onChange={(e) => handleFormChange("kleur", e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3"
                required
              >
                <option value="">Kies kleur</option>
                {alleKleuren.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            {/* Dynamische opties uit config_options */}
            {currentPanel?.config_options &&
              Object.entries(currentPanel.config_options).map(
                ([key, values]: [string, string[]]) =>
                  Array.isArray(values) && values.length > 1 ? (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {key.replace(/_/g, " ")} *
                      </label>
                      <select
                        value={formData[key] || ""}
                        onChange={(e) => handleFormChange(key, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-3"
                        required
                      >
                        <option value="">
                          Kies {key.replace(/_/g, " ").toLowerCase()}
                        </option>
                        {values.map((v: string) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : Array.isArray(values) && values.length === 1 ? (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {key.replace(/_/g, " ")} *
                      </label>
                      <input
                        type="text"
                        value={values[0]}
                        readOnly
                        className="w-full border border-gray-200 bg-gray-100 rounded-lg p-3 text-gray-600"
                      />
                    </div>
                  ) : null
              )}
            {/* Opmerkingen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opmerkingen
              </label>
              <textarea
                value={formData.opmerkingen || ""}
                onChange={(e) =>
                  handleFormChange("opmerkingen", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3"
                rows={3}
                placeholder="Eventuele opmerkingen of speciale wensen…"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <Check className="h-5 w-5" />
              <span>Bevestig en ga verder</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DespiroConfigurator;