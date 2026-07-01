
var userInputState = {
  w: false,
  s: false,
  a: false,
  d: false
}

// Detect Key-down
window.addEventListener('keydown', (event) => {
  if (event.key.toLowerCase() === 'w') {
    userInputState.w = true;
  } else if (event.key.toLowerCase() === 's') {
    userInputState.s = true;
  } else if (event.key.toLowerCase() === 'a') {
    userInputState.a = true;
  } else if (event.key.toLowerCase() === 'd') {
    userInputState.d = true;
  }
});

// Detect Key-up
window.addEventListener('keyup', (event) => {
    if (event.key.toLowerCase() === 'w') {
        userInputState.w  = false;
    } else if (event.key.toLowerCase() === 's') {
        userInputState.s = false;
    } else if (event.key.toLowerCase() === 'a') {
        userInputState.a = false;
    } else if (event.key.toLowerCase() === 'd') {
        userInputState.d = false;
    }   
});

export default userInputState;