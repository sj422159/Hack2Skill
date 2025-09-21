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

    const jobs = await sql`
      SELECT job_title, job_description, required_education, required_skills,
             salary_range, growth_prospects, industry, match_score, created_at
      FROM job_recommendations 
      WHERE user_id = ${userId}
      ORDER BY match_score DESC, created_at DESC
    `;

    return new Response(
      JSON.stringify(jobs),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error fetching job recommendations:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch job recommendations' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}