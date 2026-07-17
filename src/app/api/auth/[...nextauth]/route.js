import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import db from "@/lib/db";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        try {
          const result = await db.execute({
            sql: "SELECT * FROM users WHERE email = ?",
            args: [credentials.email],
          });
          
          if (result.rows.length === 0) return null;
          
          const user = result.rows[0];
          const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
          
          if (!passwordsMatch) return null;
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            image: user.profile_pic,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        try {
          // Check if user exists
          const existingUser = await db.execute({
            sql: "SELECT * FROM users WHERE email = ?",
            args: [user.email],
          });

          if (existingUser.rows.length === 0) {
            // Create user
            await db.execute({
              sql: "INSERT INTO users (name, email, password, profile_pic) VALUES (?, ?, ?, ?)",
              args: [user.name, user.email, "OAUTH_USER", user.image || ""],
            });
          }
          return true;
        } catch (error) {
          console.error("Error saving Google user to DB:", error);
          return false;
        }
      }
      return true; // Credentials auth
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        try {
            const dbUser = await db.execute({
                sql: "SELECT id, name, email, age, blood_type, gender, profile_pic, role FROM users WHERE email = ?",
                args: [session.user.email]
            });
            if (dbUser.rows.length > 0) {
                session.user.dbId = dbUser.rows[0].id;
                session.user.age = dbUser.rows[0].age;
                session.user.blood_type = dbUser.rows[0].blood_type;
                session.user.gender = dbUser.rows[0].gender;
                session.user.role = dbUser.rows[0].role;
                if (!session.user.image) {
                   session.user.image = dbUser.rows[0].profile_pic;
                }
            }
        } catch(e) {
            console.error(e);
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
