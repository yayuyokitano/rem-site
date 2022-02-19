import type { NextPage } from "next";
import { useTheme } from "next-themes";
import Head from "next/head";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { getCurrentUserStrict, removeUserData } from "../helpers/util/discordAuth";
import { getGuildList, Guild, Guilds, iconURL } from "../helpers/util/discordUtil";
import { ThemeChanger } from "../helpers/util/themechanger";
import styles from "../styles/Dashboard.module.scss";

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

	if(isLoading) return <div></div>;

	return (
		<div className={styles.container}>
			<Head>
				<title>Dashboard - REM</title>
				<meta name="description" content="Meet REM, a new take on the discord bot for a new discord." />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<header className={styles.header}>
				<ThemeChanger resolvedTheme={resolvedTheme} setTheme={setTheme} buttonClass={styles.themebutton} />
			</header>

      <Sidebar
        guilds={guilds}
        setActiveLabel={setActiveLabel}
        setActiveGuild={setActiveGuild}
        setSidebarScroll={setSidebarScroll}
      />
			<GuildLabels
				className={styles.labelsidebar}
				activeLabel={activeLabel}
        guilds={guilds}
        sidebarScroll={sidebarScroll}
			/>

			<main className={styles.main}>
				<h1 className={styles.guildname}>{activeGuild?.guild.name}</h1>
			</main>
		</div>
	);


}

function Sidebar(props: { guilds:Guilds | undefined, setActiveLabel:Dispatch<SetStateAction<Guild | undefined>>, setActiveGuild:Dispatch<SetStateAction<Guild | undefined>>, setSidebarScroll:Dispatch<SetStateAction<number | undefined>>}) {
  
  const ref = useRef<HTMLElement>(null);
  
  return (
    <nav className={styles.sidebar} ref={ref} onScroll={() => props.setSidebarScroll(ref?.current?.scrollTop ?? 0)}>
      <GuildList
        guilds={props.guilds}
        setActiveLabel={props.setActiveLabel}
        setActiveGuild={props.setActiveGuild}
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
	const {className, activeLabel, guilds} = props;
	
	return (
		<ul className={className} style={{top: `${64 - (props?.sidebarScroll ?? 0)}px`}}>
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
	return (
    <li className={`${styles.guildlabel}
      ${props.active ? ` ${styles.activelabel}` : ""}
      ${props.guild.remIsMember ? "" : ` ${styles.nonmemberlabel}`}`}>
      {props.guild.guild.name}
    </li>
  );
}

function GuildList(props: { guilds:Guilds | undefined, setActiveLabel:Dispatch<SetStateAction<Guild | undefined>>, setActiveGuild:Dispatch<SetStateAction<Guild | undefined>>}) {
	const { guilds } = props;
	if (guilds === undefined) return <div></div>;
	return (
		<ul className={styles.guildlist}>
			{guilds.map((guild, index) => {
				return (
					<li key={index}
						onMouseEnter={() => props.setActiveLabel(guild)}
            onMouseLeave={() => props.setActiveLabel(void 0)}
            onClick={() => props.setActiveGuild(guild)}
						className={styles.guild}
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

export default Home;
