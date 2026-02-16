import { db } from '../firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';
import { uploadFile } from './storageService';

/**
 * Registration Service
 * Handles event registration operations
 */

// Generate registration ID
const generateRegistrationId = () => {
  return `REG-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
};

/**
 * Create a new event registration
 */
export const createRegistration = async (registrationData, user) => {
  try {
    if (!user) {
      throw new Error('User must be authenticated to register');
    }

    // Check if user already registered for this event
    const existingReg = await getUserEventRegistration(user.uid, registrationData.eventId);
    if (existingReg) {
      throw new Error('You are already registered for this event');
    }

    const registrationId = generateRegistrationId();

    const registration = {
      registrationId,
      eventId: registrationData.eventId,
      eventName: registrationData.eventName || '',
      userId: user.uid,
      userEmail: user.email,
      userName: registrationData.userName || user.displayName || '',
      teamId: registrationData.teamId || '',
      verified: false,
      paymentReceiptUrl: registrationData.paymentReceiptUrl || '',
      discount: Number(registrationData.discount) || 0,
      discountCode: registrationData.discountCode || '',
      accommodationRequired: Boolean(registrationData.accommodationRequired),
      accommodationMembers: Number(registrationData.accommodationMembers) || 0,
      accommodationFees: Number(registrationData.accommodationFees) || 0,
      totalFees: Number(registrationData.totalFees) || 0,
      status: 'pending',
      createdAt: serverTimestamp(),
      verifiedAt: null,
      verifiedBy: ''
    };

    const docRef = await addDoc(collection(db, 'registrations'), registration);

    // Update user's eventIds array
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      eventIds: arrayUnion(registrationData.eventId)
    });

    return { 
      success: true, 
      id: docRef.id, 
      registrationId,
      registration 
    };
  } catch (error) {
    console.error('Error creating registration:', error);
    throw error;
  }
};

/**
 * Upload payment receipt
 */
export const uploadPaymentReceipt = async (file, registrationId) => {
  try {
    const receiptUrl = await uploadFile(file, 'receipts', `receipt_${registrationId}`);
    return receiptUrl;
  } catch (error) {
    console.error('Error uploading payment receipt:', error);
    throw error;
  }
};

/**
 * Get user's registration for a specific event
 */
export const getUserEventRegistration = async (userId, eventId) => {
  try {
    const q = query(
      collection(db, 'registrations'),
      where('userId', '==', userId),
      where('eventId', '==', eventId)
    );

    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        verifiedAt: doc.data().verifiedAt?.toDate?.() || doc.data().verifiedAt,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting user event registration:', error);
    throw error;
  }
};

/**
 * Get all registrations for a user
 */
export const getUserRegistrations = async (userId) => {
  try {
    const q = query(
      collection(db, 'registrations'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const registrations = [];

    querySnapshot.forEach((doc) => {
      registrations.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        verifiedAt: doc.data().verifiedAt?.toDate?.() || doc.data().verifiedAt,
      });
    });

    return registrations;
  } catch (error) {
    console.error('Error getting user registrations:', error);
    throw error;
  }
};

/**
 * Get all registrations for an event (Admin)
 */
export const getEventRegistrations = async (eventId) => {
  try {
    const q = query(
      collection(db, 'registrations'),
      where('eventId', '==', eventId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const registrations = [];

    querySnapshot.forEach((doc) => {
      registrations.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        verifiedAt: doc.data().verifiedAt?.toDate?.() || doc.data().verifiedAt,
      });
    });

    return registrations;
  } catch (error) {
    console.error('Error getting event registrations:', error);
    throw error;
  }
};

/**
 * Get all registrations (Admin)
 */
export const getAllRegistrations = async (filters = {}) => {
  try {
    let q = query(collection(db, 'registrations'), orderBy('createdAt', 'desc'));

    // Apply status filter
    if (filters.status) {
      q = query(
        collection(db, 'registrations'),
        where('status', '==', filters.status),
        orderBy('createdAt', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    const registrations = [];

    querySnapshot.forEach((doc) => {
      registrations.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        verifiedAt: doc.data().verifiedAt?.toDate?.() || doc.data().verifiedAt,
      });
    });

    return registrations;
  } catch (error) {
    console.error('Error getting all registrations:', error);
    throw error;
  }
};

/**
 * Verify registration (Admin only)
 */
export const verifyRegistration = async (docId, adminEmail) => {
  try {
    const regRef = doc(db, 'registrations', docId);
    
    await updateDoc(regRef, {
      verified: true,
      status: 'verified',
      verifiedAt: serverTimestamp(),
      verifiedBy: adminEmail
    });

    return { success: true };
  } catch (error) {
    console.error('Error verifying registration:', error);
    throw error;
  }
};

/**
 * Reject registration (Admin only)
 */
export const rejectRegistration = async (docId, adminEmail, reason = '') => {
  try {
    const regRef = doc(db, 'registrations', docId);
    
    await updateDoc(regRef, {
      verified: false,
      status: 'rejected',
      verifiedAt: serverTimestamp(),
      verifiedBy: adminEmail,
      rejectionReason: reason
    });

    return { success: true };
  } catch (error) {
    console.error('Error rejecting registration:', error);
    throw error;
  }
};

/**
 * Calculate total fees
 */
export const calculateTotalFees = (regFees, accommodationMembers, discount = 0) => {
  const ACCOMMODATION_RATE = 1500; // ₹1500 per member
  
  const eventFees = Number(regFees) || 0;
  const accommodationFees = (Number(accommodationMembers) || 0) * ACCOMMODATION_RATE;
  const discountAmount = Number(discount) || 0;
  
  const total = eventFees + accommodationFees - discountAmount;
  
  return {
    eventFees,
    accommodationFees,
    discount: discountAmount,
    total: Math.max(0, total) // Ensure non-negative
  };
};

/**
 * Get registration statistics (Admin)
 */
export const getRegistrationStats = async () => {
  try {
    const q = query(collection(db, 'registrations'));
    const querySnapshot = await getDocs(q);
    
    const stats = {
      total: 0,
      pending: 0,
      verified: 0,
      rejected: 0,
      totalRevenue: 0
    };

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      stats.total++;
      
      if (data.status === 'pending') stats.pending++;
      else if (data.status === 'verified') {
        stats.verified++;
        stats.totalRevenue += data.totalFees || 0;
      }
      else if (data.status === 'rejected') stats.rejected++;
    });

    return stats;
  } catch (error) {
    console.error('Error getting registration stats:', error);
    throw error;
  }
};
