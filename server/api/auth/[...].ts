import { NuxtAuthHandler } from '#auth'
import Auth0Provider from 'next-auth/providers/auth0'

export default NuxtAuthHandler({
    secret: process.env.AUTH_SECRET,
    providers: [
        // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
        Auth0Provider.default({
            id: 'auth0',
            clientId: process.env.AUTH0_CLIENT_ID as string,
            clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
            issuer: process.env.AUTH0_ISSUER,
            authorization: {
                params: {
                    scope: 'openid profile email offline_access', // Requesting access_token and refresh_token
                    audience: process.env.AUTH0_AUDIENCE
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, account, profile }) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            if (account && account.access_token) {
                token.account = account
                console.log(profile)
            }
            return token
        },
        async session({ session, token }) {
            // Send properties to the client, like an access_token from a provider
            session.account = token.account
            return session
        }
    }
})