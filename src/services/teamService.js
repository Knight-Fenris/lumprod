import { db } from '../firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';

/**
 * Team Service
 * Handles team management for team events
 */

// Generate team ID
const generateTeamId = () => {
  return `TEAM-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
};

// Generate invite code (6 characters)
const generateInviteCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

/**
 * Create a new team
 */
export const createTeam = async (teamData, user) => {
  try {
    if (!user) {
      throw new Error('User must be authenticated to create team');
    }

    const teamId = generateTeamId();
    const inviteCode = generateInviteCode();

    const team = {
      teamId,
      eventId: teamData.eventId,
      eventName: teamData.eventName || '',
      teamName: teamData.teamName,
      leaderId: user.uid,
      leaderEmail: user.email,
      leaderName: user.displayName || teamData.leaderName || '',
      members: [{
        userId: user.uid,
        email: user.email,
        name: user.displayName || teamData.leaderName || '',
        role: 'leader',
        joinedAt: new Date()
      }],
      maxMembers: Number(teamData.maxMembers) || 5,
      currentMembers: 1,
      inviteCode,
      status: 'open', // open, full, locked
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'teams'), team);

    // Update user's teamIds array
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      teamIds: arrayUnion(teamId)
    });

    return { 
      success: true, 
      id: docRef.id, 
      teamId,
      inviteCode,
      team 
    };
  } catch (error) {
    console.error('Error creating team:', error);
    throw error;
  }
};

/**
 * Join a team using invite code
 */
export const joinTeam = async (inviteCode, user) => {
  try {
    if (!user) {
      throw new Error('User must be authenticated to join team');
    }

    // Find team by invite code
    const q = query(
      collection(db, 'teams'),
      where('inviteCode', '==', inviteCode.toUpperCase())
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('Invalid invite code');
    }

    const teamDoc = querySnapshot.docs[0];
    const team = teamDoc.data();

    // Check if team is full
    if (team.currentMembers >= team.maxMembers) {
      throw new Error('Team is full');
    }

    // Check if team is locked
    if (team.status === 'locked') {
      throw new Error('Team is locked');
    }

    // Check if user is already in team
    const isMember = team.members.some(m => m.userId === user.uid);
    if (isMember) {
      throw new Error('You are already a member of this team');
    }

    // Add member to team
    const newMember = {
      userId: user.uid,
      email: user.email,
      name: user.displayName || '',
      role: 'member',
      joinedAt: new Date()
    };

    const teamRef = doc(db, 'teams', teamDoc.id);
    await updateDoc(teamRef, {
      members: arrayUnion(newMember),
      currentMembers: team.currentMembers + 1,
      status: (team.currentMembers + 1) >= team.maxMembers ? 'full' : 'open'
    });

    // Update user's teamIds array
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      teamIds: arrayUnion(team.teamId)
    });

    return { success: true, team: { id: teamDoc.id, ...team } };
  } catch (error) {
    console.error('Error joining team:', error);
    throw error;
  }
};

/**
 * Leave a team
 */
export const leaveTeam = async (teamDocId, userId) => {
  try {
    const teamRef = doc(db, 'teams', teamDocId);
    const teamDoc = await getDoc(teamRef);

    if (!teamDoc.exists()) {
      throw new Error('Team not found');
    }

    const team = teamDoc.data();

    // Leader cannot leave (must delete team instead)
    if (team.leaderId === userId) {
      throw new Error('Leader cannot leave team. Delete the team instead.');
    }

    // Find and remove member
    const memberToRemove = team.members.find(m => m.userId === userId);
    if (!memberToRemove) {
      throw new Error('You are not a member of this team');
    }

    await updateDoc(teamRef, {
      members: arrayRemove(memberToRemove),
      currentMembers: team.currentMembers - 1,
      status: 'open' // Reopen team when member leaves
    });

    // Update user's teamIds array
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      teamIds: arrayRemove(team.teamId)
    });

    return { success: true };
  } catch (error) {
    console.error('Error leaving team:', error);
    throw error;
  }
};

/**
 * Delete a team (Leader only)
 */
export const deleteTeam = async (teamDocId, userId) => {
  try {
    const teamRef = doc(db, 'teams', teamDocId);
    const teamDoc = await getDoc(teamRef);

    if (!teamDoc.exists()) {
      throw new Error('Team not found');
    }

    const team = teamDoc.data();

    // Only leader can delete
    if (team.leaderId !== userId) {
      throw new Error('Only team leader can delete the team');
    }

    // Remove teamId from all members
    for (const member of team.members) {
      const userRef = doc(db, 'users', member.userId);
      await updateDoc(userRef, {
        teamIds: arrayRemove(team.teamId)
      });
    }

    // Delete team
    await deleteDoc(teamRef);

    return { success: true };
  } catch (error) {
    console.error('Error deleting team:', error);
    throw error;
  }
};

/**
 * Get team by ID
 */
export const getTeamById = async (teamId) => {
  try {
    // Try by teamId field first
    const q = query(collection(db, 'teams'), where('teamId', '==', teamId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      };
    }

    // Try by document ID
    const docRef = doc(db, 'teams', teamId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate?.() || docSnap.data().createdAt,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting team:', error);
    throw error;
  }
};

/**
 * Get user's teams
 */
export const getUserTeams = async (userId) => {
  try {
    const q = query(
      collection(db, 'teams'),
      where('members', 'array-contains', { userId }),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const teams = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Check if user is actually in the team (array-contains can be tricky)
      if (data.members.some(m => m.userId === userId)) {
        teams.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
        });
      }
    });

    return teams;
  } catch (error) {
    console.error('Error getting user teams:', error);
    // Fallback: get all teams and filter client-side
    try {
      const allTeamsQuery = query(collection(db, 'teams'));
      const snapshot = await getDocs(allTeamsQuery);
      const teams = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data.members.some(m => m.userId === userId)) {
          teams.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || data.createdAt,
          });
        }
      });

      return teams;
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
      throw fallbackError;
    }
  }
};

/**
 * Get teams for an event
 */
export const getEventTeams = async (eventId) => {
  try {
    const q = query(
      collection(db, 'teams'),
      where('eventId', '==', eventId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const teams = [];

    querySnapshot.forEach((doc) => {
      teams.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      });
    });

    return teams;
  } catch (error) {
    console.error('Error getting event teams:', error);
    throw error;
  }
};

/**
 * Lock/unlock team (Leader only)
 */
export const toggleTeamLock = async (teamDocId, userId) => {
  try {
    const teamRef = doc(db, 'teams', teamDocId);
    const teamDoc = await getDoc(teamRef);

    if (!teamDoc.exists()) {
      throw new Error('Team not found');
    }

    const team = teamDoc.data();

    // Only leader can lock/unlock
    if (team.leaderId !== userId) {
      throw new Error('Only team leader can lock/unlock the team');
    }

    const newStatus = team.status === 'locked' ? 'open' : 'locked';

    await updateDoc(teamRef, {
      status: newStatus
    });

    return { success: true, status: newStatus };
  } catch (error) {
    console.error('Error toggling team lock:', error);
    throw error;
  }
};

/**
 * Remove member from team (Leader only)
 */
export const removeMember = async (teamDocId, leaderId, memberUserId) => {
  try {
    const teamRef = doc(db, 'teams', teamDocId);
    const teamDoc = await getDoc(teamRef);

    if (!teamDoc.exists()) {
      throw new Error('Team not found');
    }

    const team = teamDoc.data();

    // Only leader can remove members
    if (team.leaderId !== leaderId) {
      throw new Error('Only team leader can remove members');
    }

    // Cannot remove leader
    if (memberUserId === leaderId) {
      throw new Error('Cannot remove team leader');
    }

    // Find and remove member
    const memberToRemove = team.members.find(m => m.userId === memberUserId);
    if (!memberToRemove) {
      throw new Error('Member not found in team');
    }

    await updateDoc(teamRef, {
      members: arrayRemove(memberToRemove),
      currentMembers: team.currentMembers - 1,
      status: 'open'
    });

    // Update member's teamIds array
    const userRef = doc(db, 'users', memberUserId);
    await updateDoc(userRef, {
      teamIds: arrayRemove(team.teamId)
    });

    return { success: true };
  } catch (error) {
    console.error('Error removing member:', error);
    throw error;
  }
};

export {
  createTeam,
  joinTeam,
  leaveTeam,
  deleteTeam,
  getTeamById,
  getUserTeams,
  getEventTeams,
  toggleTeamLock,
  removeMember
};
