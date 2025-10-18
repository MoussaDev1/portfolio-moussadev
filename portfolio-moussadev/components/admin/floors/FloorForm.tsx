"use client";

import { useState, useEffect } from "react";
import { Floor } from "@/types/api";
import { CreateFloorDto, UpdateFloorDto } from "@/types/forms";
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
import { Building2, Loader2, AlertCircle } from "lucide-react";

interface FloorFormProps {
  floor?: Floor;
  projectId: string;
  existingFloors?: Floor[];
  onSubmit: (data: CreateFloorDto | UpdateFloorDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function FloorForm({
  floor,
  projectId,
  existingFloors = [],
  onSubmit,
  onCancel,
  isLoading = false,
}: FloorFormProps) {
  const [formData, setFormData] = useState({
    name: floor?.name || "",
    description: floor?.description || "",
    order: floor?.order || 1,
    projectId: floor?.projectId || projectId,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (floor) {
      setFormData({
        name: floor.name,
        description: floor.description || "",
        order: floor.order,
        projectId: floor.projectId,
      });
    } else {
      // Calculer le prochain ordre automatiquement pour un nouveau floor
      const maxOrder =
        existingFloors.length > 0
          ? Math.max(...existingFloors.map((f) => f.order))
          : 0;
      const nextOrder = maxOrder + 1;

      setFormData((prev) => ({
        ...prev,
        order: nextOrder,
      }));
    }
  }, [floor, existingFloors]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    } else if (formData.name.length < 3) {
      newErrors.name = "Le nom doit contenir au moins 3 caractères";
    }

    if (formData.order < 1) {
      newErrors.order = "L'ordre doit être supérieur à 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // Pour la mise à jour, on ne doit pas envoyer projectId
      const submitData = floor
        ? {
            name: formData.name,
            description: formData.description,
            order: formData.order,
          }
        : formData;

      await onSubmit(submitData);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? parseInt(value) || 1 : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            {floor ? "Éditer le floor" : "Créer un nouveau floor"}
          </DialogTitle>
          <DialogDescription>
            {floor
              ? "Modifiez les informations de ce floor du projet."
              : "Ajoutez un nouveau floor à votre projet Floor System."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nom du floor <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: Interface utilisateur"
              disabled={isLoading}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Description optionnelle du floor..."
              disabled={isLoading}
            />
          </div>

          {/* Order */}
          <div className="space-y-2">
            <Label htmlFor="order">
              Ordre <span className="text-destructive">*</span>
            </Label>
            <Input
              type="number"
              id="order"
              name="order"
              min="1"
              value={formData.order}
              onChange={handleChange}
              disabled={isLoading || !floor}
              readOnly={!floor}
              className={errors.order ? "border-destructive" : ""}
            />
            {errors.order && (
              <p className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.order}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {floor
                ? "Ordre d'affichage du floor dans le projet"
                : `Ordre automatique : ${formData.order} (après le dernier floor)`}
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {floor ? "Mettre à jour" : "Créer le floor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
