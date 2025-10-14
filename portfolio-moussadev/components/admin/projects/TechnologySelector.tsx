"use client";

import { useState, useEffect, useRef } from "react";
import { apiClient } from "@/lib/api";
import { Technology, TechCategory, TechStatus } from "@/types/technology";
import { FiX, FiPlus, FiCheck } from "react-icons/fi";
import { generateSlug } from "@/lib/utils";

interface TechnologySelectorProps {
  selectedTechnologyIds: string[];
  onChange: (technologyIds: string[]) => void;
  className?: string;
}

export default function TechnologySelector({
  selectedTechnologyIds,
  onChange,
  className = "",
}: TechnologySelectorProps) {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Nouveau state pour le formulaire de création rapide
  const [newTechForm, setNewTechForm] = useState({
    name: "",
    category: TechCategory.LANGUAGES,
    status: TechStatus.LEARNING,
  });

  useEffect(() => {
    loadTechnologies();
  }, []);

  const loadTechnologies = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getTechnologies();
      setTechnologies(data);
    } catch (error) {
      console.error("Erreur lors du chargement des technologies:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedTechnologies = technologies.filter((tech) =>
    selectedTechnologyIds.includes(tech.id)
  );

  const filteredTechnologies = technologies.filter(
    (tech) =>
      !selectedTechnologyIds.includes(tech.id) &&
      tech.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectTechnology = (tech: Technology) => {
    onChange([...selectedTechnologyIds, tech.id]);
    setSearchTerm("");
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleRemoveTechnology = (techId: string) => {
    onChange(selectedTechnologyIds.filter((id) => id !== techId));
  };

  const handleCreateNewTechnology = async () => {
    if (!newTechForm.name.trim()) return;

    try {
      setLoading(true);
      const newTech = await apiClient.createTechnology({
        name: newTechForm.name.trim(),
        slug: generateSlug(newTechForm.name),
        category: newTechForm.category,
        status: newTechForm.status,
      });

      // Ajouter la nouvelle techno à la liste
      setTechnologies((prev) => [...prev, newTech]);
      // La sélectionner automatiquement
      onChange([...selectedTechnologyIds, newTech.id]);

      // Reset form
      setNewTechForm({
        name: "",
        category: TechCategory.LANGUAGES,
        status: TechStatus.LEARNING,
      });
      setShowCreateForm(false);
      setSearchTerm("");
      setShowDropdown(false);
    } catch (error) {
      console.error("Erreur lors de la création de la technologie:", error);
      alert("Erreur lors de la création de la technologie");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Technologies sélectionnées (tags) */}
      {selectedTechnologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedTechnologies.map((tech) => (
            <div
              key={tech.id}
              className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
            >
              <span>{tech.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveTechnology(tech.id)}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <FiX className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input de recherche */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
            setShowCreateForm(false);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Rechercher ou créer une technologie..."
          className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />

        {/* Dropdown avec résultats */}
        {showDropdown && (
          <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {/* Option pour créer une nouvelle technologie */}
            {searchTerm.trim() && !showCreateForm && (
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(true);
                  setNewTechForm((prev) => ({
                    ...prev,
                    name: searchTerm.trim(),
                  }));
                }}
                className="w-full px-4 py-3 text-left hover:bg-muted flex items-center gap-2 text-blue-600 border-b border-border"
              >
                <FiPlus className="w-4 h-4" />
                <span>
                  Créer &quot;{searchTerm.trim()}&quot; comme nouvelle
                  technologie
                </span>
              </button>
            )}

            {/* Formulaire de création rapide */}
            {showCreateForm && (
              <div className="p-4 border-b border-border bg-blue-50">
                <p className="text-sm font-medium mb-3 text-foreground">
                  Nouvelle technologie : {newTechForm.name}
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-foreground">
                      Catégorie
                    </label>
                    <select
                      value={newTechForm.category}
                      onChange={(e) =>
                        setNewTechForm((prev) => ({
                          ...prev,
                          category: e.target.value as TechCategory,
                        }))
                      }
                      className="w-full px-3 py-1.5 text-sm border border-border rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={TechCategory.LANGUAGES}>💬 Langage</option>
                      <option value={TechCategory.FRAMEWORKS}>
                        🏗️ Framework
                      </option>
                      <option value={TechCategory.LIBRARIES}>
                        📚 Librairie
                      </option>
                      <option value={TechCategory.TOOLS}>🔧 Outil</option>
                      <option value={TechCategory.PLATFORMS}>
                        🌐 Plateforme
                      </option>
                      <option value={TechCategory.DATABASES}>
                        🗄️ Base de données
                      </option>
                      <option value={TechCategory.DEVOPS}>⚙️ DevOps</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-foreground">
                      Statut
                    </label>
                    <select
                      value={newTechForm.status}
                      onChange={(e) =>
                        setNewTechForm((prev) => ({
                          ...prev,
                          status: e.target.value as TechStatus,
                        }))
                      }
                      className="w-full px-3 py-1.5 text-sm border border-border rounded focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={TechStatus.LEARNING}>
                        🔵 En apprentissage
                      </option>
                      <option value={TechStatus.MASTERED}>🟢 Maîtrisée</option>
                      <option value={TechStatus.EXPLORING}>
                        🟣 Exploration
                      </option>
                      <option value={TechStatus.TO_REVIEW}>🟡 À revoir</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCreateNewTechnology}
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm flex items-center justify-center gap-2"
                    >
                      <FiCheck className="w-4 h-4" />
                      Créer et ajouter
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setSearchTerm("");
                      }}
                      className="px-3 py-1.5 border border-border rounded text-sm hover:bg-muted"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Liste des technologies existantes */}
            {!showCreateForm && (
              <>
                {loading ? (
                  <div className="px-4 py-3 text-center text-foreground/70">
                    Chargement...
                  </div>
                ) : filteredTechnologies.length > 0 ? (
                  filteredTechnologies.map((tech) => (
                    <button
                      key={tech.id}
                      type="button"
                      onClick={() => handleSelectTechnology(tech)}
                      className="w-full px-4 py-3 text-left hover:bg-muted flex items-center justify-between"
                    >
                      <span className="font-medium text-foreground">
                        {tech.name}
                      </span>
                      <span className="text-xs text-foreground/60">
                        {tech.category}
                      </span>
                    </button>
                  ))
                ) : searchTerm ? (
                  <div className="px-4 py-3 text-center text-foreground/70 text-sm">
                    Aucune technologie trouvée. Créez-en une nouvelle ci-dessus
                    !
                  </div>
                ) : (
                  <div className="px-4 py-3 text-center text-foreground/70 text-sm">
                    Tapez pour rechercher une technologie
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Bouton pour fermer le dropdown en cliquant à l'extérieur */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowDropdown(false);
            setShowCreateForm(false);
          }}
        />
      )}
    </div>
  );
}
