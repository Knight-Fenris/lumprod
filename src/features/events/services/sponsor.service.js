import { DEFAULT_SPONSORS_CONTENT, normalizeSponsorsContent } from '../config/sponsors';

export const getSponsorsContent = async () => {
  return normalizeSponsorsContent(DEFAULT_SPONSORS_CONTENT);
};
