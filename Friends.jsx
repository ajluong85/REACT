import React, { useState, useEffect, useCallback } from "react";

import friendsService from "../../services/friendsService";
import Friend from "../friends/Friend";

import { useNavigate } from "react-router-dom";

import toastr from "toastr";

import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import Pagination from "rc-pagination";

import debug from "sabio-debug";

const _logger = debug.extend("Friends");

function Friends() {
   const [pageData, setPageData] = useState({
      arrayOfFriends: [],
      peopleComponents: [],
   });

   const [searchValue, setSearchValue] = useState("");

   const [paginationData, setPaginationData] = useState({
      page: 1,
      pageSize: 4,
      totalCount: 0,
   });

   const [showText, setShowText] = useState(true);

   //useCallback is like React.memo()
   const onDeleteRequested = useCallback((myFriend, eventObj) => {
      console.log(myFriend.id, { myFriend, eventObj });

      // const idToBeDeleted = myFriend.id;

      const handler = getDeleteSuccessHandler(myFriend.id);

      friendsService.deletePerson(myFriend.id).then(handler).catch(onDeleteError);
   }, []);

   const getDeleteSuccessHandler = (idToBeDeleted) => {
      console.log("getDeleteSuccessHandler", idToBeDeleted);
      return () => {
         console.log("onDeleteSuccess", idToBeDeleted);
         setPageData((prevState) => {
            const pd = { ...prevState };
            pd.arrayOfFriends = [...pd.arrayOfFriends];

            const idxOf = pd.arrayOfFriends.findIndex((person) => {
               let result = false;

               if (person.id === idToBeDeleted) {
                  result = true;
               }
               return result;
            });

            if (idxOf >= 0) {
               pd.arrayOfFriends.splice(idxOf, 1);
               pd.peopleComponents = pd.arrayOfFriends.map(mapFriend);
            }

            return pd;
         });
      };
   };

   // const onDeleteSuccess = (idToBeDeleted) => {
   //    console.log("onDeleteSuccess", idToBeDeleted);
   //    setPageData((prevState) => {
   //       const pd = { ...prevState };
   //       pd.arrayOfFriends = [...pd.arrayOfFriends];

   //       const idxOf = pd.arrayOfFriends.findIndex((person) => {
   //          let result = false;

   //          if (person.id === idToBeDeleted) {
   //             result = true;
   //          }
   //          return result;
   //       });

   //       if (idxOf >= 0) {
   //          pd.arrayOfFriends.splice(idxOf, 1);
   //          pd.peopleComponents = pd.arrayOfFriends.map(mapFriend);
   //       }

   //       return pd;
   //    });
   // };

   const onDeleteError = (error) => {
      console.log(error);
   };

   //#MAPPER FUNCTION
   const mapFriend = (aFriend) => {
      // console.log("mapping ->", aFriend);
      return (
         <Friend
            primaryImageUrl={aFriend.primaryImageUrl}
            name={aFriend.name}
            title={aFriend.title}
            friend={aFriend}
            key={"LIST-A" + aFriend.id}
            onFriendClicked={onDeleteRequested}
         />

         //#region - this was copied over to Friend.jsx
         //   <div className="col-md-3">
         //    <div className="card">
         //       <img
         //          className="card-img-top"
         //          src={aFriend.primaryImage.imageUrl}
         //          alt="placeholder"
         //       />
         //       <div className="card-body">
         //          <h5 className="card-title">{aFriend.title}</h5>
         //          <p className="card-text">
         //             Some quick example text to build on the card title and make up the
         //             bulk of the card's content.
         //          </p>
         //          <button
         //             className="link-btn btn btn-primary"
         //             // onClickDelete={onFriendClicked}
         //          >
         //             Delete
         //          </button>
         //       </div>
         //    </div>
         // </div>
         //#endregion
      );
   };

   // const mapFriendsForPagination = () => {
   //    return <Pagination onChange={onChange} current={current} total={25} />;
   // };

   useEffect(() => {
      // console.log("firing useEfect for get people");
      friendsService
         .getFriends(paginationData.page - 1, paginationData.pageSize)
         .then(onGetFriendsSuccess)
         .catch(onGetFriendsError);
   }, [paginationData.page]);

   const onClickShowAll = (e) => {
      e.preventDefault();
      setShowText(!showText);
   };

   const onGetFriendsSuccess = (data) => {
      let arrayOfPeeps = data.item.pagedItems;
      // console.log({ data });

      setPageData((prevState) => {
         const pd = { ...prevState };
         pd.arrayOfFriends = arrayOfPeeps;
         pd.peopleComponents = arrayOfPeeps.map(mapFriend);
         return pd;
      });

      setPaginationData((prevState) => {
         _logger("total friends ->", data);
         const pd = { ...prevState };
         pd.totalCount = data.item.totalCount;

         return pd;
      });
   };

   const onGetFriendsError = (error) => {
      console.log(error);
   };

   const navigate = useNavigate();
   const goToPage = (e) => {
      console.log(e.currentTarget);
      navigate("/friends/new");
   };

   const onFormFieldChange = (event) => {
      // console.log("onChange", { syntheticEvent: event });
      const target = event.target;
      setSearchValue(target.value);
   };

   const onClickSearch = (e) => {
      e.preventDefault();

      console.log("search enter is working");

      friendsService
         .searchFriend(searchValue)
         .then(onSearchSuccess)
         .catch(onSearchError);
   };
   const onSearchSuccess = (data) => {
      console.log("data >>", data);
      const friendsArray = data.item.pagedItems;
      console.log(friendsArray);

      setPageData((prevState) => {
         const pd = { ...prevState };
         pd.arrayOfFriends = friendsArray;
         pd.peopleComponents = friendsArray.map(mapFriend);
         return pd;
      });

      setSearchValue("");
      toastr.success("Success! See below for search results");
   };

   const onSearchError = (error) => {
      console.log(error);
      toastr.error("Search Friends Error");
   };

   const onChange = (page) => {
      console.log("onChange function->", page);
      setPaginationData((prevState) => {
         const pd = { ...prevState };
         pd.page = page;
         return pd;
      });
   };

   return (
      <React.Fragment>
         <div className="container text-center bg-secondary">
            <button className="btn btn-info m-3" onClick={onClickShowAll}>
               Show Friends
            </button>

            <button onClick={goToPage} type="button" className="btn btn-primary m-3">
               + Friend
            </button>

            <form className="form-inline my-2 my-lg-0">
               <input
                  className="form-control mr-sm-2 mb-3"
                  type="search"
                  placeholder="Search Friends"
                  value={searchValue}
                  onChange={onFormFieldChange}
               />
               <button
                  className="btn btn-success my-2 my-sm-0 col-md-3"
                  type="submit"
                  onClick={onClickSearch}
               >
                  Search
               </button>

               <Pagination
                  onChange={onChange}
                  current={paginationData.page}
                  total={paginationData.totalCount}
                  pageSize={paginationData.pageSize}
                  className="mt-3 mb-3"
                  locale={locale}
               />
            </form>

            {showText && (
               // <div className="row">{pageData.peopleComponents}</div>
               <div className="row">{pageData.arrayOfFriends.map(mapFriend)}</div>
            )}
         </div>
      </React.Fragment>
   );
}

export default Friends;

//#region
//MAPPING
//<div className="row">{arrayOfPeople}.map(mapPerson)}</div>
//------->MAPPING FUNCTION
// const mapString = (aPerson) => {
// return (
//    put your card in here with the html and with the values you want mapped.
// )
// }
//HOW TO ADD A FRIEND CARD DYNAMICALLY TO THE PAGE?
//1. Make a component - in the component make a template of the friend card you want to return
// in this friend card template put in where you will get the data from (i.e. response.data.item.pagedItems.title or imageUrl)
// put your buttons to delete and edit card in this template

//LAST STEP OF OPTIMIZATION
//1. Take out JSX snippet you were mapping and pull it out into it's own component then you want to setup
//local click handler to call the clickhandler that is on props. now you make sure you call the .props.function
//

//CONDITIONAL RENDERING -
//#endregion
