import fetchData from './fetchData';
import {ImageFromWikipedia} from '../types/ImageFromWikipedia';

export default async (name: string): Promise<string> => {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=${name}&pithumbsize=640&formatversion=2`;
    const imageData = await fetchData<ImageFromWikipedia>(url);
    const thumbnail = imageData.query.pages[0].thumbnail.source;
    return thumbnail;
  } catch (error) {
    return 'https://placekitten.com/640/480';
  }
};
