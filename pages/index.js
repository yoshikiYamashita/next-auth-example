import { signIn, signOut, useSession } from 'next-auth/client';

import Link from 'next/link';

export default function Page() {
  const [ session, loading ] = useSession();

  if(session) {
    console.log(session);
  }

  return (
    <>
      {loading && ( <div>Loading...</div> )}
      {!session && !loading && (
          <>
            <div>Not signed in</div>
            <button onClick={() => signIn()}>Sign in</button>
            <button onClick={() => signIn('google')}>Sign in with Google</button>
          </>
      )}
      {session && (
        <>
          <div>
            <h3>You signed in as</h3>
            <img src={session.user.image} alt="" />
            <p>{session.user.name}</p>
            <p>{session.user.email}</p>
          </div>
          <h2>You can now access our super secret pages</h2>
          <Link href="/secret">
            <button>Secret page</button>
          </Link>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </>
  )
}