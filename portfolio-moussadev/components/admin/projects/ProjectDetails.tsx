"use client";

import { useState } from "react";
import { Project, Zone, Floor, ProjectType } from "@/types/api";
import { useMutation } from "@/lib/hooks";
import { apiClient } from "@/lib/api";
import QuestForm from "./QuestForm";
import QuestList from "./QuestList";

interface ProjectDetailsProps {
  project: Project;
  onProjectUpdated: () => void;
  onBack: () => void;
}

export default function ProjectDetails({
  project,
  onProjectUpdated,
  onBack,
}: ProjectDetailsProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "zones" | "floors" | "quests"
  >("overview");
  const [showZoneForm, setShowZoneForm] = useState(false);
  const [showFloorForm, setShowFloorForm] = useState(false);
  const [showQuestForm, setShowQuestForm] = useState<{
    type: "zone" | "floor";
    id: string;
  } | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);

  const { mutate: createZone, loading: creatingZone } = useMutation(
    (data: {
      name: string;
      description?: string;
      order: number;
      projectId: string;
    }) => apiClient.createZone(data.projectId, data)
  );

  const { mutate: createFloor, loading: creatingFloor } = useMutation(
    (data: {
      name: string;
      description?: string;
      order: number;
      projectId: string;
    }) => apiClient.createFloor(data.projectId, data)
  );

  const { mutate: deleteZone } = useMutation(
    (data: { projectId: string; zoneId: string }) =>
      apiClient.deleteZone(data.projectId, data.zoneId)
  );
  const { mutate: deleteFloor } = useMutation(
    (data: { projectId: string; floorId: string }) =>
      apiClient.deleteFloor(data.projectId, data.floorId)
  );

  const handleCreateZone = async (name: string, description?: string) => {
    const result = await createZone({
      name,
      description,
      order: (project.zones?.length || 0) + 1,
      projectId: project.id,
    });
    if (result) {
      setShowZoneForm(false);
      onProjectUpdated();
    }
  };

  const handleCreateFloor = async (name: string, description?: string) => {
    const result = await createFloor({
      name,
      description,
      order: (project.floors?.length || 0) + 1,
      projectId: project.id,
    });
    if (result) {
      setShowFloorForm(false);
      onProjectUpdated();
    }
  };

  const handleDeleteZone = async (zone: Zone) => {
    if (window.confirm(`Supprimer la zone "${zone.name}" ?`)) {
      const result = await deleteZone({
        projectId: project.id,
        zoneId: zone.id,
      });
      if (result) {
        onProjectUpdated();
      }
    }
  };

  const handleDeleteFloor = async (floor: Floor) => {
    if (window.confirm(`Supprimer l'étage "${floor.name}" ?`)) {
      const result = await deleteFloor({
        projectId: project.id,
        floorId: floor.id,
      });
      if (result) {
        onProjectUpdated();
      }
    }
  };

  const zones = project.zones || [];
  const floors = project.floors || [];
  const allQuests = [
    ...(zones.flatMap((z) => z.quests) || []),
    ...(floors.flatMap((f) => f.floorQuests) || []),
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Retour
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {project.type === ProjectType.ZONE_SYSTEM ? "🏯" : "🏢"}{" "}
              {project.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {project.description}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {["overview", "zones", "floors", "quests"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? "border-blue-500 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              {tab === "overview" && "📊 Vue d'ensemble"}
              {tab === "zones" && `🏯 Zones (${zones.length})`}
              {tab === "floors" && `🏢 Étages (${floors.length})`}
              {tab === "quests" && `⚔️ Quêtes (${allQuests.length})`}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Type
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {project.type === ProjectType.ZONE_SYSTEM
                  ? "🏯 Zone System"
                  : "🏢 Floor System"}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Statut
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {project.status}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Créé
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {new Date(project.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>

          {project.technologies && project.technologies.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech.technology.id}
                    className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full"
                  >
                    {tech.technology.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900"
              >
                📦 GitHub
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                🌐 Démo
              </a>
            )}
          </div>
        </div>
      )}

      {/* Zones Tab */}
      {activeTab === "zones" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              🏯 Zones ({zones.length})
            </h3>
            <button
              onClick={() => setShowZoneForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              ➕ Nouvelle Zone
            </button>
          </div>

          {showZoneForm && (
            <ZoneForm
              onSubmit={handleCreateZone}
              onCancel={() => setShowZoneForm(false)}
              loading={creatingZone}
            />
          )}

          <div className="space-y-3">
            {zones.map((zone) => (
              <div
                key={zone.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="p-4 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {zone.name}
                      </h4>
                      {zone.description && (
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {zone.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Quêtes: {zone.quests?.length || 0}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setSelectedZoneId(
                            selectedZoneId === zone.id ? null : zone.id
                          )
                        }
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        {selectedZoneId === zone.id
                          ? "🔼 Réduire"
                          : "🔽 Gérer Quêtes"}
                      </button>
                      <button
                        onClick={() => handleDeleteZone(zone)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>

                {selectedZoneId === zone.id && (
                  <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-4">
                    {showQuestForm?.type === "zone" &&
                    showQuestForm?.id === zone.id ? (
                      <QuestForm
                        projectId={project.id}
                        zoneId={zone.id}
                        onQuestCreated={() => {
                          setShowQuestForm(null);
                          onProjectUpdated();
                        }}
                        onCancel={() => setShowQuestForm(null)}
                      />
                    ) : (
                      <QuestList
                        quests={zone.quests || []}
                        onQuestUpdated={onProjectUpdated}
                        onCreateQuest={() =>
                          setShowQuestForm({ type: "zone", id: zone.id })
                        }
                        type="zone"
                        projectId={project.id}
                        zoneId={zone.id}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floors Tab */}
      {activeTab === "floors" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              🏢 Étages ({floors.length})
            </h3>
            <button
              onClick={() => setShowFloorForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              ➕ Nouvel Étage
            </button>
          </div>

          {showFloorForm && (
            <FloorForm
              onSubmit={handleCreateFloor}
              onCancel={() => setShowFloorForm(false)}
              loading={creatingFloor}
            />
          )}

          <div className="space-y-3">
            {floors.map((floor) => (
              <div
                key={floor.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div className="p-4 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {floor.name}
                      </h4>
                      {floor.description && (
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          {floor.description}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Quêtes: {floor.floorQuests?.length || 0}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setSelectedFloorId(
                            selectedFloorId === floor.id ? null : floor.id
                          )
                        }
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        {selectedFloorId === floor.id
                          ? "🔼 Réduire"
                          : "🔽 Gérer Quêtes"}
                      </button>
                      <button
                        onClick={() => handleDeleteFloor(floor)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>

                {selectedFloorId === floor.id && (
                  <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 p-4">
                    {showQuestForm?.type === "floor" &&
                    showQuestForm?.id === floor.id ? (
                      <QuestForm
                        projectId={project.id}
                        floorId={floor.id}
                        onQuestCreated={() => {
                          setShowQuestForm(null);
                          onProjectUpdated();
                        }}
                        onCancel={() => setShowQuestForm(null)}
                      />
                    ) : (
                      <QuestList
                        quests={floor.floorQuests || []}
                        onQuestUpdated={onProjectUpdated}
                        onCreateQuest={() =>
                          setShowQuestForm({ type: "floor", id: floor.id })
                        }
                        type="floor"
                        projectId={project.id}
                        floorId={floor.id}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quests Tab */}
      {activeTab === "quests" && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            ⚔️ Toutes les Quêtes ({allQuests.length})
          </h3>

          <div className="space-y-3">
            {allQuests.map((quest) => (
              <div
                key={quest.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {quest.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {quest.userStory}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      quest.status === "DONE"
                        ? "bg-green-100 text-green-800"
                        : quest.status === "IN_PROGRESS"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {quest.status}
                  </span>
                  <span className="text-gray-500">
                    Priorité: {quest.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Composant formulaire pour les zones
function ZoneForm({
  onSubmit,
  onCancel,
  loading,
}: {
  onSubmit: (name: string, description?: string) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, description || undefined);
    setName("");
    setDescription("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
    >
      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
        Nouvelle Zone
      </h4>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Nom de la zone"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
        />
        <textarea
          placeholder="Description (optionnelle)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer"}
          </button>
        </div>
      </div>
    </form>
  );
}

// Composant formulaire pour les étages
function FloorForm({
  onSubmit,
  onCancel,
  loading,
}: {
  onSubmit: (name: string, description?: string) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, description || undefined);
    setName("");
    setDescription("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
    >
      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
        Nouvel Étage
      </h4>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Nom de l'étage"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
        />
        <textarea
          placeholder="Description (optionnelle)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer"}
          </button>
        </div>
      </div>
    </form>
  );
}
