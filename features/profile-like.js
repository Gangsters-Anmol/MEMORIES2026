/**
 * features/profile-like.js — Profile Liking System
 * Users can like each other's profiles
 */

import { db } from '../firebase-config.js';
import { onAuthChange, currentUser, currentProfile, showToast } from '../auth.js';
import {
  doc, updateDoc, getDoc, arrayUnion, arrayRemove, increment, addDoc,
  collection, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js';

// Handle profile like button clicks (delegated)
document.addEventListener('click', async e => {
  const btn = e.target.closest('.profile-like-btn');
  if (!btn) return;
  e.stopPropagation();

  if (!currentUser) { showToast('Login to like profiles'); return; }

  const targetUid = btn.dataset.uid;
  if (!targetUid) return;
  if (targetUid === currentUser.uid) { showToast("Can't like your own profile 😊"); return; }

  const liked = btn.classList.contains('liked');
  btn.disabled = true;

  try {
    const targetRef = doc(db, 'users', targetUid);
    const myRef = doc(db, 'users', currentUser.uid);

    if (liked) {
      // Unlike
      await updateDoc(targetRef, {
        profileLikes: increment(-1),
        profileLikedBy: arrayRemove(currentUser.uid)
      });
      btn.classList.remove('liked');
      btn.innerHTML = '🤍 Like';
      const current = parseInt(btn.dataset.count || '0') - 1;
      btn.dataset.count = Math.max(0, current);
    } else {
      // Like
      await updateDoc(targetRef, {
        profileLikes: increment(1),
        profileLikedBy: arrayUnion(currentUser.uid)
      });
      btn.classList.add('liked');
      btn.innerHTML = '❤️ Liked';
      const current = parseInt(btn.dataset.count || '0') + 1;
      btn.dataset.count = current;

      // Send notification
      const targetSnap = await getDoc(targetRef);
      const targetData = targetSnap.data();
      if (targetData) {
        await addDoc(collection(db, 'users', targetUid, 'notifications'), {
          type: 'profile_like',
          fromUid: currentUser.uid,
          fromName: currentProfile?.displayName || currentUser.email,
          fromAvatar: currentProfile?.photoURL || null,
          message: 'liked your profile',
          read: false,
          createdAt: serverTimestamp()
        });
      }
      showToast('Profile liked! ❤️');
    }
  } catch(e) {
    showToast('Error: ' + e.message);
  } finally {
    btn.disabled = false;
  }
});

// Render profile like button (used in profile.html and profile tab)
export async function renderProfileLikeBtn(targetUid) {
  if (!currentUser || targetUid === currentUser.uid) return '';

  try {
    const snap = await getDoc(doc(db, 'users', targetUid));
    const data = snap.data();
    const likes = data?.profileLikes || 0;
    const liked = data?.profileLikedBy?.includes(currentUser.uid) || false;

    return `<button class="profile-like-btn ${liked ? 'liked' : ''}" 
                    data-uid="${targetUid}" 
                    data-count="${likes}">
      ${liked ? '❤️ Liked' : '🤍 Like'} ${likes > 0 ? `(${likes})` : ''}
    </button>`;
  } catch(e) {
    return '';
  }
}
