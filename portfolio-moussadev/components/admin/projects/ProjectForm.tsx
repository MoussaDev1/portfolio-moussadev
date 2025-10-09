"use client";

import { useState } from "react";
import { useMutation } from "@/lib/hooks/useMutation";
import { apiClient } from "@/lib/api";
import {
  Project,
  ProjectType,
  ProjectStatus,
  CreateProjectDto,
  UpdateProjectDto,
} from "@/types/api";

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
    type: initialProject?.type || ProjectType.ZONE_SYSTEM,
    status: initialProject?.status || ProjectStatus.PLANNING,
    technologies:
      initialProject?.technologies?.map((t) => t.technology.name).join(", ") ||
      "",
    githubUrl: initialProject?.githubUrl || "",
    demoUrl: initialProject?.demoUrl || "",
    thumbnailUrl: initialProject?.thumbnailUrl || "",
  });

  const {
    mutate: saveProject,
    loading,
    error,
  } = useMutation(
    (data: CreateProjectDto | { id: string; data: UpdateProjectDto }) => {
      if ("id" in data) {
        // Mode édition
        return apiClient.updateProject(data.id, data.data);
      } else {
        // Mode création
        return apiClient.createProject(data);
      }
    },
    {
      onSuccess: () => {
        // Reset form seulement en mode création
        if (!isEditing) {
          setFormData({
            title: "",
            description: "",
            type: ProjectType.ZONE_SYSTEM,
            status: ProjectStatus.PLANNING,
            technologies: "",
            githubUrl: "",
            demoUrl: "",
            thumbnailUrl: "",
          });
        }
        onProjectSaved();
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const projectData = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      status: formData.status,
      // Convertir les technologies en technologyIds (pour l'instant vide)
      technologyIds: formData.technologies
        ? formData.technologies
            .split(",")
            .map((t: string) => t.trim())
            .filter((t: string) => t.length > 0)
        : [],
      // Ne pas envoyer les URLs vides
      ...(formData.githubUrl && { githubUrl: formData.githubUrl }),
      ...(formData.demoUrl && { demoUrl: formData.demoUrl }),
      ...(formData.thumbnailUrl && { thumbnailUrl: formData.thumbnailUrl }),
    };

    if (isEditing && initialProject) {
      // Mode édition
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      await saveProject({
        id: initialProject.id,
        data: { ...projectData, slug },
      });
    } else {
      // Mode création
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      await saveProject({ ...projectData, slug });
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
          <p className="text-red-600 dark:text-red-400">
            Erreur : {error?.message}
          </p>
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

          {/* Technologies */}
          <div>
            <label
              htmlFor="technologies"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Technologies
            </label>
            <input
              type="text"
              id="technologies"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="React, TypeScript, Node.js..."
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Séparez les technologies par des virgules
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Description du projet..."
          />
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
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
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
      </form>
    </div>
  );
}
