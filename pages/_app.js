import "@/styles/globals.css";
import Head from "next/head";
import { useEffect, useState, createContext, useContext } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);

function NavBar() {
  const { user, isCreator } = useUser();
  return (
    <header>
      <nav className="container">
        <div className="row" style={{justifyContent: "space-between", width: "100%"}}>
          <Link href="/" className="brand">AnjaliTube</Link>
          <div className="row">
            <Link className="pill" href="/">Dashboard</Link>
            <Link className="pill" href="/search">Search</Link>
            {isCreator ? <Link className="pill" href="/upload">Upload</Link> : null}
            {!user && <Link className="pill" href="/login">Sign in</Link>}
            {user && (
              <button className="pill" onClick={() => signOut(auth)}>Sign out</button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (typeof window !== "undefined") {
        const v = localStorage.getItem("qtube_is_creator") === "true";
        setIsCreator(v);
      }
    });
    return () => unsub();
  }, []);

  return (
<UserContext.Provider value={{ user, isCreator, setIsCreator }}>
  <Head>
    <title>AnjaliTube</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0b0b0f" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap"
      rel="stylesheet"
    />
  </Head>

  <NavBar />
  <main className="container">
    <Component {...pageProps} />
  </main>
  <footer>AnjaliTube • UI refresh powered by Inter &amp; glass cards</footer>
</UserContext.Provider>

  );
}
