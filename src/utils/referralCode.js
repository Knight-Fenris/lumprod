/**
 * Generate a unique referral code for users
 * Format: 6 alphanumeric characters
 */
export const generateReferralCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return code;
};

/**
 * Ensure unique referral code (check against database)
 */
export const generateUniqueReferralCode = async (checkFunction) => {
  let code = generateReferralCode();
  let exists = await checkFunction(code);
  
  // Keep generating until unique
  let attempts = 0;
  const maxAttempts = 10;
  
  while (exists && attempts < maxAttempts) {
    code = generateReferralCode();
    exists = await checkFunction(code);
    attempts++;
  }
  
  if (attempts >= maxAttempts) {
    // Fallback: add timestamp
    code = generateReferralCode() + Date.now().toString().slice(-2);
  }
  
  return code;
};
