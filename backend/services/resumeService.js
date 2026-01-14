import fs from 'fs';
import mammoth from 'mammoth';
import PDFParser from 'pdf2json';

// Parse resume text from uploaded file
export const parseResume = async (filePath, mimeType) => {
  try {
    let text = '';

    switch (mimeType) {
      case 'application/pdf':
        // Parse PDF using pdf2json
        try {
          console.log("🔍 Parsing PDF with pdf2json...");
          const dataBuffer = fs.readFileSync(filePath);
          
          const pdfParser = new PDFParser();
          
          const pdfData = await new Promise((resolve, reject) => {
            pdfParser.on('pdfParser_dataError', (errData) => {
              console.error("❌ PDF parsing error:", errData.parserError);
              reject(new Error(`PDF parsing failed: ${errData.parserError}`));
            });
            
            pdfParser.on('pdfParser_dataReady', (pdfData) => {
              try {
                let fullText = '';
                
                if (pdfData.Pages) {
                  pdfData.Pages.forEach(page => {
                    if (page.Texts) {
                      page.Texts.forEach(textItem => {
                        if (textItem.R) {
                          textItem.R.forEach(run => {
                            if (run.T) {
                              try {
                                // Try to decode, but fallback to raw text if it fails
                                const decodedText = decodeURIComponent(run.T);
                                fullText += decodedText + ' ';
                              } catch (decodeError) {
                                // If decode fails, use raw text or skip
                                if (typeof run.T === 'string') {
                                  fullText += run.T + ' ';
                                }
                              }
                            }
                          });
                        }
                      });
                      fullText += '\n';
                    }
                  });
                }
                
                text = fullText.trim();
                console.log("✅ PDF parsed successfully, text length:", text.length);
                resolve(text);
              } catch (parseError) {
                console.error("❌ PDF text extraction error:", parseError);
                reject(new Error(`PDF text extraction failed: ${parseError.message}`));
              }
            });
            
            pdfParser.parseBuffer(dataBuffer);
          });
          
          text = pdfData;
        } catch (pdfError) {
          console.error("❌ PDF parsing error:", pdfError);
          throw new Error(`PDF parsing failed: ${pdfError.message}`);
        }
        break;
        
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        const result = await mammoth.extractRawText({ path: filePath });
        text = result.value;
        break;

      case 'text/plain':
        text = fs.readFileSync(filePath, 'utf-8');
        break;

      default:
        throw new Error('Unsupported file type');
    }

    // Clean and structure the text
    const cleanedText = cleanResumeText(text);
    const structuredData = extractResumeData(cleanedText);

    return {
      parsedText: cleanedText,
      structuredData,
      skills: structuredData.skills,
      experience: structuredData.experience,
      education: structuredData.education
    };
  } catch (error) {
    console.error('Resume parsing error:', error);
    throw new Error('Failed to parse resume');
  }
};

// Clean and normalize resume text
const cleanResumeText = (text) => {
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
    .replace(/[^\w\s\n\-.,;:()@#]/g, '') // Remove special characters except basic punctuation
    .trim();
};

// Extract structured data from resume text
const extractResumeData = (text) => {
  const commonSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++', 'HTML', 'CSS',
    'MongoDB', 'PostgreSQL', 'MySQL', 'AWS', 'Docker', 'Kubernetes', 'Git',
    'TypeScript', 'Angular', 'Vue.js', 'Express', 'Django', 'Flask', 'Spring',
    'REST API', 'GraphQL', 'Microservices', 'CI/CD', 'Agile', 'Scrum',
    'Machine Learning', 'Data Science', 'DevOps', 'Linux', 'Windows'
  ];

  const skills = [];
  const experience = [];
  const education = [];

  // Extract skills
  commonSkills.forEach(skill => {
    if (text.toLowerCase().includes(skill.toLowerCase())) {
      skills.push(skill);
    }
  });

  // Extract experience (simple pattern matching)
  const experienceMatches = text.match(/\b(\d+)\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp|work|employment)\b/gi);
  if (experienceMatches) {
    experience.push(...experienceMatches);
  }

  // Extract education
  const educationKeywords = ['Bachelor', 'Master', 'PhD', 'B.S.', 'M.S.', 'B.Tech', 'M.Tech', 'University', 'College'];
  const lines = text.split('\n');
  lines.forEach(line => {
    if (educationKeywords.some(keyword => line.toLowerCase().includes(keyword.toLowerCase()))) {
      education.push(line.trim());
    }
  });

  return {
    skills: [...new Set(skills)], // Remove duplicates
    experience: [...new Set(experience)],
    education: [...new Set(education)],
    rawText: text
  };
};
