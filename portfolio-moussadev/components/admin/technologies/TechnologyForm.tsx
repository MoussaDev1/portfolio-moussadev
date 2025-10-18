"use client";

import { useState, useEffect } from "react";
import {
  Technology,
  CreateTechnologyDto,
  TechCategory,
  TechStatus,
} from "@/types/technology";
import { generateSlug } from "@/lib/utils";
import Image from "next/image";
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
import { Sparkles, Upload, Loader2, AlertCircle } from "lucide-react";

interface TechnologyFormProps {
  technology?: Technology | null;
  onSubmit: (data: CreateTechnologyDto) => void;
  onCancel: () => void;
}

const CATEGORY_OPTIONS = [
  { value: TechCategory.LANGUAGES, label: "Langages" },
  { value: TechCategory.FRAMEWORKS, label: "Frameworks" },
  { value: TechCategory.LIBRARIES, label: "Librairies" },
  { value: TechCategory.TOOLS, label: "Outils" },
  { value: TechCategory.PLATFORMS, label: "Plateformes" },
  { value: TechCategory.DATABASES, label: "Bases de données" },
  { value: TechCategory.DEVOPS, label: "DevOps" },
];

const STATUS_OPTIONS = [
  { value: TechStatus.MASTERED, label: "Maîtrisée" },
  { value: TechStatus.LEARNING, label: "En apprentissage" },
  { value: TechStatus.TO_REVIEW, label: "À revoir" },
  { value: TechStatus.EXPLORING, label: "Exploration" },
  { value: TechStatus.DEPRECATED, label: "Obsolète" },
];

export default function TechnologyForm({
  technology,
  onSubmit,
  onCancel,
}: TechnologyFormProps) {
  const [formData, setFormData] = useState<CreateTechnologyDto>({
    name: "",
    slug: "",
    category: TechCategory.LANGUAGES,
    status: TechStatus.LEARNING,
    description: "",
    iconUrl: "",
    websiteUrl: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateTechnologyDto, string>>
  >({});
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);

  useEffect(() => {
    if (technology) {
      setFormData({
        name: technology.name,
        slug: technology.slug,
        category: technology.category,
        status: technology.status,
        description: technology.description || "",
        iconUrl: technology.iconUrl || "",
        websiteUrl: technology.websiteUrl || "",
      });
      setSlugManuallyEdited(true);
      if (technology.iconUrl) {
        setIconPreview(technology.iconUrl);
      }
    }
  }, [technology]);

  const uploadIconToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
      }/upload/tech-icon`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Échec de l'upload de l'icône");
    }

    const data = await response.json();
    return data.url;
  };

  const handleIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith("image/")) {
      alert("Veuillez sélectionner une image valide");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("L'image ne doit pas dépasser 5MB");
      return;
    }

    try {
      setIsUploadingIcon(true);

      // Preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload vers Cloudinary
      const iconUrl = await uploadIconToCloudinary(file);
      setFormData((prev) => ({ ...prev, iconUrl }));
    } catch (error) {
      console.error("Erreur upload icône:", error);
      alert("Erreur lors de l'upload de l'icône");
      setIconPreview(null);
    } finally {
      setIsUploadingIcon(false);
    }
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: slugManuallyEdited ? prev.slug : generateSlug(name),
    }));
    if (errors.name) {
      setErrors((prev) => ({ ...prev, name: undefined }));
    }
  };

  const handleSlugChange = (slug: string) => {
    setFormData((prev) => ({ ...prev, slug }));
    setSlugManuallyEdited(true);
    if (errors.slug) {
      setErrors((prev) => ({ ...prev, slug: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateTechnologyDto, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }
    if (!formData.slug.trim()) {
      newErrors.slug = "Le slug est requis";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets";
    }
    if (formData.websiteUrl && !formData.websiteUrl.startsWith("http")) {
      newErrors.websiteUrl = "L'URL doit commencer par http:// ou https://";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Nettoyer les champs optionnels vides
      const cleanedData = {
        ...formData,
        description: formData.description?.trim() || undefined,
        iconUrl: formData.iconUrl?.trim() || undefined,
        websiteUrl: formData.websiteUrl?.trim() || undefined,
      };
      onSubmit(cleanedData);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <DialogTitle>
              {technology ? "Modifier la technologie" : "Nouvelle technologie"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {technology
              ? "Modifiez les informations de cette technologie"
              : "Ajoutez une nouvelle technologie à votre Tech Radar"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nom de la technologie <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ex: TypeScript, React, PostgreSQL..."
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">
              Slug <span className="text-destructive">*</span>
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="Ex: typescript, react, postgresql"
              className={errors.slug ? "border-destructive" : ""}
            />
            {errors.slug && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.slug}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Généré automatiquement à partir du nom. Uniquement lettres
              minuscules, chiffres et tirets.
            </p>
          </div>

          {/* Catégorie & Statut */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">
                Catégorie <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: value as TechCategory,
                  }))
                }
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Statut <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: value as TechStatus,
                  }))
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionnez un statut" />
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
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Décrivez cette technologie, votre expérience avec elle..."
              rows={4}
            />
          </div>

          {/* Icône/Logo */}
          <div className="space-y-2">
            <Label>Icône/Logo de la technologie</Label>

            {/* Preview de l'icône */}
            {iconPreview &&
              (iconPreview.startsWith("http://") ||
                iconPreview.startsWith("https://") ||
                iconPreview.startsWith("/") ||
                iconPreview.startsWith("data:")) && (
                <div className="relative w-32 h-32 border-2 border-border rounded-lg overflow-hidden bg-muted/20">
                  <Image
                    src={iconPreview}
                    alt="Aperçu icône"
                    fill
                    className="object-contain"
                    onError={() => setIconPreview(null)}
                  />
                </div>
              )}

            {/* Upload de l'icône */}
            <div className="space-y-2">
              <label className="cursor-pointer">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploadingIcon}
                  className="w-full"
                  asChild
                >
                  <span>
                    {isUploadingIcon ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Upload en cours...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Choisir une icône
                      </>
                    )}
                  </span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIconChange}
                  className="hidden"
                  disabled={isUploadingIcon}
                />
              </label>
              <p className="text-sm text-muted-foreground">
                Format recommandé : PNG ou SVG transparent, max 5MB
              </p>
            </div>

            {/* OU saisie manuelle d'URL */}
            <div className="space-y-2">
              <Label htmlFor="iconUrl" className="text-muted-foreground">
                Ou saisissez une URL d&apos;icône
              </Label>
              <Input
                id="iconUrl"
                type="url"
                value={formData.iconUrl}
                onChange={(e) => {
                  const url = e.target.value;
                  setFormData((prev) => ({ ...prev, iconUrl: url }));
                  // Valider l'URL avant de mettre à jour le preview
                  if (
                    url &&
                    (url.startsWith("http://") ||
                      url.startsWith("https://") ||
                      url.startsWith("/"))
                  ) {
                    setIconPreview(url);
                  } else if (!url) {
                    setIconPreview(null);
                  }
                }}
                placeholder="https://example.com/icon.svg"
              />
            </div>
          </div>

          {/* URL site web */}
          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Site web officiel</Label>
            <Input
              id="websiteUrl"
              type="url"
              value={formData.websiteUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, websiteUrl: e.target.value }))
              }
              placeholder="https://www.example.com"
              className={errors.websiteUrl ? "border-destructive" : ""}
            />
            {errors.websiteUrl && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.websiteUrl}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" className="bg-primary">
              {technology ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
