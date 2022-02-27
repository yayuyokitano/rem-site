import type { NextPage } from "next";
import Head from "next/head";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "../styles/Auth.module.scss";
import * as config from "../helpers/config";
import Link from "next/link";
import Router from "next/router";
import { ConstructionOutlined } from "@mui/icons-material";

const Auth: NextPage = () => {

	const [didFetchToken, setDidFetchToken] = useState<boolean>();
	const [isLoading, setLoading] = useState(true);
	const [isGuild, setGuild] = useState(false);
	useEffect(() => {
		if (isLoading) {
			authorize(window.location.search, setGuild).then(wasSuccessful => {
				setDidFetchToken(wasSuccessful);
				setLoading(false);
			}).catch(() => {
				setDidFetchToken(false);
				setLoading(false);
			});
		} else {
			setTimeout(() => {
				Router.push(isGuild ? "/dashboard" : "/");
			}, 1500);
		}
	}, [isLoading]);

	if(isLoading) return <AwaitingBody />;

	return (
		<AuthBody success={didFetchToken} isGuild={isGuild} />
	);
}

const AuthBody = (props:{
	success:boolean | undefined;
	isGuild:boolean
}) => {
	const {success, isGuild} = props;
	if (success) {
		return <SuccessBody />;
	} else {
		return <FailBody isGuild={isGuild} />;
	}
}

const AwaitingBody = () => {
	return (
		<div className={styles.container}>
			<Head>
				<title>REM - Authorizing</title>
				<meta name="robots" content="noindex" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={styles.main}>
				<h1 className={styles.title}>Authorizing...</h1>
				<p>Please wait.</p>
			</main>
		</div>
	);
}

const SuccessBody = () => {
	return (
		<div className={styles.container}>
			<Head>
				<title>REM - Authorized</title>
				<meta name="robots" content="noindex" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={styles.main}>
				<h1 className={styles.title}>Authorized.</h1>
				<p>Please wait to be redirected.</p>
			</main>
		</div>
	);
}

const FailBody = (props:{isGuild:boolean}) => {
	const {isGuild} = props;
	return (
		<div className={styles.container}>
			<Head>
				<title>REM - Authorization failed</title>
				<meta name="robots" content="noindex" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={styles.main}>
				<h1 className={styles.title}>Authorization failed.</h1>
				<p>Please try again.</p>
				<Link href={isGuild ? "/dashboard" : "/"}>
					<a>Click here to return to the {isGuild ? "dashboard" : "homepage"}</a>
				</Link>
			</main>
		</div>
	);
}

type UserDetails = {
	userID: string;
	username: string;
	discriminator: string;
	avatar: string;
	token: number;
}

type GuildDetails = {
	guildID: string;
}


async function authorize(search:string, setGuild:Dispatch<SetStateAction<boolean>>) {
	const { code, guildID, success } = checkState(search);
  console.log(guildID)
  console.log(typeof guildID)
	const isGuild = typeof guildID !== "undefined";

	setGuild(isGuild);
	if (!isGuild && !success) {
		return false;
	}
	
	const res = await fetch(`${config.remBackendURL}/authorize-${isGuild ? "guild" : "user"}`, {
		method: "POST",
		body: JSON.stringify({
			code
		})
	});
	if (!res.ok) {
		return false;
	}
	if (isGuild) {
		const guildDetails:GuildDetails = await res.json();
		return guildID === guildDetails.guildID;
	}
	const userDetails:UserDetails = await res.json();
	localStorage.setItem("userID", userDetails.userID);
	localStorage.setItem("username", userDetails.username);
	localStorage.setItem("discriminator", userDetails.discriminator);
	localStorage.setItem("avatar", userDetails.avatar);
	localStorage.setItem("token", userDetails.token.toString());
	return true;
	
}

function checkState(search:string) {
	const args = new URLSearchParams(search);
	return {
		code: args.get("code"),
		guildID: args.get("guild_id"),
		success: localStorage.getItem("oauth-state") === args.get("state")
	}
}

export default Auth;