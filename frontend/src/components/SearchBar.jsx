// import {
//   useState
// } from "react";


// function SearchBar({
//   onSearch
// }) {

//   const [city, setCity] =
//     useState("");


//   const [listingType, setListingType] =
//     useState("Buy");


//   const [propertyType, setPropertyType] =
//     useState("");


//   const handleSearch = () => {

//     onSearch({

//       city,

//       listingType,

//       propertyType

//     });

//   };


//   return (

//     <div className="search-box">


//       <div className="search-tabs">

//         <button
//           className={
//             listingType === "Buy"
//               ? "active"
//               : ""
//           }

//           onClick={() =>
//             setListingType("Buy")
//           }
//         >

//           Buy

//         </button>


//         <button
//           className={
//             listingType === "Rent"
//               ? "active"
//               : ""
//           }

//           onClick={() =>
//             setListingType("Rent")
//           }
//         >

//           Rent

//         </button>

//       </div>


//       <div className="search-fields">


//         <input

//           type="text"

//           placeholder="Enter City"

//           value={city}

//           onChange={(e) =>
//             setCity(e.target.value)
//           }

//         />


//         <select

//           value={propertyType}

//           onChange={(e) =>
//             setPropertyType(
//               e.target.value
//             )
//           }

//         >

//           <option value="">
//             Property Type
//           </option>

//           <option value="Apartment">
//             Apartment
//           </option>

//           <option value="Villa">
//             Villa
//           </option>

//           <option value="Plot">
//             Plot
//           </option>

//           <option value="Independent House">
//             Independent House
//           </option>

//         </select>


//         <button
//           onClick={handleSearch}
//         >

//           Search

//         </button>


//       </div>

//     </div>

//   );

// }


// export default SearchBar;


import { useState } from "react";

function SearchBar({ onSearch }) {

  const [listingType, setListingType] =
    useState("Buy");

  const [city, setCity] =
    useState("");

  const [propertyType, setPropertyType] =
    useState("");

  const [bedrooms, setBedrooms] =
    useState("");

  const [minPrice, setMinPrice] =
    useState("");

  const [maxPrice, setMaxPrice] =
    useState("");


  const handleSearch = () => {

    onSearch({
      city,
      listingType,
      propertyType,
      bedrooms,
      minPrice,
      maxPrice
    });

  };


  return (

    <div className="search-box">

      {/* <div className="search-tabs">

        <button
          className={
            listingType === "Buy"
              ? "active"
              : ""
          }
          onClick={() =>
            setListingType("Buy")
          }
        >
          Buy
        </button>


        <button
          className={
            listingType === "Rent"
              ? "active"
              : ""
          }
          onClick={() =>
            setListingType("Rent")
          }
        >
          Rent
        </button>


        <button
          className={
            listingType === "PG"
              ? "active"
              : ""
          }
          onClick={() =>
            setListingType("PG")
          }
        >
          PG
        </button>

      </div> */}


      <div className="search-fields">

        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) =>
            setCity(e.target.value)
          }
        />


        <select
          value={propertyType}
          onChange={(e) =>
            setPropertyType(
              e.target.value
            )
          }
        >

          <option value="">
            Property Type
          </option>

          <option value="Apartment">
            Apartment
          </option>

          <option value="Villa">
            Villa
          </option>

          <option value="Plot">
            Plot
          </option>

          <option value="Independent House">
            Independent House
          </option>

          <option value="Builder Floor">
            Builder Floor
          </option>

        </select>


        <select
          value={bedrooms}
          onChange={(e) =>
            setBedrooms(e.target.value)
          }
        >

          <option value="">
            BHK
          </option>

          <option value="1">
            1 BHK
          </option>

          <option value="2">
            2 BHK
          </option>

          <option value="3">
            3 BHK
          </option>

          <option value="4">
            4 BHK
          </option>

        </select>


        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) =>
            setMinPrice(e.target.value)
          }
        />


        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) =>
            setMaxPrice(e.target.value)
          }
        />


        <button
          className="search-btn"
          onClick={handleSearch}
        >
          🔍 Search
        </button>

      </div>

    </div>

  );
}

export default SearchBar;