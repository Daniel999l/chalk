import { Router } from 'express'
import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { User } from '../models/User.js'

passport.use(new GoogleStrategy(
  {
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // APP_URL is the single deployed domain (e.g. https://chalk.vercel.app)
    callbackURL:  `${process.env.APP_URL}/api/auth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id })
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email:    profile.emails[0].value,
          name:     profile.displayName,
          picture:  profile.photos[0]?.value || '',
        })
      }
      done(null, user)
    } catch (err) {
      done(err)
    }
  }
))

passport.serializeUser((user, done) => done(null, user._id.toString()))
passport.deserializeUser(async (id, done) => {
  try   { done(null, await User.findById(id)) }
  catch (err) { done(err, null) }
})

const router = Router()

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })
)

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/?error=auth_failed' }),
  (_req, res) => res.redirect('/')
)

router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' })
  const { _id, email, name, picture } = req.user
  res.json({ id: _id, email, name, picture })
})

router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err)
    req.session.destroy(() => {
      res.clearCookie('connect.sid')
      res.json({ ok: true })
    })
  })
})

export default router
