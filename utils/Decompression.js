import pako from "pako";
export const decompressData = (base64Data) => {
  console.log("data to be dcompressed:: ", base64Data);
  let decompressedData;
  let compressedDataArray = atob(base64Data).split(",");

  try {
    decompressedData = JSON.parse(
      pako.inflate(
        // new Uint8Array(compressedDataArray.map(compressedDataArray)),
        new Uint8Array(compressedDataArray),
        {
          raw: true,
          to: "string",
        }
      )
    );

    console.log("Decompressed data: ", decompressedData);
    return decompressedData;
  } catch (e) {
    //   throw new Error(e);
    return { success: false, error: e.message };
  }

  return decompressedData;
};
