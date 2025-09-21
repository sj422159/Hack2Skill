import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get user profile data
    const userProfile = await sql`
      SELECT u.name, u.age, 
             p.education_level, p.board_university, p.grade_percentage, 
             p.grade_type, p.area_of_interest, p.budget_min, p.budget_max,
             p.accommodation_type, p.preferred_location
      FROM users u
      JOIN user_profiles p ON u.id = p.user_id
      WHERE u.id = ${userId}
    `;

    if (userProfile.length === 0) {
      return new Response(JSON.stringify({ error: "User profile not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const profile = userProfile[0];
    const interests = profile.area_of_interest || [];
    const budgetMin = parseInt(profile.budget_min) || 0;
    const budgetMax = parseInt(profile.budget_max) || 10000000;
    const location = profile.preferred_location || "";
    const educationLevel = profile.education_level || "";

    // Generate intelligent recommendations based on user interests
    const { courses, universities, jobs } = generatePersonalizedRecommendations(
      interests,
      budgetMin,
      budgetMax,
      location,
      educationLevel,
      profile,
    );

    // Clear existing recommendations for this user
    await sql`DELETE FROM course_recommendations WHERE user_id = ${userId}`;
    await sql`DELETE FROM university_recommendations WHERE user_id = ${userId}`;
    await sql`DELETE FROM job_recommendations WHERE user_id = ${userId}`;

    // Insert new personalized recommendations
    for (const course of courses) {
      await sql`
        INSERT INTO course_recommendations (
          user_id, course_name, course_description, duration, fee_range, 
          eligibility, career_prospects, match_score
        )
        VALUES (
          ${userId}, ${course.course_name}, ${course.description}, 
          ${course.duration}, ${course.fee_range}, ${course.eligibility},
          ${course.career_prospects}, ${course.match_score}
        )
      `;
    }

    for (const university of universities) {
      await sql`
        INSERT INTO university_recommendations (
          user_id, university_name, location, university_type, courses_offered,
          fees, admission_criteria, ranking_info, accommodation_info, match_score
        )
        VALUES (
          ${userId}, ${university.university_name}, ${university.location},
          ${university.university_type}, ${university.courses_offered}, ${university.fees},
          ${university.admission_criteria}, ${university.ranking_info}, 
          ${university.accommodation_info}, ${university.match_score}
        )
      `;
    }

    for (const job of jobs) {
      await sql`
        INSERT INTO job_recommendations (
          user_id, job_title, job_description, required_education, required_skills,
          salary_range, growth_prospects, industry, match_score
        )
        VALUES (
          ${userId}, ${job.job_title}, ${job.job_description}, ${job.required_education},
          ${job.required_skills}, ${job.salary_range}, ${job.growth_prospects},
          ${job.industry}, ${job.match_score}
        )
      `;
    }

    return new Response(
      JSON.stringify({
        message: "Personalized recommendations generated successfully",
        counts: {
          courses: courses.length,
          universities: universities.length,
          jobs: jobs.length,
        },
        profile_summary: {
          interests: interests.length,
          budget_range: `₹${budgetMin.toLocaleString()} - ₹${budgetMax.toLocaleString()}`,
          location: location,
          education: educationLevel,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate recommendations",
        details: error.message,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

function generatePersonalizedRecommendations(
  interests,
  budgetMin,
  budgetMax,
  location,
  educationLevel,
  profile,
) {
  const courses = [];
  const universities = [];
  const jobs = [];

  // Define comprehensive course database with detailed information
  const courseDatabase = {
    // Engineering Courses
    "Computer Science Engineering (CSE)": {
      duration: "4 years",
      fee_range: "₹2,00,000 - ₹12,00,000",
      eligibility: "12th with PCM, minimum 60%",
      description:
        "Comprehensive program covering programming, algorithms, software development, AI, machine learning, and emerging technologies.",
      career_prospects:
        "Software Developer, Data Scientist, AI Engineer, System Architect, Tech Entrepreneur",
      category: "Engineering",
    },
    "Electrical & Electronics Engineering (EEE)": {
      duration: "4 years",
      fee_range: "₹2,50,000 - ₹8,00,000",
      eligibility: "12th with PCM, minimum 60%",
      description:
        "Study of electrical systems, electronics, power generation, control systems, and renewable energy technologies.",
      career_prospects:
        "Electrical Engineer, Power Systems Engineer, Electronics Designer, Automation Engineer",
      category: "Engineering",
    },
    "Data Science & Engineering": {
      duration: "4 years",
      fee_range: "₹3,00,000 - ₹15,00,000",
      eligibility: "12th with Mathematics, minimum 65%",
      description:
        "Advanced program combining statistics, machine learning, big data analytics, and business intelligence.",
      career_prospects:
        "Data Scientist, ML Engineer, Business Intelligence Analyst, Research Scientist",
      category: "Engineering",
    },
    "Artificial Intelligence & Machine Learning": {
      duration: "4 years",
      fee_range: "₹3,50,000 - ₹18,00,000",
      eligibility: "12th with PCM, minimum 70%",
      description:
        "Cutting-edge program in AI, deep learning, neural networks, computer vision, and natural language processing.",
      career_prospects:
        "AI Engineer, ML Scientist, Computer Vision Engineer, NLP Specialist, AI Research Scientist",
      category: "Engineering",
    },

    // Medical Courses
    "MBBS (Medicine)": {
      duration: "5.5 years",
      fee_range: "₹5,00,000 - ₹75,00,000",
      eligibility: "12th with PCB, NEET qualification, minimum 60%",
      description:
        "Comprehensive medical education covering anatomy, physiology, pathology, and clinical practice.",
      career_prospects:
        "Doctor, Surgeon, Medical Researcher, Hospital Administrator, Medical Consultant",
      category: "Medicine & Healthcare",
    },
    "B.Pharm (Pharmacy)": {
      duration: "4 years",
      fee_range: "₹2,00,000 - ₹8,00,000",
      eligibility: "12th with PCB/PCM, minimum 55%",
      description:
        "Study of pharmaceutical sciences, drug development, medicinal chemistry, and pharmacy practice.",
      career_prospects:
        "Pharmacist, Drug Inspector, Pharmaceutical Researcher, Clinical Research Associate",
      category: "Medicine & Healthcare",
    },

    // Business Courses
    "Business Administration (BBA)": {
      duration: "3 years",
      fee_range: "₹1,50,000 - ₹6,00,000",
      eligibility: "12th in any stream, minimum 50%",
      description:
        "Comprehensive business education covering management, marketing, finance, operations, and entrepreneurship.",
      career_prospects:
        "Business Analyst, Marketing Manager, Operations Manager, HR Executive, Entrepreneur",
      category: "Business & Management",
    },
    "Chartered Accountancy (CA)": {
      duration: "3-4 years",
      fee_range: "₹2,00,000 - ₹5,00,000",
      eligibility: "12th with Commerce/any stream, minimum 55%",
      description:
        "Professional accounting course covering auditing, taxation, financial reporting, and business advisory.",
      career_prospects:
        "Chartered Accountant, Tax Consultant, Financial Advisor, Audit Manager, CFO",
      category: "Business & Management",
    },

    // Design Courses
    "Graphic Design": {
      duration: "3-4 years",
      fee_range: "₹2,00,000 - ₹8,00,000",
      eligibility: "12th in any stream, portfolio submission",
      description:
        "Creative program covering visual communication, typography, branding, digital design, and multimedia.",
      career_prospects:
        "Graphic Designer, Creative Director, Brand Designer, UI Designer, Freelance Artist",
      category: "Design & Creative",
    },
    "UI/UX Design": {
      duration: "3-4 years",
      fee_range: "₹3,00,000 - ₹12,00,000",
      eligibility: "12th in any stream, design aptitude",
      description:
        "Modern program focusing on user experience design, interface design, user research, and prototyping.",
      career_prospects:
        "UX Designer, Product Designer, Interaction Designer, Design Researcher, Design Lead",
      category: "Design & Creative",
    },
  };

  // Define university database with location and budget considerations
  const universityDatabase = [
    {
      name: "Indian Institute of Technology (IIT) Delhi",
      location: "New Delhi",
      type: "Government",
      fees: "₹2,50,000",
      courses: ["Computer Science", "Electrical", "Mechanical", "Data Science"],
      ranking: "NIRF Rank 1",
      admission: "JEE Advanced",
      accommodation: "₹15,000/semester",
      region: "North",
    },
    {
      name: "Indian Institute of Technology (IIT) Bombay",
      location: "Mumbai",
      type: "Government",
      fees: "₹2,50,000",
      courses: ["Computer Science", "Electrical", "Chemical", "Aerospace"],
      ranking: "NIRF Rank 3",
      admission: "JEE Advanced",
      accommodation: "₹18,000/semester",
      region: "West",
    },
    {
      name: "Indian Institute of Science (IISc)",
      location: "Bangalore",
      type: "Government",
      fees: "₹2,00,000",
      courses: ["Research Programs", "Engineering", "Science"],
      ranking: "NIRF Rank 1 (Research)",
      admission: "KVPY/JEE Advanced",
      accommodation: "₹12,000/semester",
      region: "South",
    },
    {
      name: "All India Institute of Medical Sciences (AIIMS)",
      location: "New Delhi",
      type: "Government",
      fees: "₹5,856",
      courses: ["MBBS", "Nursing", "Pharmacy", "Medical Research"],
      ranking: "NIRF Rank 1 (Medical)",
      admission: "NEET UG",
      accommodation: "₹8,000/semester",
      region: "North",
    },
    {
      name: "Manipal Institute of Technology",
      location: "Manipal",
      type: "Private",
      fees: "₹4,00,000 - ₹8,00,000",
      courses: ["Engineering", "Medicine", "Management", "Design"],
      ranking: "NIRF Rank 45",
      admission: "MET",
      accommodation: "₹80,000/year",
      region: "South",
    },
    {
      name: "Delhi University",
      location: "New Delhi",
      type: "Government",
      fees: "₹50,000 - ₹2,00,000",
      courses: ["Commerce", "Arts", "Science", "Management"],
      ranking: "NIRF Rank 11",
      admission: "12th Merit/CUET",
      accommodation: "₹20,000/year",
      region: "North",
    },
    {
      name: "National Institute of Design (NID)",
      location: "Ahmedabad",
      type: "Government",
      fees: "₹2,50,000",
      courses: ["Design", "Animation", "Fashion", "Product Design"],
      ranking: "Top Design Institute",
      admission: "NID Entrance",
      accommodation: "₹25,000/semester",
      region: "West",
    },
    {
      name: "Indian Institute of Management (IIM) Ahmedabad",
      location: "Ahmedabad",
      type: "Government",
      fees: "₹25,00,000",
      courses: ["MBA", "Management", "Business Analytics"],
      ranking: "NIRF Rank 1 (Management)",
      admission: "CAT",
      accommodation: "₹1,00,000/year",
      region: "West",
    },
  ];

  // Define job database mapped to career interests
  const jobDatabase = {
    "Computer Science Engineering (CSE)": [
      {
        title: "Software Developer",
        description:
          "Design and develop software applications using modern programming languages and frameworks.",
        education: "Bachelor's in Computer Science",
        skills: [
          "Programming",
          "Problem Solving",
          "Algorithms",
          "Database Design",
        ],
        salary: "₹4,00,000 - ₹25,00,000",
        growth: "Senior Developer → Tech Lead → Engineering Manager → CTO",
        industry: "Technology",
      },
      {
        title: "Data Scientist",
        description:
          "Analyze complex datasets to extract insights and build predictive models for business decisions.",
        education: "Bachelor's in CS/Statistics with data science skills",
        skills: [
          "Python/R",
          "Machine Learning",
          "Statistics",
          "Data Visualization",
        ],
        salary: "₹6,00,000 - ₹30,00,000",
        growth:
          "Senior Data Scientist → Lead Data Scientist → Chief Data Officer",
        industry: "Technology/Consulting",
      },
    ],
    "MBBS (Medicine)": [
      {
        title: "General Physician",
        description:
          "Provide primary healthcare, diagnose illnesses, and treat patients in clinical settings.",
        education: "MBBS degree with medical license",
        skills: [
          "Clinical Diagnosis",
          "Patient Care",
          "Medical Knowledge",
          "Communication",
        ],
        salary: "₹6,00,000 - ₹20,00,000",
        growth:
          "Junior Doctor → Senior Doctor → Consultant → Hospital Director",
        industry: "Healthcare",
      },
    ],
    "Business Administration (BBA)": [
      {
        title: "Business Analyst",
        description:
          "Analyze business processes and recommend improvements to enhance operational efficiency.",
        education: "Bachelor's in Business/Management",
        skills: [
          "Analytics",
          "Communication",
          "Process Mapping",
          "Stakeholder Management",
        ],
        salary: "₹3,50,000 - ₹12,00,000",
        growth: "Junior Analyst → Senior Analyst → Manager → Director",
        industry: "Consulting/Corporate",
      },
    ],
    "Graphic Design": [
      {
        title: "Graphic Designer",
        description:
          "Create visual concepts and designs for digital and print media, branding, and marketing materials.",
        education: "Bachelor's in Design/Visual Arts",
        skills: [
          "Adobe Creative Suite",
          "Typography",
          "Branding",
          "Visual Communication",
        ],
        salary: "₹2,50,000 - ₹8,00,000",
        growth:
          "Junior Designer → Senior Designer → Art Director → Creative Director",
        industry: "Advertising/Media",
      },
    ],
  };

  // Generate course recommendations based on interests
  interests.forEach((interest) => {
    if (courseDatabase[interest]) {
      const course = courseDatabase[interest];
      const feeRange = extractFeeRange(course.fee_range);

      // Check if course fits budget
      if (feeRange.min <= budgetMax && feeRange.max >= budgetMin) {
        const matchScore = calculateCourseMatch(
          interest,
          course,
          budgetMin,
          budgetMax,
          educationLevel,
        );

        courses.push({
          course_name: interest,
          description: course.description,
          duration: course.duration,
          fee_range: course.fee_range,
          eligibility: course.eligibility,
          career_prospects: course.career_prospects,
          match_score: matchScore,
        });
      }
    }
  });

  // Generate university recommendations based on interests, location, and budget
  universityDatabase.forEach((uni) => {
    let matchScore = 0;
    let relevantCourses = [];

    // Check if university offers courses matching user interests
    interests.forEach((interest) => {
      const courseCategory = getCourseCategory(interest);
      if (
        uni.courses.some(
          (course) =>
            course.toLowerCase().includes(courseCategory.toLowerCase()) ||
            interest.toLowerCase().includes(course.toLowerCase()),
        )
      ) {
        matchScore += 30;
        relevantCourses.push(interest);
      }
    });

    if (matchScore > 0) {
      // Location preference bonus
      if (location && location.toLowerCase() !== "any") {
        if (
          uni.location.toLowerCase().includes(location.toLowerCase()) ||
          location.toLowerCase().includes(uni.location.toLowerCase())
        ) {
          matchScore += 25;
        } else {
          // Check region match
          const userRegion = getRegion(location);
          if (userRegion === uni.region) {
            matchScore += 15;
          }
        }
      } else {
        matchScore += 10; // Neutral if no preference
      }

      // Budget compatibility
      const uniFees = extractFeeRange(uni.fees);
      if (uniFees.min <= budgetMax) {
        matchScore += 20;
        if (uniFees.max <= budgetMax) {
          matchScore += 15;
        }
      }

      // Government vs Private preference based on budget
      if (uni.type === "Government" && budgetMax < 500000) {
        matchScore += 10;
      }

      universities.push({
        university_name: uni.name,
        location: uni.location,
        university_type: uni.type,
        courses_offered:
          relevantCourses.length > 0 ? relevantCourses : uni.courses,
        fees: uni.fees,
        admission_criteria: uni.admission,
        ranking_info: uni.ranking,
        accommodation_info: `${uni.accommodation} accommodation available`,
        match_score: Math.min(matchScore, 98),
      });
    }
  });

  // Generate job recommendations based on interests
  interests.forEach((interest) => {
    if (jobDatabase[interest]) {
      jobDatabase[interest].forEach((job) => {
        const matchScore = calculateJobMatch(interest, job, educationLevel);

        jobs.push({
          job_title: job.title,
          job_description: job.description,
          required_education: job.education,
          required_skills: job.skills,
          salary_range: job.salary,
          growth_prospects: job.growth,
          industry: job.industry,
          match_score: matchScore,
        });
      });
    }
  });

  // Add some general recommendations if user has broad interests
  if (courses.length < 3) {
    addGeneralRecommendations(
      courses,
      universities,
      jobs,
      budgetMin,
      budgetMax,
      educationLevel,
    );
  }

  // Sort by match score and limit results
  courses.sort((a, b) => b.match_score - a.match_score);
  universities.sort((a, b) => b.match_score - a.match_score);
  jobs.sort((a, b) => b.match_score - a.match_score);

  return {
    courses: courses.slice(0, 10),
    universities: universities.slice(0, 8),
    jobs: jobs.slice(0, 8),
  };
}

function extractFeeRange(feeString) {
  const numbers = feeString.match(/[\d,]+/g);
  if (numbers && numbers.length >= 2) {
    return {
      min: parseInt(numbers[0].replace(/,/g, "")),
      max: parseInt(numbers[numbers.length - 1].replace(/,/g, "")),
    };
  }
  if (numbers && numbers.length === 1) {
    const fee = parseInt(numbers[0].replace(/,/g, ""));
    return { min: fee, max: fee };
  }
  return { min: 0, max: 1000000 };
}

function calculateCourseMatch(
  interest,
  course,
  budgetMin,
  budgetMax,
  educationLevel,
) {
  let score = 85; // Base score for interest match

  const feeRange = extractFeeRange(course.fee_range);

  // Budget compatibility scoring
  if (feeRange.max <= budgetMax) {
    score += 10;
  } else if (feeRange.min <= budgetMax) {
    score += 5;
  }

  // Education level compatibility
  if (
    course.eligibility.includes("12th") &&
    ["12th", "diploma"].includes(educationLevel)
  ) {
    score += 5;
  } else if (
    course.eligibility.includes("Bachelor") &&
    ["bachelor", "masters"].includes(educationLevel)
  ) {
    score += 5;
  }

  return Math.min(score, 98);
}

function calculateJobMatch(interest, job, educationLevel) {
  let score = 80; // Base score for interest match

  // Education level compatibility
  if (
    job.education.toLowerCase().includes("bachelor") &&
    ["bachelor", "masters", "phd"].includes(educationLevel)
  ) {
    score += 15;
  } else if (
    job.education.toLowerCase().includes("12th") &&
    ["12th", "diploma", "bachelor"].includes(educationLevel)
  ) {
    score += 10;
  }

  return Math.min(score, 95);
}

function getCourseCategory(interest) {
  const categoryMap = {
    "Computer Science Engineering (CSE)": "Computer Science",
    "Electrical & Electronics Engineering (EEE)": "Electrical",
    "Data Science & Engineering": "Data Science",
    "MBBS (Medicine)": "Medicine",
    "Business Administration (BBA)": "Management",
    "Graphic Design": "Design",
  };

  return categoryMap[interest] || interest.split(" ")[0];
}

function getRegion(location) {
  const regions = {
    North: [
      "delhi",
      "punjab",
      "haryana",
      "rajasthan",
      "uttar pradesh",
      "himachal",
      "uttarakhand",
    ],
    South: [
      "bangalore",
      "chennai",
      "hyderabad",
      "kerala",
      "karnataka",
      "tamil nadu",
      "andhra pradesh",
    ],
    West: [
      "mumbai",
      "pune",
      "ahmedabad",
      "gujarat",
      "maharashtra",
      "rajasthan",
      "goa",
    ],
    East: [
      "kolkata",
      "bhubaneswar",
      "west bengal",
      "odisha",
      "jharkhand",
      "bihar",
    ],
  };

  const loc = location.toLowerCase();
  for (const [region, cities] of Object.entries(regions)) {
    if (cities.some((city) => loc.includes(city))) {
      return region;
    }
  }
  return "Other";
}

function addGeneralRecommendations(
  courses,
  universities,
  jobs,
  budgetMin,
  budgetMax,
  educationLevel,
) {
  // Add popular courses that fit budget if not enough specific matches
  const popularCourses = [
    {
      course_name: "Bachelor of Technology (General)",
      description:
        "Broad-based engineering program with specialization options in final years.",
      duration: "4 years",
      fee_range: "₹2,00,000 - ₹6,00,000",
      eligibility: "12th with PCM, minimum 60%",
      career_prospects: "Various engineering roles across industries",
      match_score: 70,
    },
    {
      course_name: "Bachelor of Commerce",
      description:
        "Comprehensive commerce education covering accounting, economics, and business studies.",
      duration: "3 years",
      fee_range: "₹1,00,000 - ₹3,00,000",
      eligibility: "12th in any stream, minimum 50%",
      career_prospects: "Accountant, Banking, Finance, Business Administration",
      match_score: 65,
    },
  ];

  popularCourses.forEach((course) => {
    const feeRange = extractFeeRange(course.fee_range);
    if (feeRange.max <= budgetMax && courses.length < 5) {
      courses.push(course);
    }
  });
}
