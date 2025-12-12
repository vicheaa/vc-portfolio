import React, { useState } from "react";
import { uploadImage } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";

interface ImageUploadProps {
  bucket: string;
  path: string;
  onUploadComplete: (url: string) => void;
  currentImage?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  bucket,
  path,
  onUploadComplete,
  currentImage,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const url = await uploadImage(file, bucket, path);
      onUploadComplete(url);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {currentImage && (
        <div className="relative">
          <img
            src={currentImage}
            alt="Current"
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload">
          <Button
            type="button"
            variant="secondary"
            loading={uploading}
            onClick={() => document.getElementById("image-upload")?.click()}
            className="w-full"
          >
            {uploading
              ? "Uploading..."
              : currentImage
              ? "Change Image"
              : "Upload Image"}
          </Button>
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};
