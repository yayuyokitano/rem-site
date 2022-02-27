import type { NextPage } from "next";
import { useTheme } from "next-themes";
import Head from "next/head";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { getCurrentUserStrict, getNewState, removeUserData } from "../helpers/util/discordAuth";
import { getGuildList, Guild, Guilds, iconURL } from "../helpers/util/discordUtil";
import { ThemeChanger } from "../helpers/util/themechanger";
import styles from "../styles/Dashboard.module.scss";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SettingCategory } from "../helpers/settingcategory";

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

	const [user, setUser] = useState<IndexState>();
	const [activeLabel, setActiveLabel] = useState<Guild>();
	const [activeGuild, setActiveGuild] = useState<Guild>();
	const [sidebarScroll, setSidebarScroll] = useState<number>();
	const [guilds, setGuilds] = useState<Guilds>();
	const [isLoading, setLoading] = useState(false);
	const {resolvedTheme, setTheme} = useTheme();
	//initial getting of data
	useEffect(() => {
		setLoading(true);
		getCurrentUserStrict().then(userData => {
			setUser(userData);
			getGuildList().then(guildData => {
				if (guildData.type === "unauthorized") window.location.href = "/";
				setGuilds((guildData as any).guilds as Guilds);
				setLoading(false);
			});
		}).catch(_ => {
			removeUserData();
			window.location.href = "/";
		});
	}, []);

	if(isLoading) return <div className={styles.loadingwrapper}><h1 className={styles.loading}>Loading Dashboard</h1></div>;

	return (
		<div className={styles.container}>
			<Head>
				<title>Dashboard - REM</title>
				<meta name="description" content="Meet REM, a new take on the discord bot for a new discord." />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<style jsx global>{`
				body {
					overflow: hidden;
				}
			`}</style>

			<header className={styles.header}>
				<ThemeChanger resolvedTheme={resolvedTheme} setTheme={setTheme} buttonClass={styles.themebutton} />
				<h1>Dashboard</h1>
			</header>

			<Sidebar
				guilds={guilds}
				activeGuild={activeGuild}
				setActiveLabel={setActiveLabel}
				setActiveGuild={setActiveGuild}
				setSidebarScroll={setSidebarScroll}
			/>
			<div className={styles.main}>
				<GuildLabels
					className={styles.labelsidebar}
					activeLabel={activeLabel}
					guilds={guilds}
					sidebarScroll={sidebarScroll}
				/>
				<main>
					<GuildSettings guild={activeGuild} setGuild={setActiveGuild} />
				</main>
			</div>
		</div>
	);


}

function Sidebar(props: { guilds:Guilds | undefined, activeGuild?:Guild, setActiveLabel:Dispatch<SetStateAction<Guild | undefined>>, setActiveGuild:Dispatch<SetStateAction<Guild | undefined>>, setSidebarScroll:Dispatch<SetStateAction<number | undefined>>}) {
	
	const ref = useRef<HTMLElement>(null);
	const {setSidebarScroll, guilds, activeGuild, setActiveLabel, setActiveGuild} = props;
	
	return (
		<nav className={styles.sidebar} ref={ref} onScroll={() => setSidebarScroll(ref?.current?.scrollTop ?? 0)}>
			<GuildList
				guilds={guilds}
				activeGuild={activeGuild}
				setActiveLabel={setActiveLabel}
				setActiveGuild={setActiveGuild}
			/>
		</nav>
	)
}

function GuildLabels(props: {
	className?: string;
	guilds?: Guilds;
	activeLabel?: Guild;
	sidebarScroll?: number;
}) {
	const {className, activeLabel, guilds, sidebarScroll} = props;
	
	return (
		<ul className={className} style={{top: `${48 - (sidebarScroll ?? 0)}px`}}>
			{guilds?.map((guild, i) => {
				return (
					<GuildLabel
						key={i}
						guild={guild}
						active={activeLabel?.guild.name === guild.guild.name}
					/>
				);
			}
			)}
		</ul>
	);
}

function GuildLabel(props: { guild:Guild, active:boolean }) {
	const {active, guild} = props;
	return (
		<li className={`${styles.guildlabel}
			${active ? ` ${styles.activelabel}` : ""}
			${guild.remIsMember ? "" : ` ${styles.nonmemberlabel}`}`}>
			{guild.guild.name}
		</li>
	);
}

function GuildList(props: { guilds?:Guilds, activeGuild?:Guild, setActiveLabel:Dispatch<SetStateAction<Guild | undefined>>, setActiveGuild:Dispatch<SetStateAction<Guild | undefined>>}) {
	const { guilds, activeGuild, setActiveLabel, setActiveGuild } = props;
	if (guilds === undefined) return <div></div>;
	return (
		<ul className={styles.guildlist}>
			{guilds.map((guild, index) => {
				return (
					<li key={index}
						onMouseEnter={() => setActiveLabel(guild)}
						onMouseLeave={() => setActiveLabel(void 0)}
						onClick={() => setActiveGuild(guild)}
						className={`${styles.guild}${activeGuild?.guild.id === guild.guild.id ? ` ${styles.activeguild}` : ""}`}
						data-guildname={guild.guild.name}
						data-remismember={guild.remIsMember}
					>
						<Image className={styles.guildicon}
							src={iconURL(guild.guild.id, guild.guild.name, guild.guild.icon)}
							alt={guild.guild.name}
							width={48}
							height={48}
						/>
					</li>
				);
			})}
		</ul>
	);
}

function settingNavBack(setCategory:Dispatch<SetStateAction<string | undefined>>, guild?:Guild, category?:string) {

	if (category) {
		setCategory("");
		return guild;
	}

	return void 0;

}

function GuildSettings(props:{guild?:Guild, setGuild:Dispatch<SetStateAction<Guild | undefined>>}) {
	let {guild, setGuild} = props;
	const [category, setCategory] = useState<string>();

	if (typeof guild === "undefined") return <div><h3>Please select a server from the sidebar.</h3><p>You need administrator permission in a server for it to show up.</p></div>;
	return (
		<div className={styles.settings}>
			<header className={styles.settingsheader}>
				<button type="button" className={styles.navback} onClick={() => { setGuild(settingNavBack(setCategory, guild, category))}} >
					<ArrowBackIcon className={styles.arrowback} />
				</button>
				<h2 className={styles.guildname}>{guild?.guild.name}</h2>
			</header>
			{ // show invite prompt if REM is not in server, otherwise show settings.
				guild?.remIsMember ?
				<SettingCategory guild={guild} category={category} setCategory={setCategory} /> :
				<InvitePrompt guild={guild} />
			}
		</div>
	);
}

function InvitePrompt(props:{guild?:Guild}) {
	const {guild} = props;
	return (
		<div className={styles.inviteprompt}>
			<h3>Rem is not in {guild?.guild.name}!</h3>
			<a href={`https://discord.com/api/oauth2/authorize?client_id=541298511430287395&permissions=0&scope=bot%20applications.commands&response_type=code&guild_id=${guild?.guild.id}&disable_guild_select=true`} target="_blank" rel="noreferrer">
				<button type="button" className={styles.invitebutton}>＋ Invite to server</button>
			</a>
		</div>
	)
}

export default Home;
