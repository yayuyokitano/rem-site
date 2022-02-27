import * as config from "../config";
import { removeUserData } from "./discordAuth";

function strToRand(str:string, max:number) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return Math.abs(hash % max) + 1;
}

export function iconURL(serverID:string, name:string, icon:string) {
	if (icon == "") return `/placeholder/${strToRand(name, 12)}.jpeg`;
	if (icon.startsWith("a_")) {
		return `https://cdn.discordapp.com/icons/${serverID}/${icon}.gif?size=64`;
	} else {
		return `https://cdn.discordapp.com/icons/${serverID}/${icon}.webp?size=64`
	}
}

export function avatarURL(userID:string, avatar:string) {
	if (avatar.startsWith("a_")) {
		return `https://cdn.discordapp.com/avatars/${userID}/${avatar}.gif?size=48`;
	} else {
		return `https://cdn.discordapp.com/avatars/${userID}/${avatar}.webp?size=48`
	}
};

export type Guild = {
	guild: {
		id:string;
		name:string;
		icon:string;
		owner:boolean;
		permissions:string;
		features:string[];
	}
	remIsMember:boolean;
}

export type Guilds = Guild[];

export async function getGuildList() {
	const userID = localStorage.getItem("userID");
	const token = Number(localStorage.getItem("token")) || 0;
	if(userID && token) {
		const res = await fetch(`${config.remBackendURL}/guilds?token=${token}&userID=${userID}`, {
			method: "GET"
		});
		if (!res.ok) {
			return removeUserData();
		}

		const guilds = await res.json() as Guilds;
		return {
			type: "authorized",
			guilds: guilds
		};
	}
	return removeUserData();
}