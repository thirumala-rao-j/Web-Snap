async function uploadImageToCloudinary(imageBlob, preset, folder) {
  const formData = new FormData();
  const uniqueFilename = `${Date.now()}.png`; // Generate unique filename with .png extension

  formData.append("file", imageBlob);
  formData.append("upload_preset", preset);
  formData.append("public_id", `${folder}/${uniqueFilename}`); // Set public_id with folder path

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${
    import.meta.env.VITE_CLOUD_NAME
  }/upload`;

  try {
    const response = await fetch(cloudinaryUrl, {
      method: "POST",
      body: formData,
    });

    const res = await response.json();
    console.log("Screenshot uploaded to Cloudinary:", res.secure_url);

    return res.public_id;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}

export async function captureAndUploadScreenshot(url, preset, folder) {
  try {
    const response = await fetch(
      `https://api.pikwy.com/?token=${
        import.meta.env.VITE_PIKWY_TOKEN
      }&url=${url}&fs=1&json=1`
    );

    const pikwyImageData = await response.blob();

    const public_id = await uploadImageToCloudinary(
      pikwyImageData,
      preset,
      folder
    );
    return public_id;
  } catch (error) {
    console.error("Error capturing or uploading screenshot:", error);
  }
}
