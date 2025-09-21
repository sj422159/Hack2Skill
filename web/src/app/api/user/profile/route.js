import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    // For demo purposes, get the latest user
    // In production, you'd get user ID from authentication/session
    const users = await sql`
      SELECT u.id, u.name, u.age, u.created_at,
             p.education_level, p.board_university, p.grade_percentage, 
             p.grade_type, p.area_of_interest, p.budget_min, p.budget_max,
             p.accommodation_type, p.preferred_location
      FROM users u
      LEFT JOIN user_profiles p ON u.id = p.user_id
      ORDER BY u.created_at DESC
      LIMIT 1
    `;

    if (users.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No user profile found' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = users[0];
    
    return new Response(
      JSON.stringify({
        id: user.id,
        name: user.name,
        age: user.age,
        educationLevel: user.education_level,
        boardUniversity: user.board_university,
        gradePercentage: user.grade_percentage,
        gradeType: user.grade_type,
        interests: user.area_of_interest || [],
        budgetMin: user.budget_min,
        budgetMax: user.budget_max,
        accommodationType: user.accommodation_type,
        preferredLocation: user.preferred_location,
        created_at: user.created_at
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch user profile' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}