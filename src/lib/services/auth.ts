import { supabase } from '../supabase'
import { User, AuthError } from '@supabase/supabase-js'

export type AuthState = {
  user: User | null
  error: AuthError | null
  loading: boolean
}

export class AuthService {
  private static instance: AuthService
  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return data
    } catch (error) {
      throw error
    }
  }

  async signUp(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      return data
    } catch (error) {
      throw error
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      throw error
    }
  }

  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return session
    } catch (error) {
      throw error
    }
  }

  onAuthStateChange(callback: (state: AuthState) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      callback({
        user: session?.user ?? null,
        error: null,
        loading: false,
      })
    })
  }
}

export const authService = AuthService.getInstance()
export default authService 