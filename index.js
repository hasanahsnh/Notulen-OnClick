import Replicate from 'replicate'
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'notulensi-onclick')))

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: 'https://www.npmjs.com/package/create-replicate'
})

app.post('/api/rangkuman', async (req, res) => {
  const { notulen } = req.body
  if (!notulen) {
    return res.status(400).json({ error: 'Isi notulen tidak boleh kosong' })
  }

  const prompt = `Summarize the meeting notes below clearly and professionally in Indonesia: ${notulen} Return the summary in a clear and readable format, using bullet points or paragraphs.`;

  const input = {
    top_k: 50,
    top_p: 0.9,
    prompt: prompt,
    max_tokens: 4000,
    min_tokens: 0,
    temperature: 0.6,
    presence_penalty: 0,
    frequency_penalty: 0,
  }

  try {
    // Starting the model run
    console.log('Starting model run...')
    const model = 'ibm-granite/granite-3.3-8b-instruct:a325a0cacfb0aa9226e6bad1abe5385f1073f4c7f8c36e52ed040e5409e6c034'
    console.log('Using model: %s', model)
    console.log('With input: %O', input)
    
    // Running the model
    const output = await replicate.run(model, { input })
    console.log('Model run completed successfully.')
    console.log('Done!', output)
    console.log('Output:', output.join(''))
    res.json({ rangkuman: output.join('') })
  } catch (error) {
    console.error('Error occurred while running model:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

/* History prompt 
- Create a modern, responsive landing page using HTML, Tailwind CSS, and vanilla JavaScript that includes a top navbar with "Notulen On Click" and "Beri Dukungan", a centered hero section with the headline "Rangkum notulensi Anda dalam satu klik" and a "Coba Sekarang" button, scattered floating geometric shapes in the background, and a styled textarea form with a label and a paper plane send button, applying clean UI design and logging the input to the console.
- 
*/