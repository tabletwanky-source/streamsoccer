import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export async function getPosts(req: Request, res: Response) {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function createPost(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { title, content, image } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const { data: user } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', userId)
      .maybeSingle();

    if (!user || !user.is_admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { data: post, error } = await supabase
      .from('posts')
      .insert([{ title, content, image: image || '' }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ post });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function deletePost(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const { data: user } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', userId)
      .maybeSingle();

    if (!user || !user.is_admin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
