import type { NextPage } from "next";
import { useTheme } from "next-themes";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeChanger } from "../helpers/util/themechanger";
import styles from "../styles/Home.module.scss";
import { getCurrentUserNaive, getCurrentUserStrict, removeUserData } from "../helpers/util/discordAuth";

type IndexState = {
	type: "unauthorized";
	state: string;
} | {
	type: "authorized";
	username: string;
	discriminator: string;
	avatar: string;
}

const Home: NextPage = () => {

	const [data, setData] = useState<IndexState>();
	const [isLoading, setLoading] = useState(false);
	const {resolvedTheme, setTheme} = useTheme();
	useEffect(() => {
		setLoading(true);
		setData(getCurrentUserNaive());
		setLoading(false);
		getCurrentUserStrict().then(userData => {
			setData(userData);
		}).catch(_ => {
			removeUserData();
		});
	}, []);

	if(isLoading) return <div></div>

	return (
		<div className={styles.container}>
			<Head>
				<title>REM - discord bot</title>
				<meta name="description" content="Meet REM, a new take on the discord bot for a new discord." />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<header className={styles.header}>
				<ThemeChanger resolvedTheme={resolvedTheme} setTheme={setTheme} buttonClass={styles.themebutton} />
				<UserDisplay userData={data}/>
			</header>

			<main className={styles.main}>
				<div className={styles.profile}>
					<Image className={styles.profileimage}
						src="/rem.jpg"
						alt=""
						width={250}
						height={250}
					/>
				</div>
				
				<h1 className={styles.title}>Meet REM.</h1>
				<h2 className={styles.subtitle}>A new take on the discord bot for a new discord.</h2>

				<footer className={styles.footer}>
					<span>
						Made with love by&nbsp;
						<a href="https://github.com/yayuyokitano" target="_blank" rel="noreferrer">yayuyokitano</a>
						&nbsp;in the likeness of&nbsp;
						<a href="https://twitter.com/KITANO_REM" target="_blank" rel="noreferrer">KITANO REM</a>
						&nbsp;{resolvedTheme === "light" ? "????" : "????"}
					</span>
				</footer>
			</main>
		</div>
	)
}

function UserDisplay(props:{
	userData: IndexState | undefined;
}) {
	if (props?.userData?.type === "authorized") {
		return (		
			<Link href="/dashboard" passHref>
				<div className={styles.user}>
					<Image className={styles.avatar} src={props.userData.avatar} alt="" width={32} height={32} />
					<span className={styles.username}>{props.userData.username}#{props.userData.discriminator}</span>
				</div>
			</Link>
		)
	}
	return <a className={styles.login} href={`https://discord.com/api/oauth2/authorize?client_id=541298511430287395&redirect_uri=https%3A%2F%2Frem.fm%2Fauthorization&response_type=code&scope=guilds.members.read%20identify%20guilds&state=${props?.userData?.state}`}>login</a>
}

export default Home
