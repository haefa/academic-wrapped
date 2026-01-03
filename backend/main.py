import os
import json
import pdfplumber
import google.generativeai as genai
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini
genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')

@app.post("/api/process-bkd")
async def process_bkd(file: UploadFile = File(...)):
    try:
        # 1. Extract text from PDF
        pdf_text = ""
        with pdfplumber.open(file.file) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    pdf_text += text + "\n"

        if not pdf_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")

        # 2. Prompt Gemini for structured JSON
        prompt = f"""
        Extract the following data from this Indonesian BKD (Beban Kerja Dosen) text into a clean JSON format.
        
        BKD Text:
        {pdf_text}

        Return ONLY a JSON object with these keys:
        - nama
        - fakultas_departemen
        - jurusan_program_studi
        - perguruan_tinggi
        - total_sks_bkd
        - total_teaching_sks
        - total_research_sks
        - total_service_sks
        - total_advisees (Menguji Tugas Akhir)
        - number_of_courses: courseA: x, courseB: y, courseC: z (sort DESC)
        - journal_publications: themeA: x - description, theme B: y - description
        - semester_year
        """

        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        # 3. Parse and Return
        extracted_data = json.loads(response.text)
        return {"status": "success", "data": extracted_data}

    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok"}
