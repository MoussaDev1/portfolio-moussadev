"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api";
import { Project, ProjectType, ProjectStatus } from "@/types/api";
import TechnologySelector from "./TechnologySelector";

interface ProjectFormProps {
  initialProject?: Project | null; // Pour l'édition
  onProjectSaved: () => void; // Renommé pour plus de clarté
  onCancel: () => void;
}

export default function ProjectForm({
  initialProject,
  onProjectSaved,
  onCancel,
}: ProjectFormProps) {
  const isEditing = !!initialProject;

  const [formData, setFormData] = useState({
    title: initialProject?.title || "",
    description: initialProject?.description || "",
    fullDescription: initialProject?.fullDescription || "",
    type: initialProject?.type || ProjectType.ZONE_SYSTEM,
    status: initialProject?.status || ProjectStatus.PLANNING,
    githubUrl: initialProject?.githubUrl || "",
    demoUrl: initialProject?.demoUrl || "",
    thumbnailUrl: initialProject?.thumbnailUrl || "",
    duration: initialProject?.duration || "",
    teamSize: initialProject?.teamSize?.toString() || "",
    featured: initialProject?.featured || false,
  });

  // Technologies séparées (IDs uniquement)
  const [selectedTechnologyIds, setSelectedTechnologyIds] = useState<string[]>(
    initialProject?.technologies?.map((t) => t.technology.id) || []
  );

  // Détails publics (arrays)
  const [highlights, setHighlights] = useState<string[]>(
    Array.isArray(initialProject?.highlights) ? initialProject.highlights : [""]
  );
  const [challenges, setChallenges] = useState<string[]>(
    Array.isArray(initialProject?.challenges) ? initialProject.challenges : [""]
  );
  const [learnings, setLearnings] = useState<string[]>(
    Array.isArray(initialProject?.learnings) ? initialProject.learnings : [""]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      // Filtrer les arrays pour enlever les entrées vides
      const filteredHighlights = highlights.filter((h) => h.trim() !== "");
      const filteredChallenges = challenges.filter((c) => c.trim() !== "");
      const filteredLearnings = learnings.filter((l) => l.trim() !== "");

      // Parse teamSize correctement
      const teamSizeNum = formData.teamSize
        ? parseInt(formData.teamSize, 10)
        : undefined;
      const validTeamSize =
        teamSizeNum && !isNaN(teamSizeNum) ? teamSizeNum : undefined;

      const projectData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        status: formData.status,
        featured: formData.featured,
        // Envoyer les IDs de technologies sélectionnées
        technologyIds: selectedTechnologyIds,
        // Détails publics optionnels
        ...(formData.fullDescription && {
          fullDescription: formData.fullDescription,
        }),
        ...(filteredHighlights.length > 0 && {
          highlights: filteredHighlights,
        }),
        ...(filteredChallenges.length > 0 && {
          challenges: filteredChallenges,
        }),
        ...(filteredLearnings.length > 0 && { learnings: filteredLearnings }),
        ...(formData.duration && { duration: formData.duration }),
        ...(validTeamSize && { teamSize: validTeamSize }),
        // Ne pas envoyer les URLs vides
        ...(formData.githubUrl && { githubUrl: formData.githubUrl }),
        ...(formData.demoUrl && { demoUrl: formData.demoUrl }),
        ...(formData.thumbnailUrl && { thumbnailUrl: formData.thumbnailUrl }),
      };

      if (isEditing && initialProject) {
        // Mode édition
        const titleChanged = formData.title !== initialProject.title;
        const slug = titleChanged
          ? formData.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, "")
          : undefined;

        await apiClient.updateProject(initialProject.id, {
          ...projectData,
          ...(slug && { slug }),
        });
      } else {
        // Mode création
        const slug = formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        await apiClient.createProject({ ...projectData, slug });

        // Reset form après création
        setFormData({
          title: "",
          description: "",
          fullDescription: "",
          type: ProjectType.ZONE_SYSTEM,
          status: ProjectStatus.PLANNING,
          githubUrl: "",
          demoUrl: "",
          thumbnailUrl: "",
          duration: "",
          teamSize: "",
          featured: false,
        });
        setSelectedTechnologyIds([]);
        setHighlights([""]);
        setChallenges([""]);
        setLearnings([""]);
      }

      // Succès
      onProjectSaved();
    } catch (err) {
      console.error("Erreur lors de la soumission:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditing ? "Modifier le Projet" : "Nouveau Projet"}
        </h2>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">Erreur : {error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Titre */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Titre *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Nom du projet"
            />
          </div>

          {/* Type */}
          <div>
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Type de Projet *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value={ProjectType.ZONE_SYSTEM}>
                🏯 Zone System (From Scratch)
              </option>
              <option value={ProjectType.FLOOR_SYSTEM}>
                🏢 Floor System (MVP IA)
              </option>
            </select>
          </div>

          {/* Statut */}
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Statut *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value={ProjectStatus.PLANNING}>📋 Planning</option>
              <option value={ProjectStatus.ACTIVE}>🚀 Active</option>
              <option value={ProjectStatus.COMPLETED}>✅ Completed</option>
              <option value={ProjectStatus.PAUSED}>⏸️ Paused</option>
            </select>
          </div>
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Technologies
          </label>
          <TechnologySelector
            selectedTechnologyIds={selectedTechnologyIds}
            onChange={setSelectedTechnologyIds}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Sélectionnez des technologies existantes ou créez-en de nouvelles à
            la volée
          </p>
        </div>

        {/* Description courte */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Description courte *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Résumé court du projet..."
          />
        </div>

        {/* Description complète */}
        <div>
          <label
            htmlFor="fullDescription"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Description complète (pour la page publique)
          </label>
          <textarea
            id="fullDescription"
            name="fullDescription"
            value={formData.fullDescription}
            onChange={handleChange}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Description détaillée avec contexte, objectifs, résultats..."
          />
        </div>

        {/* Section Détails publics */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📝 Détails pour le portfolio public
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Ces informations enrichissent la page publique du projet (optionnel)
          </p>

          {/* Highlights */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ✨ Points forts du projet
            </label>
            {highlights.map((highlight, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={highlight}
                  onChange={(e) => {
                    const newHighlights = [...highlights];
                    newHighlights[index] = e.target.value;
                    setHighlights(newHighlights);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Ex: Interface intuitive avec 95% de satisfaction"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (highlights.length > 1) {
                      setHighlights(highlights.filter((_, i) => i !== index));
                    }
                  }}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setHighlights([...highlights, ""])}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              + Ajouter un point fort
            </button>
          </div>

          {/* Challenges */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🧗 Défis techniques rencontrés
            </label>
            {challenges.map((challenge, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={challenge}
                  onChange={(e) => {
                    const newChallenges = [...challenges];
                    newChallenges[index] = e.target.value;
                    setChallenges(newChallenges);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Ex: Optimisation des performances avec grande volumétrie"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (challenges.length > 1) {
                      setChallenges(challenges.filter((_, i) => i !== index));
                    }
                  }}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setChallenges([...challenges, ""])}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              + Ajouter un défi
            </button>
          </div>

          {/* Learnings */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              📚 Apprentissages clés
            </label>
            {learnings.map((learning, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={learning}
                  onChange={(e) => {
                    const newLearnings = [...learnings];
                    newLearnings[index] = e.target.value;
                    setLearnings(newLearnings);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Ex: Maîtrise de React Server Components"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (learnings.length > 1) {
                      setLearnings(learnings.filter((_, i) => i !== index));
                    }
                  }}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setLearnings([...learnings, ""])}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              + Ajouter un apprentissage
            </button>
          </div>

          {/* Duration & Team Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="duration"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                ⏱️ Durée du projet
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Ex: 3 mois, 6 semaines..."
              />
            </div>
            <div>
              <label
                htmlFor="teamSize"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                👥 Taille de l&apos;équipe
              </label>
              <input
                type="number"
                id="teamSize"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Ex: 1, 3, 5..."
              />
            </div>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, featured: e.target.checked }))
              }
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="featured"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              ⭐ Mettre en avant sur la page d&apos;accueil
            </label>
          </div>
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* GitHub URL */}
          <div>
            <label
              htmlFor="githubUrl"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              URL GitHub
            </label>
            <input
              type="url"
              id="githubUrl"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="https://github.com/user/repo"
            />
          </div>

          {/* Demo URL */}
          <div>
            <label
              htmlFor="demoUrl"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              URL Démo
            </label>
            <input
              type="url"
              id="demoUrl"
              name="demoUrl"
              value={formData.demoUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="https://demo.example.com"
            />
          </div>

          {/* Thumbnail URL */}
          <div>
            <label
              htmlFor="thumbnailUrl"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              URL Thumbnail
            </label>
            <input
              type="url"
              id="thumbnailUrl"
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
          {/* Preview button (only in edit mode) */}
          <div>
            {isEditing && initialProject && (
              <a
                href={`/projects/${initialProject.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-purple-600 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
              >
                👁️ Preview
              </a>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {isEditing ? "Modifier" : "Créer"} le projet
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
