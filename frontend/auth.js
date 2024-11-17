import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Github from 'next-auth/providers/github';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, Github],
  callbacks: {

    async jwt({ token, user }) {
      // If the user is signing in and has a role, store it in the JWT
      if (user) {
        token.role = user.role || null;
      }
      return token;
    },
    // Session callback to include the role in the session object
    async session({ session, token }) {
      // Transfer the role from JWT to the session
      if (token.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
});
