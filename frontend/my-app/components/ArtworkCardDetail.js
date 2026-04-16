import Link from 'next/link';
import { Button, Card } from 'react-bootstrap';
import useSWR from 'swr';
import Error from 'next/error';
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai'; 
import { favouritesAtom } from '@/store'; 
import { addToFavourites, removeFromFavourites } from '@/lib/userData';

export default function ArtworkCardDetail({ objectID }) {

  const { data, error } = useSWR(objectID ? `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}` : null);

  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [showAdded, setShowAdded] = useState(false);
  
  useEffect(()=>{
    setShowAdded(favouritesList?.includes(objectID))
  }, [favouritesList, objectID])

  async function favouritesClicked() {
    if (showAdded) {
      const updatedFavourites = await removeFromFavourites(objectID);
      setFavouritesList(updatedFavourites);
      setShowAdded(false);
    } else {
      const updatedFavourites = await addToFavourites(objectID);
      setFavouritesList(updatedFavourites);
      setShowAdded(true);
    }
  }
  
  if(error){
    return <Error statusCode={404} /> 
  }

  if (data) {
    return (<>
      <Card>
        {data.primaryImage && <Card.Img variant="top" src={data.primaryImage} />}
        <Card.Body>
          <Card.Title>{data.title || "N/A"}</Card.Title>
          <Card.Text>
            <strong>Date: </strong>{data.objectDate || "N/A"}<br />
            <strong>Classification: </strong>{data.classification || "N/A"}<br />
            <strong>Medium: </strong>{data.medium || "N/A"}
            <br /><br />
            
            <strong>Artist: </strong> {data.artistDisplayName || "N/A"} {data.artistWikidata_URL && <>( <a href={data.artistWikidata_URL} target="_blank" rel="noreferrer" >wiki</a> )</>}<br />
            <strong>Credit Line: </strong> {data.creditLine || "N/A"}<br />
            <strong>Dimensions: </strong> {data.dimensions || "N/A"}

          </Card.Text>
        
          <Button 
            variant={showAdded ? "primary" : "outline-primary"} 
            onClick={favouritesClicked}>
            {showAdded ? "+ Favourite (added)" : "+ Favourite"}
          </Button>
        </Card.Body>
      </Card>
    </>);

  } else {
    return null
  }

}
