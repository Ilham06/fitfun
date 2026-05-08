import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.onboardingDone = user.onboardingDone;
      }
      if (trigger === "update" || !token.onboardingDone) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { onboardingDone: true },
        });
        if (dbUser) {
          token.onboardingDone = dbUser.onboardingDone;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.onboardingDone = token.onboardingDone;
      }
      return session;
    },
  },
});
