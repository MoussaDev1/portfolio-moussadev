"use client";

import { useState, useEffect } from "react";
import { Zone } from "@/types/api";
import { CreateZoneDto, UpdateZoneDto } from "@/types/forms";
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
import { Castle, Loader2, AlertCircle } from "lucide-react";

interface ZoneFormProps {
  zone?: Zone;
  projectId: string;
  existingZones?: Zone[];
  onSubmit: (data: CreateZoneDto | UpdateZoneDto) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ZoneForm({
  zone,
  projectId,
  existingZones = [],
  onSubmit,
  onCancel,
  isLoading = false,
}: ZoneFormProps) {
  const [formData, setFormData] = useState({
    name: zone?.name || "",
    description: zone?.description || "",
    order: zone?.order || 1,
    projectId: zone?.projectId || projectId,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (zone) {
      setFormData({
        name: zone.name,
        description: zone.description || "",
        order: zone.order,
        projectId: zone.projectId,
      });
    } else {
      // Calculer le prochain ordre automatiquement pour une nouvelle zone
      const maxOrder =
        existingZones.length > 0
          ? Math.max(...existingZones.map((z) => z.order))
          : 0;
      const nextOrder = maxOrder + 1;

      setFormData((prev) => ({
        ...prev,
        order: nextOrder,
      }));
    }
  }, [zone, existingZones]);

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
      const submitData = zone
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
            <Castle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            {zone ? "Éditer la zone" : "Créer une nouvelle zone"}
          </DialogTitle>
          <DialogDescription>
            {zone
              ? "Modifiez les informations de cette zone du projet."
              : "Ajoutez une nouvelle zone à votre projet Zone System."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nom de la zone <span className="text-destructive">*</span>
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
              placeholder="Description optionnelle de la zone..."
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
              disabled={isLoading || !zone}
              readOnly={!zone}
              className={errors.order ? "border-destructive" : ""}
            />
            {errors.order && (
              <p className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.order}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {zone
                ? "Ordre d'affichage de la zone dans le projet"
                : `Ordre automatique : ${formData.order} (après la dernière zone)`}
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
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {zone ? "Mettre à jour" : "Créer la zone"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
