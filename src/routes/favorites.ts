import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

export async function getFavorites(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;

    const { data: favorites, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ favorites });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function createFavorite(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { team_id, team_name } = req.body;

    if (!team_id || !team_name) {
      return res.status(400).json({ error: 'team_id and team_name are required' });
    }

    const { data: favorite, error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, team_id, team_name }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ favorite });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function deleteFavorite(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const { data: favorite } = await supabase
      .from('favorites')
      .select('user_id')
      .eq('id', id)
      .maybeSingle();

    if (!favorite) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    if (favorite.user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Favorite deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
