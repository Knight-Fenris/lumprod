/**
 * Image Optimization Utilities
 * Helper functions for image processing and optimization
 */

/**
 * Compress image file
 */
export const compressImage = async (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            resolve(
              new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
            );
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = reject;
      img.src = e.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Generate thumbnail from image file
 */
export const generateThumbnail = async (file, size = 200) => {
  return compressImage(file, size, size, 0.7);
};

/**
 * Convert image to base64
 */
export const imageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Get image dimensions
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height,
        });
      };

      img.onerror = reject;
      img.src = e.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Validate image file
 */
export const validateImage = async (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    minWidth = 0,
    minHeight = 0,
    maxWidth = Infinity,
    maxHeight = Infinity,
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  } = options;

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }

  // Check file size
  if (file.size > maxSize) {
    throw new Error(`File too large. Maximum size: ${maxSize / 1024 / 1024}MB`);
  }

  // Check dimensions
  const dimensions = await getImageDimensions(file);

  if (dimensions.width < minWidth || dimensions.height < minHeight) {
    throw new Error(`Image too small. Minimum: ${minWidth}x${minHeight}px`);
  }

  if (dimensions.width > maxWidth || dimensions.height > maxHeight) {
    throw new Error(`Image too large. Maximum: ${maxWidth}x${maxHeight}px`);
  }

  return { valid: true, dimensions };
};

/**
 * Create responsive srcset
 */
export const createSrcSet = (baseUrl, widths = [320, 640, 960, 1280, 1920]) => {
  return widths.map((width) => `${baseUrl}?w=${width} ${width}w`).join(', ');
};

/**
 * Generate blur placeholder
 */
export const generateBlurPlaceholder = async (file) => {
  return compressImage(file, 20, 20, 0.1);
};

export default {
  compressImage,
  generateThumbnail,
  imageToBase64,
  getImageDimensions,
  validateImage,
  createSrcSet,
  generateBlurPlaceholder,
};
