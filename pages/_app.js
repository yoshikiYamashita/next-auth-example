
import { Provider as AuthProvider } from 'next-auth/client'

export default function App ({ Component, pageProps }) {
  return (
    <AuthProvider session={pageProps.session}>
      <Component {...pageProps} />
    </AuthProvider>
  )
}