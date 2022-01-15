import type { NextPage } from "next";
import { useTheme } from "next-themes";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getNewState } from "../helpers/auth";
import { IndexState } from "../helpers/types/states";
import { ThemeChanger } from "../helpers/util/themechanger";
import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {

  const [data, setData] = useState<IndexState>();
  const [isLoading, setLoading] = useState(false);
  const {resolvedTheme, setTheme} = useTheme();
  useEffect(() => {
    setLoading(true);
    setData({
      state: getNewState()
    });
    setLoading(false);
  }, []);

  if(isLoading) return <div></div>

  return (
    <div className={styles.container}>
      <Head>
        <title>REM - discord bot</title>
        <meta name="description" content="Meet REM, a new take on the discord bot for a new discord." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <header className={styles.header}>
          <ThemeChanger resolvedTheme={resolvedTheme} setTheme={setTheme} buttonClass={styles.themebutton} />
          <a href={`https://discord.com/api/oauth2/authorize?client_id=541298511430287395&redirect_uri=https%3A%2F%2Frem.fm%2Fauthentication&response_type=code&scope=identify%20guilds&state=${data?.state}`} target="_blank" rel="noreferrer">login</a></header>

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
            &nbsp;{resolvedTheme === "light" ? "💜" : "🤍"}
          </span>
        </footer>
      </main>
    </div>
  )
}

export default Home
