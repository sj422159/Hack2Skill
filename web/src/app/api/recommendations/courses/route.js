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

    const courses = await sql`
      SELECT course_name, course_description, duration, fee_range, 
             eligibility, career_prospects, match_score, created_at
      FROM course_recommendations 
      WHERE user_id = ${userId}
      ORDER BY match_score DESC, created_at DESC
    `;

    return new Response(
      JSON.stringify(courses),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error fetching course recommendations:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch course recommendations' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}