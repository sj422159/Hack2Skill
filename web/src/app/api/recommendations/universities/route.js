import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const universities = await sql`
      SELECT university_name, location, university_type, courses_offered,
             fees, admission_criteria, ranking_info, accommodation_info, 
             match_score, created_at
      FROM university_recommendations 
      WHERE user_id = ${userId}
      ORDER BY match_score DESC, created_at DESC
    `;

    return new Response(
      JSON.stringify(universities),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error fetching university recommendations:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch university recommendations' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}