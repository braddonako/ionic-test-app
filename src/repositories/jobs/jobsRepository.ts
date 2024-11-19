import { 
    collection, 
    addDoc, 
    getDocs, 
    updateDoc, 
    doc, 
    deleteDoc, 
    query, 
    orderBy, 
    where, 
    getDoc,
    Firestore 
  } from 'firebase/firestore';
import { Job } from './models/job';
  

  
  export class JobsRepository {
    private readonly collectionName = 'jobs';
  
    constructor(private db: Firestore) {}
  
    async getById(id: string): Promise<Job | null> {
      const docRef = doc(this.db, this.collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Job;
      }
      return null;
    }
  
    async getAllByUserId(userId: string): Promise<Job[]> {
      const jobsQuery = query(
        collection(this.db, this.collectionName),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(jobsQuery);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Job[];
    }
  
    async create(userId: string, jobData: Omit<Job, 'id' | 'userId'>): Promise<Job> {
      const jobDataWithMetadata = {
        ...jobData,
        userId,
        createdAt: new Date().toISOString(),
      };
      
      const docRef = await addDoc(
        collection(this.db, this.collectionName), 
        jobDataWithMetadata
      );
      
      return { 
        id: docRef.id, 
        ...jobDataWithMetadata 
      };
    }
  
    async update(
      jobId: string, 
      updates: Partial<Omit<Job, 'id' | 'userId'>>
    ): Promise<void> {
      const jobRef = doc(this.db, this.collectionName, jobId);
      await updateDoc(jobRef, updates);
    }
  
    async delete(jobId: string): Promise<void> {
      await deleteDoc(doc(this.db, this.collectionName, jobId));
    }
  
    async validateJobOwnership(jobId: string, userId: string): Promise<boolean> {
      const job = await this.getById(jobId);
      return job?.userId === userId;
    }
  }