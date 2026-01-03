import { GoogleGenerativeAI } from '@google/generative-ai';
import pdfParse from 'pdf-parse';
import formidable from 'formidable';
import fs from 'fs/promises';

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the uploaded file
    const form = formidable({});
    const [fields, files] = await form.parse(req);
    
    const file = files.file?.[0];
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read PDF content
    const fileBuffer = await fs.readFile(file.filepath);
    const pdfData = await pdfParse(fileBuffer);
    const pdfText = pdfData.text;

    // Extract data using Google AI
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `Extract the following information from this Indonesian BKD (Beban Kerja Dosen) document and return ONLY valid JSON with no additional text or markdown:

BKD Document Text:
${pdfText}

Extract these fields:
{
  "nama": "full name from document",
  "fakultas_departemen": "faculty/department name",
  "jurusan_program_studi": "major/study program",
  "perguruan_tinggi": "university name",
  "total_sks_bkd": total SKS as number,
  "total_teaching_sks": teaching SKS as number,
  "total_research_sks": research SKS as number,
  "total_service_sks": service SKS as number,
  "total_advisees": number of academic advisees,
  "number_of_courses": {
    "Course Name 1": number of classes,
    "Course Name 2": number of classes
  },
  "journal_publications": [
    {
      "title": "publication title",
      "journal_name": "journal name",
      "publication_date": "date"
    }
  ],
  "semester_year": "semester and year (e.g., GENAP 2024/2025)"
}

Return ONLY the JSON object, no markdown code blocks or additional text.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean the response (remove markdown code blocks if present)
    let cleanedResponse = responseText.trim();
    cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    // Parse the JSON
    const extractedData = JSON.parse(cleanedResponse);

    return res.status(200).json({
      status: 'success',
      data: extractedData
    });

  } catch (error) {
    console.error('Error processing BKD:', error);
    return res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
}