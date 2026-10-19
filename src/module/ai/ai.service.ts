import { GoogleGenAI } from "@google/genai";
import { prisma } from '../../lib/pirsma';

export interface AcademicSubjectInsight {
  name: string;
  courseCode: string;
  grade: string;
  gradePoint: number;
  credit: number;
}

export interface SemesterInsight {
  semester: string;
  year: number;
  gpa: number;
  subjects: AcademicSubjectInsight[];
}

class AIService {
  private readonly gemini: GoogleGenAI;
  private readonly model: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing");
    }

    if (!model) {
      throw new Error("GEMINI_MODEL is missing");
    }

    this.gemini = new GoogleGenAI({ apiKey });
    this.model = model;
  }

async chat(message: string): Promise<string> {
  const response = await this.gemini.models.generateContent({
    model: this.model,
    contents: message,
    config: {
      systemInstruction: `
        You are UniSphere AI, a friendly and professional university
        assistant for the UniSphere University Management System.

        ## 1. Language Support
        - Detect the language used by the user.
        - If the user writes in Bengali, reply in natural Bengali
          using Bengali script.
        - If the user writes in English, reply in clear English.
        - If the user mixes Bengali and English, respond naturally
          in a similar style.
        - Keep technical terms such as GPA, CGPA, API, database,
          registration, and semester in English when appropriate.
        - Use simple language that students and visitors can understand.

        ## 2. University Assistance
        Help users with:
        - Admission procedures and application guidance.
        - Departments, programs, and courses.
        - Admission eligibility and required documents.
        - Semester registration and course enrollment.
        - Examination procedures and results.
        - GPA, CGPA, grading systems, and academic progress.
        - Tuition fees, payment procedures, and installments.
        - Student accounts and general university services.
        - How to navigate and use the UniSphere platform.

        ## 3. Accuracy and Reliability
        - Never invent university policies, fees, deadlines,
          admission requirements, or course information.
        - Use only verified university information provided
          in the conversation or available through authorized tools.
        - If information is unavailable, explain the limitation
          and suggest contacting the relevant university office.
        - Clearly distinguish general guidance from official policy.
        - Do not present assumptions as confirmed facts.

        ## 4. Student Privacy and Security
        - Never claim to have accessed a student's private records
          unless the relevant information is explicitly provided.
        - Never reveal another student's personal or academic data.
        - Do not request passwords, OTPs, API keys, or other secrets.
        - Direct users to the official authenticated dashboard
          for private academic information.

        ## 5. Conversation Style
        - Be polite, helpful, respectful, and encouraging.
        - Answer the user's actual question directly.
        - Use headings, bullet points, and numbered steps when useful.
        - Keep simple answers concise and explain complex topics clearly.
        - Ask a follow-up question when essential information is missing.
        - Provide practical step-by-step guidance when appropriate.
        - Avoid unnecessary repetition and overly technical explanations.

        ## 6. Technical Support
        - Explain web development and platform-related questions
          accurately when relevant.
        - Explain technical terms in beginner-friendly language.
        - Never claim that an action was completed unless it was
          actually performed by an authorized system or tool.

        ## 7. Important Limitations
        - You are an AI assistant, not a university official.
        - Do not guarantee admission, grades, scholarships,
          payments, or other outcomes.
        - For official decisions, direct users to the appropriate
          university department.
      `,
    },
  });

  return (
    response.text?.trim() ||
    "Sorry, I couldn't generate a response. Please try again."
  );
}

 async generateAcademicInsights(userId: string) {
  const result = await prisma.studentSubjectResult.findMany({
    where: {
      studentId: userId,
    },
    select: {
      semesterId: true,
      grade: true,
      gradePoint: true,
      semester: {
        select: {
          id: true,
          name: true,
          year: true,
        },
      },
      course: {
        select: {
          name: true,
          courseCode: true,
          credit: true,
        },
      },
    },
  });

  interface SemesterData {
    semesterId: string;
    semester: string;
    semesterName: string;
    year: number;
    totalWeightedPoints: number;
    totalCredits: number;
    subjects: AcademicSubjectInsight[];
  }

  // No academic results available.
  if (result.length === 0) {
    return {
      currentCGPA: null,
      semesters: [] as SemesterInsight[],
      insights:
        "There is not enough academic data to generate insights yet.",
    };
  }

  // Group subject results by semester ID.
  const semesterMap = new Map<string, SemesterData>();

  for (const item of result) {
    const semesterId = item.semesterId;
    const credit = Number(item.course.credit);
    const gradePoint = Number(item.gradePoint);

    // Ignore invalid academic data.
    if (
      !Number.isFinite(credit) ||
      !Number.isFinite(gradePoint) ||
      credit <= 0 ||
      gradePoint < 0
    ) {
      continue;
    }

    if (!semesterMap.has(semesterId)) {
      semesterMap.set(semesterId, {
        semesterId,
        semester: `${item.semester.name} ${item.semester.year}`,
        semesterName: String(item.semester.name),
        year: item.semester.year,
        totalWeightedPoints: 0,
        totalCredits: 0,
        subjects: [],
      });
    }

    const semesterData = semesterMap.get(semesterId)!;

    semesterData.totalWeightedPoints += gradePoint * credit;
    semesterData.totalCredits += credit;

    semesterData.subjects.push({
      name: item.course.name,
      courseCode: item.course.courseCode,
      grade: item.grade,
      gradePoint,
      credit,
    });
  }

  // Define the actual academic order of your SemesterCode enum here.
  const semesterOrder: Record<string, number> = {
    SPRING: 1,
    SUMMER: 2,
    FALL: 3,
  };

  // Calculate semester-wise GPA.
  const semesters: SemesterInsight[] = Array.from(
    semesterMap.values(),
  )
    .filter((item) => item.totalCredits > 0)
    .map((item) => ({
      semester: item.semester,
      year: item.year,
      gpa: Number(
        (
          item.totalWeightedPoints / item.totalCredits
        ).toFixed(2),
      ),
      subjects: item.subjects,
    }))
    .sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }

      const nameA = a.semester.split(" ")[0] ?? "";
      const nameB = b.semester.split(" ")[0] ?? "";

      return (
        (semesterOrder[nameA] ?? 99) -
        (semesterOrder[nameB] ?? 99)
      );
    });

  // Calculate credit-weighted CGPA across all included results.
  const totalWeightedPoints = Array.from(
    semesterMap.values(),
  ).reduce(
    (sum, item) => sum + item.totalWeightedPoints,
    0,
  );

  const totalCredits = Array.from(
    semesterMap.values(),
  ).reduce(
    (sum, item) => sum + item.totalCredits,
    0,
  );

  const currentCGPA =
    totalCredits > 0
      ? Number(
          (totalWeightedPoints / totalCredits).toFixed(2),
        )
      : null;

  const academicData = {
    currentCGPA,
    completedSemesters: semesters.length,
    semesters,
  };

  // Ask Gemini to analyze calculated data, not calculate grades.
  const response = await this.gemini.models.generateContent({
    model: this.model,
    contents: [
      "Analyze the following verified academic records.",
      "Respond in clear English.",
      "Discuss semester GPA trends, actual subject strengths and weaknesses,",
      "practical study improvements, and next-semester recommendations.",
      "Do not invent academic records or calculate a different CGPA.",
      "If fewer than two semesters exist, do not claim a reliable trend.",
      "Be supportive, accurate, and concise.",
      JSON.stringify(academicData),
    ].join("\n"),
    config: {
      systemInstruction: `
        You are UniSphere's Academic Performance Assistant.

        The supplied academic records and calculated CGPA are authoritative.
        Analyze only the provided data.

        Explain:
        1. Semester-wise GPA performance.
        2. Whether performance is improving, declining, or fluctuating,
           only when enough semester data exists.
        3. Strong and weak subjects using their actual grade points.
        4. Practical study improvements.
        5. Actionable recommendations for the next semester.

        Rules:
        - Never invent grades, subjects, semesters, or academic records.
        - Never change or recalculate the supplied official CGPA.
        - Do not claim a trend from a single semester.
        - Mention when academic data is insufficient.
        - Never guarantee future academic results.
        - Be supportive and concise.
      `,
    },
  });

  const insights =
    response.text?.trim() ||
    "Unable to generate academic insights. Please try again.";

  return {
    currentCGPA,
    semesters,
    insights,
  };
}

}

export default new AIService();