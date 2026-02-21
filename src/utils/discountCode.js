/**
 * Generate a discount code
 * Format: 6 letters + 2 numbers (e.g., LUMERE25)
 */
export const generateDiscountCode = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';
  
  // Generate 6 random letters
  for (let i = 0; i < 6; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  // Generate 2 random numbers
  code += Math.floor(Math.random() * 10);
  code += Math.floor(Math.random() * 10);
  
  return code;
};

/**
 * Validate discount code format
 */
export const isValidDiscountCodeFormat = (code) => {
  // Should be 8 characters: 6 letters + 2 numbers
  const pattern = /^[A-Z]{6}\d{2}$/;
  return pattern.test(code.toUpperCase());
};

/**
 * Format discount code (uppercase and trim)
 */
export const formatDiscountCode = (code) => {
  return code.toUpperCase().trim();
};
