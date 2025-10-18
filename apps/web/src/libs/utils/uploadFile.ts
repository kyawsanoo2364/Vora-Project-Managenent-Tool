export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/media/upload`,
    {
      method: "POST",

      body: formData,
    },
  );
  const result = await res.json();
  if (!res.ok) {
    throw new Error(`${result.statusCode}, ${result.message}`);
  }

  return result;
};
