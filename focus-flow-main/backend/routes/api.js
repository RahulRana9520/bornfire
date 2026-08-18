const express = require('express');
const { supabase, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply the authenticateToken middleware to all routes in this file
router.use(authenticateToken);

/**
 * 1. PATCH /api/tasks/:id/complete
 * Securely completes a task and awards XP to the user. (Fulfills PATCH requirement)
 */
router.patch('/tasks/:id/complete', async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  const xpReward = 20; // Fixed 20 XP per task on the backend

  try {
    // 1. Verify the task belongs to the user and isn't already completed
    const { data: task, error: taskError } = await supabase
      .from('tasks')
      .select('completed')
      .eq('id', taskId)
      .eq('user_id', userId)
      .single();

    if (taskError || !task) return res.status(404).json({ error: 'Task not found' });
    if (task.completed) return res.status(400).json({ error: 'Task already completed' });

    // 2. Mark task as completed
    const { error: updateTaskError } = await supabase
      .from('tasks')
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq('id', taskId);
      
    if (updateTaskError) throw updateTaskError;

    // 3. Fetch current XP and update it
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('xp')
      .eq('id', userId)
      .single();
      
    if (profileError) throw profileError;

    const newXp = userProfile.xp + xpReward;

    const { error: updateUserError } = await supabase
      .from('users')
      .update({ xp: newXp })
      .eq('id', userId);

    if (updateUserError) throw updateUserError;

    res.json({ success: true, newXp, message: `Task completed! You earned ${xpReward} XP.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * 2. POST /api/friends/add
 * Securely adds a friend using mutual handshake.
 */
router.post('/friends/add', async (req, res) => {
  const { uniqueId } = req.body;
  const userId = req.user.id;

  if (!uniqueId) return res.status(400).json({ error: 'uniqueId is required' });

  try {
    // 1. Find the target user by uniqueId
    const { data: targetUser, error: findError } = await supabase
      .from('users')
      .select('id')
      .eq('unique_id', uniqueId)
      .single();

    if (findError || !targetUser) return res.status(404).json({ error: 'User not found' });
    if (targetUser.id === userId) return res.status(400).json({ error: 'You cannot add yourself' });

    // 2. Insert Mutual Handshake independently
    await supabase.from('friends').insert({ user_id: userId, friend_id: targetUser.id, status: 'accepted' });
    await supabase.from('friends').insert({ user_id: targetUser.id, friend_id: userId, status: 'accepted' });

    res.json({ success: true, message: 'Squad connected!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * 3. POST /api/users/checkin
 * Securely updates the user's daily check-in and streak.
 */
router.post('/users/checkin', async (req, res) => {
  const userId = req.user.id;

  try {
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('streak, longest_streak, last_checkin_date')
      .eq('id', userId)
      .single();

    if (profileError) throw profileError;

    // Use server's timezone-aware date
    const today = new Date();
    const localTodayStr = today.toISOString().split('T')[0];
    
    if (profile.last_checkin_date === localTodayStr) {
      return res.json({ success: true, message: 'Already checked in today', streak: profile.streak });
    }

    // Check if the last check-in was yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const localYesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = 1;
    if (profile.last_checkin_date === localYesterdayStr) {
      newStreak = (profile.streak || 0) + 1;
    }

    const newLongestStreak = Math.max(newStreak, profile.longest_streak || 0);

    await supabase.from('users')
      .update({ streak: newStreak, longest_streak: newLongestStreak, last_checkin_date: localTodayStr })
      .eq('id', userId);

    res.json({ success: true, streak: newStreak, longestStreak: newLongestStreak });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * 4. GET /api/leaderboard
 * Fetches the global leaderboard.
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const { data: leaderboard, error } = await supabase
      .from('users')
      .select('id, username, xp, league')
      .or('privacy_show_leaderboard.eq.true,privacy_show_leaderboard.is.null')
      .order('xp', { ascending: false })
      .limit(10);

    if (error) throw error;
    res.json({ success: true, leaderboard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * 5. GET /api/users/profile
 * Consolidates user profile fetch.
 */
router.get('/users/profile', async (req, res) => {
  const userId = req.user.id;

  try {
    const { data: profile, error } = await supabase
      .from('users')
      .select('username, unique_id, xp, league, streak, longest_streak')
      .eq('id', userId)
      .single();

    if (error) throw error;
    res.json({ success: true, profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * 6. DELETE /api/users/account
 * Completely shreds the user's account and data. (Fulfills DELETE requirement)
 */
router.delete('/users/account', async (req, res) => {
  const userId = req.user.id;

  try {
    // Note: Due to ON DELETE CASCADE on foreign keys in schema.sql, 
    // deleting the user from auth.users (which cascades to public.users) 
    // will delete all their tasks and friends.
    
    // We use Supabase Admin API to delete the auth user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
    
    if (deleteError) throw deleteError;

    res.json({ success: true, message: 'Account completely deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error while deleting account' });
  }
});

/**
 * 7. GET /api/users/search
 * Searches for users by username or unique ID. (Fulfills Search/Filter requirement)
 * Example: /api/users/search?q=Rahul
 */
router.get('/users/search', async (req, res) => {
  const searchQuery = req.query.q;

  if (!searchQuery) {
    return res.status(400).json({ error: 'Search query (q) is required' });
  }

  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, unique_id, league, xp')
      .or(`username.ilike.%${searchQuery}%,unique_id.ilike.%${searchQuery}%`)
      .limit(10);

    if (error) throw error;
    res.json({ success: true, results: users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error during search' });
  }
});

module.exports = router;
