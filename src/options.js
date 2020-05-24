const $decrementBreak = document.getElementById('decrement-break')
const $incrementBreak = document.getElementById('increment-break')
const $decrementSession = document.getElementById('decrement-session')
const $incrementSession = document.getElementById('increment-session')
const $break = document.getElementById('break')
const $session = document.getElementById('session')
const $save = document.getElementById('save')
const updateUI = () => {
  $break.innerHTML = breakLength
  $session.innerHTML = sessionLength
}

let breakLength = 0
let sessionLength = 0

$decrementBreak.addEventListener('click', () => {
  breakLength = breakLength <= 1? 1 : breakLength-1
  updateUI()
})
$incrementBreak.addEventListener('click', () => {
  breakLength = breakLength >= 20? 20 : breakLength+1
  updateUI()
})
$decrementSession.addEventListener('click', () => {
  sessionLength = sessionLength <= 1? 1 : sessionLength-1
  updateUI()
})
$incrementSession.addEventListener('click', () => {
  sessionLength = sessionLength >= 60? 60 : sessionLength+1
  updateUI()
})

$save.addEventListener('click', () => {
  chrome.storage.sync.set({
    breakLength,
    sessionLength
  })
})

chrome.storage.sync.get(['breakLength', 'sessionLength'], (res) => {
  breakLength = res.breakLength
  sessionLength = res.sessionLength
  updateUI()
})