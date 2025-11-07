// Frontend: no server-side imports. The frontend will POST tickers to a
// backend endpoint which performs Polygon/OpenAI requests securely.



const tickersArr = []

const generateReportBtn = document.querySelector('.generate-report-btn')

generateReportBtn.addEventListener('click', fetchStockData)

document.getElementById('ticker-input-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const tickerInput = document.getElementById('ticker-input')
    if (tickerInput.value.length > 2) {
        generateReportBtn.disabled = false
        const newTickerStr = tickerInput.value
        tickersArr.push(newTickerStr.toUpperCase())
        tickerInput.value = ''
        renderTickers()
    } else {
        const label = document.getElementsByTagName('label')[0]
        label.style.color = 'red'
        label.textContent = 'You must add at least one ticker. A ticker is a 3 letter or more code for a stock. E.g TSLA for Tesla.'
    }
})

function renderTickers() {
    const tickersDiv = document.querySelector('.ticker-choice-display')
    tickersDiv.innerHTML = ''
    tickersArr.forEach((ticker) => {
        const newTickerSpan = document.createElement('span')
        newTickerSpan.textContent = ticker
        newTickerSpan.classList.add('ticker')
        tickersDiv.appendChild(newTickerSpan)
    })
}

const loadingArea = document.querySelector('.loading-panel')
const apiMessage = document.getElementById('api-message')

async function fetchStockData() {
    // Show loading UI
    document.querySelector('.action-panel').style.display = 'none'
    loadingArea.style.display = 'flex'
    apiMessage.innerText = 'Sending tickers to server...'

    try {
        const resp = await fetch('http://localhost:3000/report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tickers: tickersArr })
        })

        if (!resp.ok) {
            const text = await resp.text()
            loadingArea.innerText = 'Server error: ' + (text || resp.status)
            return
        }

        const json = await resp.json()
        apiMessage.innerText = 'Creating report...'
        renderReport(json.report || 'No report returned from server')
    } catch (err) {
        loadingArea.innerText = 'There was an error contacting the server.'
        console.error('error: ', err)
    }
}

function renderReport(output) {
    loadingArea.style.display = 'none'
    const outputArea = document.querySelector('.output-panel')
    const report = document.createElement('p')
    outputArea.appendChild(report)
    report.textContent = output
    outputArea.style.display = 'flex'
}
