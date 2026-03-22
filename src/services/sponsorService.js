import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebaseDb';
import { ensureAdminWriteAccess } from './adminService';
import { DEFAULT_SPONSORS_CONTENT, normalizeSponsorsContent } from '../config/sponsors';

const isLocalDev =
  import.meta.env.DEV &&
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const getSponsorsDocRef = () => {
  if (!db) return null;
  return doc(db, 'siteContent', 'sponsorsPage');
};

export const getSponsorsContent = async () => {
  const sponsorsDocRef = getSponsorsDocRef();
  if (!sponsorsDocRef) {
    if (isLocalDev) return normalizeSponsorsContent(DEFAULT_SPONSORS_CONTENT);
    throw new Error('Firestore is unavailable in this environment.');
  }

  const snapshot = await getDoc(sponsorsDocRef);

  if (!snapshot.exists()) {
    return normalizeSponsorsContent(DEFAULT_SPONSORS_CONTENT);
  }

  return normalizeSponsorsContent(snapshot.data());
};

export const saveSponsorsContent = async (content, updatedBy = '') => {
  const sponsorsDocRef = getSponsorsDocRef();
  if (!sponsorsDocRef) {
    throw new Error('Firestore is unavailable in this environment.');
  }

  await ensureAdminWriteAccess();

  const payload = normalizeSponsorsContent(content);

  await setDoc(
    sponsorsDocRef,
    {
      ...payload,
      updatedAt: serverTimestamp(),
      updatedBy: String(updatedBy || '').trim(),
    },
    { merge: true }
  );

  return payload;
};