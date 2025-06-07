import { Client, Databases, ID, Query } from 'appwrite';


const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;  


const client = new Client()
  .setEndpoint('https://syd.cloud.appwrite.io/v1') // Your Appwrite endpoint
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('searchTerm', searchTerm),
    ])

    if (result.documents.length > 0) {
      const documentId = result.documents[0].$id;
      const updatedCount = (result.documents[0].count || 0) + 1;

      await database.updateDocument(DATABASE_ID, COLLECTION_ID, documentId, {
        count: updatedCount,
      });
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: 'https://image.tmdb.org/t/p/w500' + movie.poster_path,
      });
    }
  } catch (error) {
    console.error('Error updating search count:', error);
  }
}

export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc('count'),
    ])

    return result.documents;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
  }
}