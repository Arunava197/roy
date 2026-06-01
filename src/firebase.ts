import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); // CRITICAL: The app will break without this line
export const auth = getAuth();

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helper to save a score
export async function saveScore(game: string, playerName: string, score: number) {
  const pathForWrite = 'scores';
  try {
    const docRef = await addDoc(collection(db, pathForWrite), {
      game,
      playerName,
      score,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, pathForWrite);
  }
}

// Helper to fetch high scores
export async function getHighScores(game: string, topN: number = 5) {
  const pathForRead = 'scores';
  try {
    // Determine sort order
    // memory -> fewest moves -> asc
    // snake -> highest score -> desc
    // sudoku -> lowest time -> asc
    const sortDirection = (game === 'memory' || game === 'sudoku') ? 'asc' : 'desc';
    
    // We can't do inequality filter or order by without a composite index often,
    // let's just order by score
    const q = query(
      collection(db, pathForRead),
      where("game", "==", game),
      limit(200) // fetch up to 200 to sort locally to avoid missing composite index
    );
    
    const snapshot = await getDocs(q);
    const scores = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[];
    
    // local sort
    scores.sort((a, b) => {
       if (sortDirection === 'asc') return a.score - b.score;
       return b.score - a.score;
    });

    return scores.slice(0, topN);
  } catch (error) {
    // Note: This query might throw missing index error initially!
    // If it does, we'll see a console URL.
    handleFirestoreError(error, OperationType.LIST, pathForRead);
  }
}
