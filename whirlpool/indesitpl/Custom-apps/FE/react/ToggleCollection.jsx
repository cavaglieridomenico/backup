import React from "react";

export default function ToggleCollection({
  show,
  children,
  collectionID
}) 
{
  if(collectionID) {
    children[0].props.blockProps.collectionID = collectionID 
  }
  
  return (
    <div className="ToggleCollection" style={{display: show? "inherit" : "none"}}>
      {children}
    </div>
  );
}
     

ToggleCollection.schema = {
  title: 'ToggleCollection',
  type: 'object',
  properties: {
    show:{
      type:"boolean",
      description:"Display toggle",
      title:"toggle collection"
    },
    collectionID:{
      type:"string",
      description:"Collection id",
      title:"collectionID",
      default:"146"
    }     
  }
}