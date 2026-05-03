import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Admin',
      credentials: {
        username: { label: 'Usuário', type: 'text' },
        password: { label: 'Senha',   type: 'password' },
      },
      async authorize(credentials) {
        const ok =
          credentials?.username === process.env.ADMIN_USERNAME &&
          credentials?.password === process.env.ADMIN_PASSWORD
        if (ok) return { id: '1', name: 'Admin', email: 'admin@eventoslivres.com' }
        return null
      },
    }),
  ],
  pages: { signIn: '/admin/login' },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }