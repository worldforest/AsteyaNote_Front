import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    query,
    where,
    Timestamp,
    orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { UserYogaPose, YogaPose } from '../types/yogaPose';
import { defaultYogaPoses } from '../data/yogaPoses';

const COLLECTION_NAME = 'yogaPoses';

/**
 * 기본 자세 데이터 초기화 (Firestore에 한 번만 실행)
 */
export const initializeDefaultPoses = async () => {
    if (!db) {
        console.warn('Firestore is not configured');
        return;
    }

    try {
        const q = query(collection(db, COLLECTION_NAME), where('isCustom', '==', false));
        const querySnapshot = await getDocs(q);

        // 이미 기본 자세가 있으면 초기화하지 않음
        if (!querySnapshot.empty) {
            console.log('Default poses already initialized');
            return;
        }

        console.log('Initializing default poses...');
        for (const pose of defaultYogaPoses) {
            await addDoc(collection(db, COLLECTION_NAME), {
                ...pose,
                isCustom: false,
                createdAt: Timestamp.now(),
            });
        }
        console.log('Default poses initialized successfully');
    } catch (error) {
        console.error('Failed to initialize default poses:', error);
    }
};

/**
 * 모든 요가 자세 불러오기 (Firestore)
 */
export const getAllYogaPoses = async (): Promise<UserYogaPose[]> => {
    if (!db) {
        console.warn('Firestore is not configured. Returning default poses locally.');
        // Firestore 설정이 안 되어 있을 때 로컬 기본 데이터 반환 (임시)
        return defaultYogaPoses.map(pose => ({
            ...pose,
            isCustom: false,
            createdAt: new Date().toISOString()
        }));
    }

    try {
        // 생성일 순으로 정렬하려면 orderBy를 추가할 수 있지만 인덱스 설정이 필요할 수 있음
        // 일단은 클라이언트에서 정렬하거나 기본 쿼리 사용
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                nameEn: data.nameEn,
                description: data.description,
                doshaType: data.doshaType,
                benefits: data.benefits,
                isCustom: data.isCustom,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                imageUrl: data.imageUrl
            } as UserYogaPose;
        });
    } catch (error) {
        console.error('Failed to fetch yoga poses:', error);
        return [];
    }
};

/**
 * 새로운 요가 자세 추가 (Firestore)
 */
export const addCustomYogaPose = async (pose: Omit<YogaPose, 'id'>): Promise<UserYogaPose | null> => {
    if (!db) {
        alert('Firebase 설정이 필요합니다.');
        return null;
    }

    try {
        const newPoseData = {
            ...pose,
            isCustom: true,
            createdAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, COLLECTION_NAME), newPoseData);

        return {
            id: docRef.id,
            ...pose,
            isCustom: true,
            createdAt: new Date().toISOString(),
        };
    } catch (error) {
        console.error('Failed to add yoga pose:', error);
        throw error;
    }
};

/**
 * 요가 자세 삭제 (Firestore)
 */
export const deleteCustomYogaPose = async (id: string): Promise<void> => {
    if (!db) return;

    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error('Failed to delete yoga pose:', error);
        throw error;
    }
};
