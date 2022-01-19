import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Auth.module.scss";
import * as config from "../helpers/config";

const Auth: NextPage = () => {

  const [didFetchToken, setDidFetchToken] = useState<boolean>();
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);

    authorizeUser(window.location.search).then(wasSuccessful => {
      setDidFetchToken(wasSuccessful);
      setLoading(false);
    }).catch(() => {
      setDidFetchToken(false);
      setLoading(false);
    });
  }, []);

  if(isLoading) return <AwaitingBody />;

  return (
    <div className={styles.container}>
      <Head>
        <title>REM - Authorization succeeded</title>
        <meta name="description" content="Meet REM, an innovative bot for new needs." />
        <meta name="robots" content="noindex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AuthBody success={didFetchToken} />
      
    </div>
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
    <main className={styles.main}>
      <h1 className={styles.title}>Authorizing</h1>
      <p>Please wait.</p>
    </main>
  );
}

const SuccessBody = () => {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Authorized.</h1>
      <p>Please wait to be redirected.</p>
    </main>
  );
}

const FailBody = () => {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Authorization failed.</h1>
      <p>Please note you could have been clickjacked. But most likely it was just a random error.</p>
      <p>Please try again.</p>
    </main>
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
  const res = await fetch(`${config.remURL}/authorize-discord`, {
    method: "POST",
    body: JSON.stringify({
      code: code
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