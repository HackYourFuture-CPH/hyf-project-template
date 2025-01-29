const { ourFileRouter } = require("./core");

export async function GET(request) {
  return new Response(JSON.stringify({ message: "UploadThing API is ready" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Request Body:", body);

    
    return new Response(
      JSON.stringify({ message: "File uploaded successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error handling POST request:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process the request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
