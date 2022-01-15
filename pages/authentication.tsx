import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { checkState } from "../helpers/auth";
import { AuthState } from "../helpers/types/states";
import styles from "../styles/Auth.module.scss";

const Auth: NextPage = () => {

  const [data, setData] = useState<AuthState>();
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setData(checkState(window.location.search));
    setLoading(false);
  }, []);

  if(isLoading) return <div></div>

  return (
    <div className={styles.container}>
      <Head>
        <title>REM - Authentication succeeded</title>
        <meta name="description" content="Meet REM, an innovative bot for new needs." />
        <meta name="robots" content="noindex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AuthBody data={data} />
      
    </div>
  );
}

const AuthBody = (props:{
  data:AuthState | undefined
}) => {
  if (props?.data?.success && props.data.code) {
    return SuccessBody(props.data);
  } else {
    return FailBody();
  }
}

const SuccessBody = (data:AuthState) => {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Authentication succeeded.</h1>
      <p>Please wait to be redirected.</p>
      {data.code}
    </main>
  );
}

const FailBody = () => {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Authentication failed.</h1>
      <p>Please note you could have been clickjacked.</p>
      <p>Please try again.</p>
    </main>
  );
}

export default Auth;