import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Auth.module.scss";
import * as config from "../helpers/config";
import Link from "next/link";
import Router from "next/router";

const Auth: NextPage = () => {

	const [didFetchToken, setDidFetchToken] = useState<boolean>();
	const [isLoading, setLoading] = useState(true);
	useEffect(() => {
		authorizeUser(window.location.search).then(wasSuccessful => {
			setDidFetchToken(wasSuccessful);
			setLoading(false);
			setTimeout(() => {
				Router.push("/");
			}, 1500)
		}).catch(() => {
			setDidFetchToken(false);
			setLoading(false);
		});
	}, []);

	if(isLoading) return <AwaitingBody />;

	return (
		<AuthBody success={didFetchToken} />
	);
}

const AuthBody = (props:{
	success:boolean | undefined
}) => {
	if (props?.success) {
		return SuccessBody();
	} else {
		return FailBody();
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

const FailBody = () => {
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
				<Link href={"/"}>
					<a>Click here to return to the homepage</a>
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


async function authorizeUser(search:string) {
	const { code, success } = checkState(search);
	if (!success) {
		return false
	}
	const res = await fetch(`${config.remBackendURL}/authorize-discord`, {
		method: "POST",
		body: JSON.stringify({
			code
		})
	});
	if (!res.ok) {
		return false
	}
	const userDetails:UserDetails = await res.json();
	localStorage.setItem("userID", userDetails.userID);
	localStorage.setItem("username", userDetails.username);
	localStorage.setItem("discriminator", userDetails.discriminator);
	localStorage.setItem("avatar", userDetails.avatar);
	localStorage.setItem("token", userDetails.token.toString());
	return true
	
}

function checkState(search:string) {
	const args = new URLSearchParams(search);
	return {
		code: args.get("code"),
		success: localStorage.getItem("oauth-state") === args.get("state")
	}
}

type ValidatedCode = {
	code: string | null;
	success: boolean;
}

export default Auth;