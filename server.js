import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import { dates } from './utils/dates.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

const POLY = process.env.POLYGON_API_KEY
const OPENAI = process.env.OPENAI_API_KEY
const PORT = process.env.PORT || 3000

app.post('/report', async (req, res) => {
  try {
    const { tickers } = req.body
    if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
      return res.status(400).json({ error: 'tickers array required' })
    }

    // Developer-friendly mock mode. If MOCK=true in your .env, return
    // a synthetic report so you can test the frontend without real keys.
    if (process.env.MOCK === 'true') {
      const mockLines = tickers.map(t => `${t}: mock summary — performance looks neutral (dev mode)`) 
      const mockReport = `MOCK REPORT (MOCK=true)\n\n` + mockLines.join('\n\n') + '\n\n(This is synthetic data)'
      return res.json({ report: mockReport })
    }

    const stockPromises = tickers.map(async (ticker) => {
      const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${dates.startDate}/${dates.endDate}?apiKey=${POLY}`
      const r = await fetch(url)
      if (!r.ok) return { ticker, error: `polygon status ${r.status}` }
      const data = await r.json()
      return { ticker, data }
    })

    const stockResults = await Promise.all(stockPromises)

    const combined = stockResults.map(r => {
      if (r.error) return `${r.ticker}: ERROR ${r.error}`
      return `${r.ticker}: ${JSON.stringify(r.data)}`
    }).join('\n\n')

    if (!OPENAI) {
      return res.json({ report: `OpenAI not configured on server. Data preview:\n\n${combined.slice(0,2000)}` })
    }

    const messages = [
      { role: 'system', content: `You are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 150 words describing the stocks performance and recommending whether to buy, sell, or hold the stock.` },
      { role: 'user', content: combined }
    ]

    const aiResp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ model: 'gpt-4', messages, max_tokens: 500, temperature: 1 })
    })

    if (!aiResp.ok) {
      const text = await aiResp.text()
      return res.status(502).json({ error: 'OpenAI error', detail: text })
    }

    const aiJson = await aiResp.json()
    const content = aiJson.choices?.[0]?.message?.content || aiJson.choices?.[0]?.text || 'No response'
    res.json({ report: content })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'server error' })
  }
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
