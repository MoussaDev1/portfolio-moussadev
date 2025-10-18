"use client";

import { useState, useEffect } from "react";
import { Quest, QuestStatus, Priority } from "@/types/api";
import { CreateZoneQuestDto, UpdateZoneQuestDto } from "@/types/forms";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Target, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestFormProps {
  quest?: Quest;
  zoneId: string;
  projectId: string;
  onSubmit: (data: CreateZoneQuestDto | UpdateZoneQuestDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const STATUS_OPTIONS = [
  {
    value: QuestStatus.TODO,
    label: "À faire",
    color: "bg-gray-100 text-gray-800",
  },
  {
    value: QuestStatus.IN_PROGRESS,
    label: "En cours",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: QuestStatus.TESTING,
    label: "En test",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: QuestStatus.DONE,
    label: "Terminé",
    color: "bg-green-100 text-green-800",
  },
  {
    value: QuestStatus.BLOCKED,
    label: "Bloqué",
    color: "bg-red-100 text-red-800",
  },
];

const PRIORITY_OPTIONS = [
  { value: Priority.LOW, label: "Basse", color: "bg-gray-100 text-gray-800" },
  {
    value: Priority.MEDIUM,
    label: "Moyenne",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: Priority.HIGH,
    label: "Haute",
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: Priority.CRITICAL,
    label: "Critique",
    color: "bg-red-100 text-red-800",
  },
];

// Fonctions utilitaires pour convertir entre arrays et strings
const arrayToString = (arr: string[] | undefined): string => {
  return arr ? arr.join("\n") : "";
};

const stringToArray = (str: string): string[] => {
  return str.trim()
    ? str
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
    : [];
};

export function QuestForm({
  quest,
  onSubmit,
  onCancel,
  isLoading = false,
}: QuestFormProps) {
  const [formData, setFormData] = useState({
    title: quest?.title || "",
    userStory: quest?.userStory || "",
    definitionOfDone: arrayToString(quest?.definitionOfDone),
    manualTests: arrayToString(quest?.manualTests),
    techDebt: quest?.technicalDebt || "",
    status: quest?.status || QuestStatus.TODO,
    priority: quest?.priority || Priority.MEDIUM,
    estimatedHours: quest?.estimatedPomodoros || undefined,
    actualHours: quest?.actualPomodoros || undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (quest) {
      setFormData({
        title: quest.title,
        userStory: quest.userStory,
        definitionOfDone: arrayToString(quest.definitionOfDone),
        manualTests: arrayToString(quest.manualTests),
        techDebt: quest.technicalDebt || "",
        status: quest.status,
        priority: quest.priority,
        estimatedHours: quest.estimatedPomodoros || undefined,
        actualHours: quest.actualPomodoros || undefined,
      });
    }
  }, [quest]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Le titre est requis";
    } else if (formData.title.length < 3) {
      newErrors.title = "Le titre doit contenir au moins 3 caractères";
    }

    if (!formData.userStory.trim()) {
      newErrors.userStory = "L'user story est requise";
    }

    if (formData.estimatedHours && formData.estimatedHours < 1) {
      newErrors.estimatedHours = "L'estimation doit être supérieure à 0";
    }

    if (formData.actualHours && formData.actualHours < 0) {
      newErrors.actualHours =
        "Les heures réelles ne peuvent pas être négatives";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const submitData = quest
        ? {
            // Mise à jour : exclure les champs non modifiables
            title: formData.title,
            userStory: formData.userStory,
            definitionOfDone: formData.definitionOfDone
              ? stringToArray(formData.definitionOfDone)
              : undefined,
            manualTests: formData.manualTests
              ? stringToArray(formData.manualTests)
              : undefined,
            techDebt: formData.techDebt || undefined,
            status: formData.status,
            priority: formData.priority,
            estimatedHours: formData.estimatedHours,
            actualHours: formData.actualHours,
          }
        : {
            // Création : inclure tous les champs nécessaires
            title: formData.title,
            userStory: formData.userStory,
            definitionOfDone: stringToArray(formData.definitionOfDone),
            manualTests: stringToArray(formData.manualTests),
            techDebt: formData.techDebt || undefined,
            priority: formData.priority,
            estimatedHours: formData.estimatedHours,
          };

      await onSubmit(submitData);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
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
      [name]:
        name === "estimatedHours" || name === "actualHours"
          ? value
            ? parseInt(value) || 0
            : undefined
          : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <DialogTitle>
              {quest ? "Éditer la quête" : "Créer une nouvelle quête"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {quest
              ? "Modifiez les informations de cette quête"
              : "Ajoutez une nouvelle quête à votre zone"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Titre de la quête <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={errors.title ? "border-destructive" : ""}
                  placeholder="Ex: Implémenter l'authentification utilisateur"
                  disabled={isLoading}
                />
                {errors.title && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* User Story */}
              <div className="space-y-2">
                <Label htmlFor="userStory">
                  User Story <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="userStory"
                  name="userStory"
                  rows={3}
                  value={formData.userStory}
                  onChange={handleChange}
                  className={errors.userStory ? "border-destructive" : ""}
                  placeholder="En tant que [utilisateur], je veux [fonctionnalité] afin de [bénéfice]"
                  disabled={isLoading}
                />
                {errors.userStory && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.userStory}
                  </p>
                )}
              </div>

              {/* Status & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: value as QuestStatus,
                      }))
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priorité</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        priority: value as Priority,
                      }))
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Hours */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="estimatedHours"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Heures estimées
                  </label>
                  <input
                    type="number"
                    id="estimatedHours"
                    name="estimatedHours"
                    min="1"
                    value={formData.estimatedHours || ""}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                      errors.estimatedHours
                        ? "border-red-300 focus:ring-red-500"
                        : "border-gray-300 dark:border-gray-600",
                    )}
                    disabled={isLoading}
                  />
                  {errors.estimatedHours && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.estimatedHours}
                    </p>
                  )}
                </div>

                {quest && (
                  <div>
                    <label
                      htmlFor="actualHours"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Heures réelles
                    </label>
                    <input
                      type="number"
                      id="actualHours"
                      name="actualHours"
                      min="0"
                      value={formData.actualHours || ""}
                      onChange={handleChange}
                      className={cn(
                        "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                        "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                        errors.actualHours
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-600",
                      )}
                      disabled={isLoading}
                    />
                    {errors.actualHours && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.actualHours}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Definition of Done */}
              <div>
                <label
                  htmlFor="definitionOfDone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Definition of Done
                </label>
                <textarea
                  id="definitionOfDone"
                  name="definitionOfDone"
                  rows={4}
                  value={formData.definitionOfDone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Listez les critères d'acceptation (un par ligne)"
                  disabled={isLoading}
                />
                {errors.definitionOfDone && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.definitionOfDone}
                  </p>
                )}
              </div>

              {/* Manual Tests */}
              <div>
                <label
                  htmlFor="manualTests"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Tests manuels
                </label>
                <textarea
                  id="manualTests"
                  name="manualTests"
                  rows={4}
                  value={formData.manualTests}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Listez les tests à effectuer (un par ligne)"
                  disabled={isLoading}
                />
                {errors.manualTests && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.manualTests}
                  </p>
                )}
              </div>

              {/* Tech Debt */}
              <div>
                <label
                  htmlFor="techDebt"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Dette technique
                </label>
                <textarea
                  id="techDebt"
                  name="techDebt"
                  rows={3}
                  value={formData.techDebt}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Notes sur la dette technique à résoudre..."
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {quest ? "Mise à jour..." : "Création..."}
                </>
              ) : quest ? (
                "Mettre à jour"
              ) : (
                "Créer la quête"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
