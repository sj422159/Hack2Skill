import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      name,
      age,
      educationLevel,
      boardUniversity,
      gradePercentage,
      gradeType,
      areaOfInterest,
      budgetMin,
      budgetMax,
      accommodationType,
      preferredLocation,
    } = body;

    // Validate required fields
    if (
      !name ||
      !age ||
      !educationLevel ||
      !gradePercentage ||
      !areaOfInterest?.length
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // First create the user
    const userResult = await sql`
      INSERT INTO users (name, age)
      VALUES (${name}, ${parseInt(age)})
      RETURNING id, name, age, created_at
    `;

    if (userResult.length === 0) {
      throw new Error("Failed to create user");
    }

    const user = userResult[0];

    // Then create the profile
    const profileResult = await sql`
      INSERT INTO user_profiles (
        user_id, 
        education_level, 
        board_university, 
        grade_percentage, 
        grade_type, 
        area_of_interest, 
        budget_min, 
        budget_max, 
        accommodation_type, 
        preferred_location
      )
      VALUES (
        ${user.id},
        ${educationLevel},
        ${boardUniversity || ""},
        ${parseFloat(gradePercentage)},
        ${gradeType},
        ${areaOfInterest},
        ${parseInt(budgetMin) || 0},
        ${parseInt(budgetMax) || 0},
        ${accommodationType || ""},
        ${preferredLocation || ""}
      )
      RETURNING user_id, education_level, area_of_interest
    `;

    const profile = profileResult[0];

    // Return user data
    return new Response(
      JSON.stringify({
        id: user.id,
        name: user.name,
        age: user.age,
        educationLevel: profile.education_level,
        interests: profile.area_of_interest,
        created_at: user.created_at,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create user profile" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
