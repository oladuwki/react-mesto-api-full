import { CurrentUserContext } from "../contexts/CurrentUserContext";
import React from "react";

export default function Card(props) {

  const currentUser = React.useContext(CurrentUserContext);
    const isOwn = props.card.owner._id !== currentUser._id;
    const cardDeleteButtonClassName = (
        `element__trash ${isOwn ? 'element__button_visible' : 'element__trash_active'}`
      ); 
    const isLiked = props.card.likes.some(i => i._id === currentUser._id);
    const cardLikeButtonClassName = `element__group ${isLiked ? 'element__group_active' : ''}`;

    function handleClick(evt) {
      if (evt.target.type !== "button"){
        props.onCardClick(props.card);  
      }  
    }
    function handleLikeClick() {
        props.onCardLike(props.card)
    }
    function handleDeleteClick() {
        props.onCardDelete(props.card)
    }
    return(
      <div className="element" id={props.id}>
        <div className="element__image" style = {{ 
            backgroundImage: `url(${props.card.link})` 
            }} 
            onClick={handleClick}>
          <button type="button" className="element__trash" className={cardDeleteButtonClassName} onClick = {handleDeleteClick}></button>
        </div>
        <div className="element__down">
        <div className="element__title">
          <h2 className="element__name">{props.card.name}</h2>
        </div>
        <div className="element__likes">
          <button type='button' className="element__group" className={cardLikeButtonClassName} onClick = {handleLikeClick}></button>
          <p className="element__group-number">{props.card.likes.length}</p>
        </div>
      </div>
    </div>
            
    )
}