import React, { useEffect, useState } from "react";
import friendsService from "../../services/friendsService";
import { useLocation } from "react-router-dom";

import toastr from "toastr";

function Anewfriend() {
   const [formData, setFormData] = useState({
      title: "",
      bio: "",
      summary: "",
      headline: "",
      slug: "",
      statusId: "1",
      imageTypeId: "1",
      imageUrl: "",
      skills: "",
      userId: "",
   });

   const { state } = useLocation();
   // console.log("Anewfriend Location", state);
   /*
        now inside here we access to the data, now you just play with it
    */
   // optional chaining: ?.
   useEffect(() => {
      // console.log("useEffect from friend form", state);
      const image = state.payload.primaryImage.url;
      const skills = state.payload.skills?.map((s) => s.name).join(", ");
      if (state?.type === "FRIEND_VIEW") {
         setFormData((prevState) => {
            return { ...prevState, ...state.payload, imageUrl: image, skills: skills };
         });
      }
   }, []);

   const onFormFieldChange = (event) => {
      // console.log("onChange", { syntheticEvent: event });
      const target = event.target;
      const newUserValue = target.value;
      const nameOfField = target.name;
      //   console.log({ nameOfField, newUserValue });
      setFormData((prevState) => {
         //  console.log("updater is firing onChange");
         const newUserObject = {
            ...prevState,
         };

         newUserObject[nameOfField] = newUserValue;
         return newUserObject;
      });

      //   console.log("end onChange");
   };

   // console.log("a new friend location", location);

   const onClickSubmit = (e) => {
      e.preventDefault();

      const newFriendId = formData.id;
      var payload = { ...formData };
      payload.skills = payload.skills.split(",");

      //use field array to let user input mulitple things

      //split your string and save it in a variable

      if (formData.id >= 0) {
         friendsService
            .editFriend(newFriendId, payload)
            .then(onEditFriendSuccess)
            .catch(onEditFriendError);
      } else {
         friendsService
            .addFriend(payload)
            .then(onAddFriendSuccess)
            .catch(onAddFriendError);
      }
   };

   const onAddFriendSuccess = (response) => {
      console.log("Add Friend Successful ->", response.data.item);
      toastr.success("Friend Added Successfully");
      window.history.pushState("", "", `${response.data.item}`);

      setFormData((prevState) => {
         return { ...prevState, id: response.data.item };
      });
   };

   const onAddFriendError = (response) => {
      console.log("Add Friend Error ->", response);
      toastr.error("Add Friend Failed");
   };

   const onEditFriendSuccess = (response) => {
      console.log("Friend edited sucessfully ->", response);
      toastr.success("You have updated your friend's info");
   };

   const onEditFriendError = (response) => {
      console.log("Friend edit error ->", response);
      toastr.error("Something went wrong with updating your friend");
   };

   // const goToPage = () => {
   //    window.history.replaceState("", "", "123456789");
   // };

   return (
      <React.Fragment>
         <div className="container main">
            <div className="row justify-content-center">
               <h1 id="childNotifications">Add or Edit a Friend</h1>
               <form className="p-2 mb-2 bg-light col-sm-12">
                  {/* <!-- Title form --> */}
                  <div className="form-group row col-md-6">
                     <label className="col-sm-2 col-form-label">Full Name</label>
                     <div className="col-sm-10">
                        <input
                           type="text"
                           className="form-control"
                           id="title"
                           name="title"
                           placeholder="Full Name"
                           value={formData.title}
                           onChange={onFormFieldChange}
                        />
                     </div>
                  </div>
                  <div className="row my-2 align-content-center text-center">
                     <div id="msg" className="col"></div>
                  </div>

                  {/* <!-- BIO form --> */}
                  <div className="form-group row col-md-6">
                     <label className="col-sm-2 col-form-label">Bio</label>
                     <div className="col-sm-10">
                        <input
                           type="text"
                           className="form-control"
                           id="bio"
                           name="bio"
                           value={formData.bio}
                           onChange={onFormFieldChange}
                           placeholder="Bio"
                        />
                     </div>
                  </div>
                  <div className="row my-2 align-content-center text-center">
                     <div id="msg" className="col"></div>
                  </div>

                  {/* <!-- SUMMARY form --> */}
                  <div className="form-group row col-md-6">
                     <label className="col-sm-2 col-form-label">Summary</label>
                     <div className="col-sm-10">
                        <input
                           type="text"
                           className="form-control"
                           id="summary"
                           name="summary"
                           value={formData.summary}
                           onChange={onFormFieldChange}
                           placeholder="Lorem ipsum dolor sit amet"
                        />
                     </div>
                  </div>
                  <div className="row my-2 align-content-center text-center">
                     <div id="msg" className="col"></div>
                  </div>

                  {/* <!-- HEADLINE form --> */}
                  <div className="form-group row col-md-6">
                     <label className="col-sm-2 col-form-label">Headline</label>
                     <div className="col-sm-10">
                        <input
                           type="text"
                           className="form-control"
                           id="headline"
                           name="headline"
                           value={formData.headline}
                           onChange={onFormFieldChange}
                           placeholder="This is a Headline"
                        />
                     </div>
                  </div>
                  <div className="row my-2 align-content-center text-center">
                     <div id="msg" className="col"></div>
                  </div>

                  {/* <!-- SLUG form --> */}
                  <div className="form-group row col-md-6">
                     <label className="col-sm-2 col-form-label">Slug</label>
                     <div className="col-sm-10">
                        <input
                           type="text"
                           className="form-control"
                           id="slug"
                           name="slug"
                           value={formData.slug}
                           onChange={onFormFieldChange}
                           placeholder="This value has to be unique for each friend entered"
                        />
                     </div>
                  </div>
                  <div className="row my-2 align-content-center text-center">
                     <div id="msg" className="col"></div>
                  </div>

                  {/* <!-- STATUS form --> */}
                  <div className="form-group row col-md-6">
                     <label className="col-sm-2 col-form-label">Status Id</label>
                     <div className="col-sm-10">
                        <input
                           type="text"
                           className="form-control"
                           id="statusId"
                           name="statusId"
                           value={formData.statusId}
                           onChange={onFormFieldChange}
                           placeholder="Active"
                        />
                     </div>
                  </div>
                  <div className="row my-2 align-content-center text-center">
                     <div id="msg" className="col"></div>
                  </div>

                  <div className="form-group row col-md-6">
                     <label className="col-sm-2 col-form-label">Image Type Id</label>
                     <div className="col-sm-10">
                        <input
                           type="text"
                           className="form-control"
                           id="imageTypeId"
                           name="imageTypeId"
                           value={formData.imageTypeId}
                           onChange={onFormFieldChange}
                           placeholder="set this to 1"
                        />
                     </div>
                  </div>
                  <div className="row my-2 align-content-center text-center">
                     <div id="msg" className="col"></div>
                  </div>

                  {/* <!-- primaryImage form --> */}
                  <div className="form-group row col-md-6">
                     <label className="col-sm-2 col-form-label">Image URL</label>
                     <div className="col-sm-10">
                        <input
                           type="text"
                           className="form-control"
                           id="imageUrl"
                           name="imageUrl"
                           value={formData.imageUrl}
                           onChange={onFormFieldChange}
                           placeholder="URL of friend image"
                        />
                     </div>
                  </div>
                  <div className="row my-2 align-content-center text-center">
                     <div id="msg" className="col"></div>
                  </div>

                  <div className="form-group row col-md-6">
                     <label className="col-sm-2 col-form-label">Skills</label>
                     <div className="col-sm-10">
                        <input
                           type="text"
                           className="form-control"
                           id="skills"
                           name="skills"
                           value={formData.skills}
                           onChange={onFormFieldChange}
                           placeholder="Friend Skills"
                        />
                     </div>
                  </div>
                  <div className="row my-2 align-content-center text-center">
                     <div id="msg" className="col"></div>
                  </div>

                  <div className="form-group row col-md-6">
                     <label className="col-sm-2 col-form-label">User Id</label>
                     <div className="col-sm-10">
                        <input
                           type="text"
                           className="form-control"
                           id="userId"
                           name="userId"
                           value={formData.userId}
                           onChange={onFormFieldChange}
                           placeholder="Enter a user Id"
                        />
                     </div>
                  </div>
                  <div className="row my-2 align-content-center text-center">
                     <div id="msg" className="col"></div>
                  </div>

                  <button
                     type="button"
                     className="btn btn-primary btn-lg mb-5 item col-sm-5"
                     id="submit"
                     data-id="4"
                     onClick={onClickSubmit}
                     // onClick={goToPage}
                  >
                     Submit
                  </button>
               </form>
               <div className="row friends-list"></div>
            </div>
         </div>
      </React.Fragment>
   );
}

export default Anewfriend;
