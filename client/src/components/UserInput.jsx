import React, { useState } from "react";
import { captureAndUploadScreenshot } from "../utils/Snap";

export const UserInput = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [isShow, setisShow] = useState(false);

  const [imageUrl, setImageUrl] = useState("");
  const [imageSize, setImageSize] = useState();
  const [imageTimestamp, setImageTimetamp] = useState("");

  const isValidURL = (url) => {
    // Regular expression pattern for URL validation
    var pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,})([/\w .-]*)*\/?$/;
    return pattern.test(url);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValidLink = isValidURL(searchPrompt);

    if (!isValidLink) return alert("Please provide a valid website URL");

    try {
      setisLoading(true);

      // send request to pikwy api and upload into cloudinary and fetch the image
      const publicId = await captureAndUploadScreenshot(
        searchPrompt,
        "dlfglqrz",
        "websnap"
      );

      //

      const url = `https://res.cloudinary.com/${
        import.meta.env.VITE_CLOUD_NAME
      }/image/upload/w_200,h_200/q_auto/${publicId}.jpg`;

      console.log(publicId);

      const detailsResponse = await fetch(
        "http://localhost:8000/api/get-image-details",
        {
          method: "POST",
          body: JSON.stringify({ publicId }), // Send publicId
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const imageDetails = await detailsResponse.json();

      setImageUrl(url);
      setImageTimetamp(imageDetails.created_at);
      setImageSize(imageDetails.imageSize);
      setisShow(true);
    } catch (error) {
      console.log(error);
    } finally {
      setisLoading(false);
    }
  };

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 m-12">
        <input
          className="searchbar-input"
          type="text"
          value={searchPrompt}
          onChange={(e) => {
            setSearchPrompt(e.target.value);
            setisShow(false);
          }}
          placeholder="Enter URL"
        />
        <button
          type="submit"
          disabled={searchPrompt === ""}
          className="searchbar-btn"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>

      <div
        className="text-center m-12 font-extrabold"
        hidden={isShow === false}
      >
        <h2 hidden={imageUrl === ""}>Thumbnail of {searchPrompt}</h2>
        <img
          className="mx-auto mt-12"
          src={imageUrl}
          alt={`Snap of ${searchPrompt}`}
          hidden={imageUrl === ""}
        />

        <p
          hidden={imageTimestamp === ""}
          className="text-center m-12"
        >{`Size: ${imageSize} bytes, Uploaded: ${imageTimestamp}`}</p>
      </div>
    </React.Fragment>
  );
};
