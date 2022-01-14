import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {

  return (
    <div className={styles.container}>
      <Head>
        <title>REM - discord bot</title>
        <meta name="description" content="Meet REM, an innovative bot for new needs." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <header className={styles.header}>login</header>

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
            <a href="https://github.com/yayuyokitano" target="_blank">yayuyokitano</a>
            &nbsp;in the likeness of&nbsp;
            <a href="https://twitter.com/KITANO_REM" target="_blank">KITANO REM</a> 🤍
          </span>
        </footer>
      </main>
    </div>
  )
}

export default Home
