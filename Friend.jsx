import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function Friend(props) {
   // console.log("friend ->", props.friend);
   const aFriend = props.friend;
   console.log("aFriend ->", aFriend);
   const navigate = useNavigate();

   /*
      1. Navigate helps us change url -- aka url change / component change
      2. also optionally send state

      how does it send state ? thru an object universally avialbe within the app
      made available thru the navigate hook

      essentailly this object will be accessible thru useLocation 
      on the other component, you'll see
   */

   const onDeleteClicked = (evt) => {
      evt.preventDefault();
      props.onFriendClicked(props.friend, evt);
   };

   const handleEditClick = (evt) => {
      evt.preventDefault();
      //navigate("url change goes here", state goes here)

      console.log("b4 navigate aFriend", aFriend);
      const state = { type: "FRIEND_VIEW", payload: aFriend };

      navigate(`${aFriend.id}`, { state });
      //{ state: { stateForTransport } }
   };

   return (
      //key was removed from <div className="col-md-3"> and added to <Friend friend={aFriend} key={"LIST-A" + aFriend.id}/>
      <div className="col-md-3 my-3">
         <div className="card border-warning text-secondary shadow h-100">
            <img
               className="card-img-top h-100"
               src={aFriend.primaryImage.url}
               alt="placeholder"
            />
            <div className="card-body">
               <h5 className="card-title text-dark">{aFriend.title}</h5>
               <p className="card-text">{aFriend.bio}</p>
               <button className="link-btn btn btn-danger" onClick={onDeleteClicked}>
                  Delete
               </button>
               <button
                  className="link-btn btn btn-warning mx-3"
                  onClick={handleEditClick}
               >
                  Edit
               </button>
            </div>
         </div>
      </div>
   );
}

Friend.propTypes = {
   afriend: PropTypes.shape({
      id: PropTypes.number.isRequired,
      primaryImageUrl: PropTypes.string.isRequired,
      title: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
   }),
};

export default React.memo(Friend);
//#REACT.MEMO TECHNIQUE - short for memozation - recognizing that passing a formula passing in same input will result in same
//output. If I feed it same thing I don't expect a different output so I dont need to go through the work of return the same
//thing. REACT smart enough
