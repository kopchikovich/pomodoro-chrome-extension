const initialState = {
  breakLength: 15,
  sessionLength: 45,
  sessionMinutes: 45,
  sessionSeconds: 0,
  status: 'Session',
  isWork: false,
  interval: null
}
chrome.storage.sync.get(['breakLength', 'sessionLength'], (res) => {
  if (res.breakLength && res.sessionLength) {
    initialState.breakLength = +res.breakLength
    initialState.sessionLength = +res.sessionLength
    initialState.sessionMinutes = +res.sessionLength
  } else {
    chrome.storage.sync.set({
      'breakLength': initialState.breakLength,
      'sessionLength': initialState.sessionLength
    })
  }
  reset()
})

let state = {...initialState}
const beep = new Audio('t-rex-roar.mp3')

const decrementBreak = () => {
  state.breakLength = state.breakLength <= 1? 1 : state.breakLength-1
}
const incrementBreak = () => {
  state.breakLength = state.breakLength >= 20? 20 : state.breakLength+1
}
const decrementSession = () => {
  const decrementResult = state.sessionLength <= 1? 1 : state.sessionLength-1
  state.sessionLength = decrementResult
  state.sessionMinutes = decrementResult
}
const incrementSession = () => {
  const incrementResult = state.sessionLength >= 60? state.sessionLength : state.sessionLength+1
  state.sessionLength = incrementResult
  state.sessionMinutes = incrementResult
}

const startStopTimer = () => {
  if (state.isWork) {
    clearInterval(state.interval)
    state.isWork = false
  } else {
    const interval = setInterval(() => {
      tickTimer()
    }, 1000)
    state.isWork = true
    state.interval = interval
  }
}
const tickTimer = () => {
  let minutes = state.sessionMinutes
  let seconds = state.sessionSeconds
  if (minutes === 0 && seconds === 0) {
    beep.play()
    state.status = state.status === 'Session'? 'Break' : 'Session'
    state.sessionMinutes = state.status === 'Session'? state.sessionLength : state.breakLength
    state.sessionSeconds = 0
  } else {
    state.sessionMinutes = seconds === 0? minutes-1 : minutes
    state.sessionSeconds = seconds === 0? 59 : seconds-1
  }
}

const reset = () => {
  beep.pause()
  beep.currentTime = 0.0
  clearInterval(state.interval)
  state = {...initialState}
}

chrome.runtime.onMessage.addListener((action, sender, sendResponse) => {
  switch(action) {
    case "decrementBreak":
      decrementBreak()
      break;
    case "incrementBreak":
      incrementBreak()
      break;
    case "decrementSession":
      decrementSession()
      break;
    case "incrementSession":
      incrementSession()
      break;
    case "startStopTimer":
      startStopTimer()
      break;
    case "reset":
      reset()
      break;
    case "getState":
      break;
  }
  sendResponse(state)
})

chrome.storage.onChanged.addListener((changes) => {
  for (let key in changes) {
    initialState[key] = changes[key].newValue
    if (key === 'sessionLength') {
      initialState.sessionMinutes = changes[key].newValue
    }
  }
  reset()
})