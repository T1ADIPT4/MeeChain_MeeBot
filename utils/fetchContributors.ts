import { getFirestore, collection, getDocs } from 'firebase/firestore'

export async function fetchContributors() {
  const db = getFirestore()
  const ref = collection(db, 'contributors')
  const snap = await getDocs(ref)

  return snap.docs.map(doc => ({
    wallet: doc.id,
    ...doc.data()
  }))
}
