function dec2hex (dec:number) {
  return dec.toString(16).padStart(2, "0");
}

function generateRandomString() {
	const arr = new Uint8Array(40);
  window.crypto.getRandomValues(arr);
	return Array.from(arr, dec2hex).join('');
}

export function getNewState() {
  const state = generateRandomString();
  localStorage.setItem("oauth-state", state);
  return state;
}

export function checkState(search:string) {
  const args = new URLSearchParams(search);
  return {
    code: args.get("code"),
    success: localStorage.getItem("oauth-state") === args.get("state")
  }
}