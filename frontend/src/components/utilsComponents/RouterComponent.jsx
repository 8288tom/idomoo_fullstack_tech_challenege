import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

export default function RouterComponent({ videoUrl, setVideoUrl }) {
    const [searchParams, setSearchParams] = useSearchParams();
  
    
      
    useEffect(() => {
      // Update the URL query param when videoUrl changes
      if (videoUrl) {
        setSearchParams({ video: videoUrl });
      } else {
        setSearchParams({});
      }
    }, [videoUrl, setSearchParams]);

  // Initialize videoUrl from query params on component mount
    useEffect(() => {
        const isValidUrl = (string)=>{
            try {
                new URL(string);
            } catch (_) {
                return false;  
            }
            return true;
            }
        const urlFromQuery = searchParams.get('video');
            if (urlFromQuery) {
            const decodedUrl = decodeURIComponent(urlFromQuery);
            if (isValidUrl(decodedUrl)) {
                setVideoUrl(decodedUrl);
            } 
            else {
                console.error("Invalid URL");
            }
        }
    }, [searchParams, setVideoUrl]);


    
  
    return null; // This component does not render anything
  }
  