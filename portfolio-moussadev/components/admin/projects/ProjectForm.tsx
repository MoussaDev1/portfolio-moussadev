"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api";
import { Project, ProjectType, ProjectStatus } from "@/types/api";
import TechnologySelector from "./TechnologySelector";
// Note: this form currently uses native HTML inputs; UI component imports removed to avoid unused imports
// Icons not used directly in this form component (kept minimal)

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
    initialProject?.technologies?.map((t) => t.technology.id) || [],
  );

  // Détails publics (arrays)
  const [highlights, setHighlights] = useState<string[]>(
    Array.isArray(initialProject?.highlights)
      ? initialProject.highlights
      : [""],
  );
  const [challenges, setChallenges] = useState<string[]>(
    Array.isArray(initialProject?.challenges)
      ? initialProject.challenges
      : [""],
  );
  const [learnings, setLearnings] = useState<string[]>(
    Array.isArray(initialProject?.learnings) ? initialProject.learnings : [""],
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // États pour l'upload d'image (thumbnail)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialProject?.thumbnailUrl || null,
  );
  const [uploading, setUploading] = useState(false);

  // États pour la galerie d'images
  const [galleryImages, setGalleryImages] = useState<string[]>(
    initialProject?.galleryImages || [],
  );
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      // 1. Uploader l'image thumbnail si un fichier est sélectionné
      let thumbnailUrl = formData.thumbnailUrl;
      if (selectedFile) {
        const uploadedUrl = await uploadImageToCloudinary();
        if (uploadedUrl) {
          thumbnailUrl = uploadedUrl;
        } else {
          setLoading(false);
          return; // Arrêter si l'upload a échoué
        }
      }

      // 2. Uploader les images de galerie si des fichiers sont sélectionnés
      let finalGalleryImages = [...galleryImages];
      if (selectedGalleryFiles.length > 0) {
        const uploadedGalleryUrls = await uploadGalleryImagesToCloudinary();
        if (uploadedGalleryUrls) {
          finalGalleryImages = [...finalGalleryImages, ...uploadedGalleryUrls];
        }
      }

      // 3. Filtrer les arrays pour enlever les entrées vides
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
        ...(thumbnailUrl && { thumbnailUrl: thumbnailUrl }),
        ...(finalGalleryImages.length > 0 && {
          galleryImages: finalGalleryImages,
        }),
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
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Gérer la sélection de fichier
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation du type
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image (JPEG, PNG, WebP)");
      return;
    }

    // Validation de la taille (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("L'image ne doit pas dépasser 5 MB");
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Créer une preview locale
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Upload l'image vers Cloudinary
  const uploadImageToCloudinary = async (): Promise<string | null> => {
    if (!selectedFile) return formData.thumbnailUrl || null;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", selectedFile);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
        }/upload/image`,
        {
          method: "POST",
          body: formDataUpload,
        },
      );

      if (!response.ok) {
        throw new Error("Échec de l'upload");
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error("Erreur upload:", error);
      setError("Échec de l'upload de l'image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Upload multiple images de galerie vers Cloudinary
  const uploadGalleryImagesToCloudinary = async (): Promise<
    string[] | null
  > => {
    if (selectedGalleryFiles.length === 0) return [];

    setUploadingGallery(true);
    try {
      const formDataUpload = new FormData();
      selectedGalleryFiles.forEach((file) => {
        formDataUpload.append("files", file);
      });

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
        }/upload/gallery`,
        {
          method: "POST",
          body: formDataUpload,
        },
      );

      if (!response.ok) {
        throw new Error("Échec de l'upload de la galerie");
      }

      const data = await response.json();
      return data.images.map((img: { url: string }) => img.url);
    } catch (error) {
      console.error("Erreur upload galerie:", error);
      setError("Échec de l'upload des images de la galerie");
      return null;
    } finally {
      setUploadingGallery(false);
    }
  };

  // Supprimer l'image thumbnail sélectionnée
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, thumbnailUrl: "" }));
  };

  // Gérer la sélection de fichiers pour la galerie
  const handleGalleryFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validation
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} n'est pas une image valide`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} dépasse 5MB`);
        return false;
      }
      return true;
    });

    setSelectedGalleryFiles((prev) => [...prev, ...validFiles]);
  };

  // Supprimer une image de la galerie (déjà uploadée)
  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Supprimer un fichier de galerie non encore uploadé
  const handleRemoveGalleryFile = (index: number) => {
    setSelectedGalleryFiles((prev) => prev.filter((_, i) => i !== index));
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

          {/* Image Thumbnail Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image Thumbnail
            </label>

            {/* Preview de l'image */}
            {imagePreview && (
              <div className="mb-4 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-w-md h-48 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                  title="Supprimer l'image"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Input file */}
            <div className="flex items-center gap-4">
              <label
                htmlFor="thumbnailFile"
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {imagePreview ? "Changer l'image" : "Sélectionner une image"}
              </label>
              <input
                type="file"
                id="thumbnailFile"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              {selectedFile && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedFile.name} (
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              )}
            </div>

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Formats acceptés : JPEG, PNG, WebP • Taille max : 5 MB •
              L&apos;image sera automatiquement optimisée
            </p>

            {/* Fallback : URL manuelle si pas d'upload */}
            {!imagePreview && (
              <div className="mt-4">
                <label
                  htmlFor="thumbnailUrl"
                  className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2"
                >
                  Ou entrer une URL d&apos;image (optionnel)
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
            )}
          </div>

          {/* Galerie d'Images */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Galerie d&apos;Images
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Ajoutez plusieurs images pour montrer différents aspects de votre
              projet
            </p>

            {/* Images déjà uploadées */}
            {galleryImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Images actuelles ({galleryImages.length})
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {galleryImages.map((url, index) => (
                    <div key={index} className="relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Gallery ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(index)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Supprimer"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nouvelles images sélectionnées (pas encore uploadées) */}
            {selectedGalleryFiles.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Nouvelles images ({selectedGalleryFiles.length}) - seront
                  uploadées à la sauvegarde
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {selectedGalleryFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-blue-300 dark:border-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryFile(index)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Supprimer"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bouton pour ajouter des images */}
            <div className="flex items-center gap-4">
              <label
                htmlFor="galleryFiles"
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {uploadingGallery ? "Upload en cours..." : "Ajouter des images"}
              </label>
              <input
                type="file"
                id="galleryFiles"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                multiple
                onChange={handleGalleryFilesChange}
                className="hidden"
                disabled={uploadingGallery}
              />
            </div>

            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Formats acceptés : JPEG, PNG, WebP • Taille max par image : 5 MB •
              Sélectionnez plusieurs images à la fois
            </p>
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
              disabled={loading || uploading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {(loading || uploading) && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              {uploading
                ? "Upload en cours..."
                : loading
                  ? "Enregistrement..."
                  : `${isEditing ? "Modifier" : "Créer"} le projet`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
