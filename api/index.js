// Thin entry point for Vercel serverless. This is the ONLY file under api/,
// so Vercel creates exactly one function. All logic lives in ../server and
// gets bundled into this function by Vercel's import tracer.
import app from '../server/index.js'
export default app
