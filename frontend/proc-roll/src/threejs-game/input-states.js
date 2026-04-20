
var userInputState = {
  w: false,
  s: false,
  a: false,
  d: false
}

// Detect Key-down
window.addEventListener('keydown', (event) => {
  if (event.key === 'w') {
    userInputState.w = true;
  } else if (event.key === 's') {
    userInputState.s = true;
  } else if (event.key === 'a') {
    userInputState.a = true;
  } else if (event.key === 'd') {
    userInputState.d = true;
  }
});

// Detect Key-up
window.addEventListener('keyup', (event) => {
    if (event.key === 'w') {
        userInputState.w  = false;
    } else if (event.key === 's') {
        userInputState.s = false;
    } else if (event.key === 'a') {
        userInputState.a = false;
    } else if (event.key === 'd') {
        userInputState.d = false;
    }   
});

export default userInputState;