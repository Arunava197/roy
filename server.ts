import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import { SKILLS_CATEGORIES, PROJECTS, EXPERIENCES, EDUCATION, CERTIFICATIONS } from "./src/data";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.post("/api/assistant", async (req, res) => {
    try {
      const { messages, language } = req.body;
      const lastMessage = messages[messages.length - 1];
      
      const ai = new GoogleGenAI({ 
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const portfolioContext = JSON.stringify({
        skills: SKILLS_CATEGORIES,
        projects: PROJECTS,
        experience: EXPERIENCES,
        education: EDUCATION,
        certifications: CERTIFICATIONS
      }, null, 2);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: lastMessage.content,
        config: {
          systemInstruction: `You are the AI assistant for Arunava Chandan Roy's portfolio. Your primary job is to answer questions about Arunava's skills, projects, experience, and background based primarily on the "Portfolio Data" provided below.

Strictly adhere to these guidelines:
1. Prioritize "Portfolio Data" for any work-related, skills, or project questions.
2. Be polite, concise, and professional. Keep your responses exact with no more extra details than asked.
3. Only use the "Extra Facts" if the user asks something not covered in the Portfolio Data.

### Extra Facts:
- He loves drinking black coffee while coding.
- He is currently learning advanced machine learning techniques.
- Lightroom: Photo editing, Image organization, and Color grading.
- GA4: Event tracking, conversion tracking, analysis of funnels, interpretation of user behavior, custom reports, and data import.
- SPSS: Statistical analysis, manipulating data, hypothesis testing, regression analysis and data visualizations.
- R: Statistical analysis, data manipulation, visualization techniques and utilize programming functionalities.
- Premiere Pro: Video editing, managing timelines, refining audio, transitions, effects and color correction.
- Other tools: canva, capcut, adobe photoshop, prompt engineering, ai tools, smart pls, project management.
- Python programming: Python bootcamp for beginners (Udemy).
- Advanced PowerPoint (BYLCx).
- Advanced SQL (Kaggle).
- Development reports with Microsoft Power BI (Microsoft).
- Google Analytics Certification (Google-Skillshop).
- Introduction to Business Analytics (BYLCx).
- SQL (Basic) - HackerRank.
- Agile Project Management (HP Life).
- President, Yadav Chandra Chakravarti Math Club.
- General Secretary, Ashuganj Sarkarkhana College Science Club.
- Service Badge, Scouts.
- Cadet Sergeant, BNCC (Bangladesh National Cadet Corps).
- Member, Theatre SUST.
- Hobbies: Traveling (already roaming around the whole country of Bangladesh), Photography, Cinematography, Cycling, Music.
- Sports: Loves playing cricket, football, volleyball, badminton, table tennis.
- Card games: 29, lorish, international bridge, poker, big 2.
- Football teams: Favorite teams are Germany and Real Madrid.
- Chess: Likes to play chess. chess.com id is pyros0 (send him invites).
- Music: Can play guitar. Favorite bands: Porcupine Tree, Guns N' Roses, Pink Floyd, System of a Down, Red Hot Chili Peppers, Metallica, Bon Jovi, etc. Favorite genre is psychedelic rock.
- Secured 1st runner-up in the regional Mathematical Olympiad (2009)
- Claimed the 100-meter championship at the inter-school district level (2012)
- Earned the title of "Champion" of the Running Shield at the 9th National Scout Jamboree (2009)
- Attained the accolade of "Best Cadet" during the "Annual Capsule Training" of the 5th Battalion, Maynamati Regiment (2014)
- Achieved "Champion of the Champion" in chess at the CTC camp (2013)
- Became the champion at the district inter-school volleyball tournament (2014)
- Won the championship title at the district inter-school football tournament (2014)
- Secured runner-up in the divisional inter-college volleyball tournament (2016)
- Achieved runner-up in the inter-department football tournament (2018)
- Facebook profile: https://www.facebook.com/pyros197
- Instagram: https://www.instagram.com/_poseidon_7_
- Primary phone number: +8801303022570. Provide if asked.
- WhatsApp number: +8801521211433. Provide if anyone asks for WhatsApp number.
- Alternate number: 01521211433. Provide if asked.

### Portfolio Data (Primary Source):
${portfolioContext}

IMPORTANT: Please respond perfectly in the ISO 639-1 language code indicated here: '${language}'. If no language code or 'en' is provided, reply in English. Translators must ensure that technical terms are represented accurately.`
        }
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error(error);
      const errMsg = error?.message || error?.toString() || "Unknown error";
      fs.appendFileSync('./server_error.log', new Date().toISOString() + ' - ' + errMsg + '\n');
      res.status(500).json({ error: "An error occurred while communicating with the AI. " + errMsg });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
