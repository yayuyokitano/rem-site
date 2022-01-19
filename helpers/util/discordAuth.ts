import * as config from "../config";
import { avatarURL } from "./discordUtil";

export function getCurrentUserNaive() {
	const username = localStorage.getItem("username");
	const discriminator = localStorage.getItem("discriminator");
	const avatar = localStorage.getItem("avatar");
	const userID = localStorage.getItem("userID");
	if(username && discriminator && avatar && userID) {
		return {
			type: "authorized" as "authorized",
			username,
			discriminator,
			avatar: avatarURL(userID, avatar)
		};
	}
	return {
		type: "unauthorized" as "unauthorized",
		state: getNewState()
	}
}

export async function getCurrentUserStrict() {
  const userID = localStorage.getItem("userID");
  const token = localStorage.getItem("token");
  if(userID && token) {
    const res = await fetch(`${config.remBackendURL}/verify-user`, {
      method: "POST",
      body: JSON.stringify({
        userID,
        token
      })
    });
    if (!res.ok) {
      return removeUserData();
    }
    const resp = await res.json();
    console.log(resp);
    const { username, discriminator, avatar } = resp;

    localStorage.setItem("username", username);
    localStorage.setItem("discriminator", discriminator);
    localStorage.setItem("avatar", avatar);
    return {
      type: "authorized" as "authorized",
      username,
      discriminator,
      avatar: avatarURL(userID, avatar)
    }
  }
  return removeUserData();
  
}

export function removeUserData() {
  if (process.env.NODE_ENV === "production") {
    localStorage.removeItem("username");
    localStorage.removeItem("discriminator");
    localStorage.removeItem("avatar");
    localStorage.removeItem("userID");
    localStorage.removeItem("token");
  }
  return {
    type: "unauthorized" as "unauthorized",
    state: getNewState()
  }
}

function getNewState() {
	const state = generateRandomString();
	localStorage.setItem("oauth-state", state);
	return state;
}

function generateRandomString() {
	const arr = new Uint8Array(40);
	window.crypto.getRandomValues(arr);
	return Array.from(arr, dec2hex).join('');
}

const dec2hex = (dec:number) => dec.toString(16).padStart(2, "0");