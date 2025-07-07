export async function GET() {
  const placeId = process.env.PLACE_ID; // Stored in .env.local
  const apiKey = process.env.GOOGLE_MAPS_API_KEY; // Stored in .env.local
  const url = `https://places.googleapis.com/v1/places/${placeId}?fields=displayName,formattedAddress,reviews,rating,userRatingCount&key=${apiKey}`;

  try {
    const response = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
      },
    });
    const data = await response.json();

    if (response.ok && data.displayName) {
      // Map the new Places API response to match the legacy API structure for compatibility
      const formattedData = {
        name: data.displayName?.text || "",
        formatted_address: data.formattedAddress || "",
        reviews:
          data.reviews?.map((review) => ({
            author_name: review.authorAttribution?.displayName || "",
            rating: review.rating || 0,
            text: review.text?.text || "",
            profile_photo_url: review.authorAttribution?.photoUri || "",
            relative_time_description:
              review.relativePublishTimeDescription || review.publishTime,
          })) || [],
        rating: data.rating || 0,
        user_ratings_total: data.userRatingCount || 0,
      };

      return new Response(JSON.stringify(formattedData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      console.error("Google Places API error:", {
        status: data.status,
        error_message: data.error?.message || "Unknown error",
      });
      return new Response(
        JSON.stringify({
          error: "Failed to fetch reviews",
          details: data.status || "UNKNOWN_ERROR",
          message: data.error?.message || "Unknown error",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Server error fetching reviews:", {
      message: error.message,
      stack: error.stack,
    });
    return new Response(
      JSON.stringify({ error: "Server error", details: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
