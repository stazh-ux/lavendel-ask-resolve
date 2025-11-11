import { supabase } from "@/integrations/supabase/client";
import { User, Session } from '@supabase/supabase-js';

export const authService = {
  signUp: async (email: string, password: string, firstName: string, lastName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName,
          last_name: lastName,
        }
      }
    });

    if (error) return { error };
    if (!data.user) return { error: new Error("User creation failed") };

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: data.user.id,
        email: email,
        first_name: firstName,
        last_name: lastName,
      });

    if (profileError) return { error: profileError };

    return { data, error: null };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  },

  getCurrentUser: async (): Promise<{ user: User | null, error: any }> => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  }
};

export const profileService = {
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data, error };
  },

  isAdmin: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();
    return { isAdmin: !!data, error };
  }
};

export const problemService = {
  createProblem: async (title: string, description: string, userId: string) => {
    const { data, error } = await supabase
      .from('problems')
      .insert({
        title,
        description,
        user_id: userId,
      })
      .select()
      .single();
    return { data, error };
  },

  getAllProblems: async () => {
    const { data, error } = await supabase
      .from('problems')
      .select(`
        *,
        problem_attachments (*)
      `)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  updateProblem: async (problemId: string, adminResponse: string, status: string) => {
    const { data, error } = await supabase
      .from('problems')
      .update({
        admin_response: adminResponse,
        status,
      })
      .eq('id', problemId)
      .select()
      .single();
    return { data, error };
  },

  uploadAttachment: async (problemId: string, file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${problemId}/${Math.random()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('problem-attachments')
      .upload(fileName, file);

    if (uploadError) return { error: uploadError };

    const { data: { publicUrl } } = supabase.storage
      .from('problem-attachments')
      .getPublicUrl(fileName);

    const { error: dbError } = await supabase
      .from('problem_attachments')
      .insert({
        problem_id: problemId,
        file_name: file.name,
        file_path: fileName,
        file_size: file.size,
        mime_type: file.type,
      });

    if (dbError) return { error: dbError };

    return { publicUrl, error: null };
  }
};
