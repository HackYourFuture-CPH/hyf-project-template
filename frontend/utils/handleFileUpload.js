export const handleFileUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data.fileLocation;
    } else {
      const error = await response.json();
      console.error("Error details :", error);
    }
  } catch (error) {
    console.error("Error uploading video", error);
  }
};
