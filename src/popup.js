const $decrementBreak = document.getElementById('decrement-break')
const $incrementBreak = document.getElementById('increment-break')
const $decrementSession = document.getElementById('decrement-session')
const $incrementSession = document.getElementById('increment-session')
const $break = document.getElementById('break')
const $session = document.getElementById('session')
const $status = document.getElementById('status')
const $timeLeft = document.getElementById('time-left')
const $startStop = document.getElementById('start-stop')
const $reset = document.getElementById('reset')

let state = null

const init = () => {
  $decrementBreak.addEventListener('click', () => sendMessage('decrementBreak'))
  $incrementBreak.addEventListener('click', () => sendMessage('incrementBreak'))
  $decrementSession.addEventListener('click', () => sendMessage('decrementSession'))
  $incrementSession.addEventListener('click', () => sendMessage('incrementSession'))
  $startStop.addEventListener('click', () => sendMessage('startStopTimer'))
  $reset.addEventListener('click', () => sendMessage('reset'))

  const sendMessage = (action) => {
    chrome.runtime.sendMessage(action, response => {
      state = response
      updateUI()
    })
  }

  const getState = () => {
    chrome.runtime.sendMessage('getState', (response) => {
      state = response
      updateUI()
    })
  }

  updateUI = () => {
    $break.innerHTML = state.breakLength
    $session.innerHTML = state.sessionLength
    $status.innerHTML = state.status

    const minutes = state.sessionMinutes
    const seconds = state.sessionSeconds
    $timeLeft.innerHTML = `${minutes<10? '0'+minutes : minutes}:${seconds<10? '0'+seconds : seconds}`
    
    const startIcon = `
      <svg width="100%" height="100%" viewBox="0 0 16 16">
        <path d="M6 4v8l6-4z"></path>
      </svg>
    `
    const stopIcon = `
      <svg width="100%" height="100%" viewBox="0 0 64 64">
        <path d="M39,17.563c-2.75,0-5,2.25-5,5v18.875c0,2.75,2.25,5,5,5s5-2.25,5-5V22.563C44,19.813,41.75,17.563,39,17.563z M41,41.438 c0,1.1-0.9,2-2,2s-2-0.9-2-2V22.563c0-1.1,0.9-2,2-2s2,0.9,2,2V41.438z"/>
        <path d="M25,17.563c-2.75,0-5,2.25-5,5v18.875c0,2.75,2.25,5,5,5s5-2.25,5-5V22.563C30,19.813,27.75,17.563,25,17.563z M27,41.438 c0,1.1-0.9,2-2,2s-2-0.9-2-2V22.563c0-1.1,0.9-2,2-2s2,0.9,2,2V41.438z"/>
      </svg>
    `
    if (!state.isWork) {
      $startStop.innerHTML = startIcon
    } else {
      $startStop.innerHTML = stopIcon
    }
  }

  updateUI()
  setInterval(getState, 1000)
}

chrome.runtime.sendMessage('getState', (response) => {
  state = response
  init()
})