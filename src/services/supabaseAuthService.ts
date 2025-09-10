import { supabase } from '@/lib/supabase';
import type { User, AuthError } from '@supabase/supabase-js';

export class SupabaseAuthService {
  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string): Promise<{ user: User | null; error: AuthError | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return {
      user: data.user,
      error,
    };
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    
    return user;
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  /**
   * Check if user is admin
   * For this simple case, we'll check if the user email ends with @rutgers.edu
   * In a real application, you'd have proper role-based access control
   */
  static async isAdmin(): Promise<boolean> {
    const user = await this.getCurrentUser();
    if (!user?.email) return false;
    
    // Simple admin check - in production, use proper role management
    return user.email.endsWith('@rutgers.edu') || user.email.includes('admin');
  }
}