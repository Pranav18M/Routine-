const { getMessaging } = require('../config/firebase');

/**
 * Sends a push notification to a single FCM token
 */
async function sendPushNotification({ fcmToken, title, body, data = {} }) {
  if (!fcmToken) {
    console.warn('sendPushNotification: no FCM token provided, skipping');
    return null;
  }

  const messaging = getMessaging();
  if (!messaging) {
    console.warn('FCM not initialized — push notification skipped');
    return null;
  }

  const message = {
    token: fcmToken,
    notification: { title, body },
    data: Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, String(v)])
    ),
    android: {
      priority: 'high',
      notification: {
        channelId: 'routineos-habits',
        priority: 'high',
      },
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1,
        },
      },
    },
  };

  try {
    const response = await messaging.send(message);
    return response;
  } catch (error) {
    if (error.code === 'messaging/registration-token-not-registered') {
      console.warn('FCM token expired or invalid:', fcmToken.substring(0, 20));
      return { invalidToken: true };
    }
    console.error('FCM send error:', error.message);
    throw error;
  }
}

/**
 * Sends push notifications to multiple FCM tokens in batch
 */
async function sendMulticastNotification({ fcmTokens, title, body, data = {} }) {
  const messaging = getMessaging();
  if (!messaging) {
    console.warn('FCM not initialized — multicast skipped');
    return null;
  }

  const validTokens = fcmTokens.filter(Boolean);
  if (validTokens.length === 0) return null;

  const message = {
    tokens: validTokens,
    notification: { title, body },
    data: Object.fromEntries(
      Object.entries(data).map(([k, v]) => [k, String(v)])
    ),
    android: { priority: 'high' },
  };

  try {
    const response = await messaging.sendEachForMulticast(message);
    console.log(`Multicast: ${response.successCount} sent, ${response.failureCount} failed`);
    return response;
  } catch (error) {
    console.error('FCM multicast error:', error.message);
    throw error;
  }
}

/**
 * Sends the morning briefing notification
 */
async function sendMorningBriefing({ fcmToken, userName, briefingText }) {
  return sendPushNotification({
    fcmToken,
    title: `Good morning, ${userName?.split(' ')[0] || 'there'} 👋`,
    body: briefingText.split('\n')[0], // First line only for notification
    data: { type: 'morning_briefing', fullText: briefingText },
  });
}

/**
 * Sends a buddy nudge notification
 */
async function sendBuddyNudge({ fcmToken, senderName }) {
  return sendPushNotification({
    fcmToken,
    title: 'Buddy Nudge 👊',
    body: `${senderName} is checking in on you. Time to crush your habits!`,
    data: { type: 'buddy_nudge' },
  });
}

/**
 * Sends an alert when a buddy hasn't logged in 24h
 */
async function sendBuddyInactiveAlert({ fcmToken, buddyName }) {
  return sendPushNotification({
    fcmToken,
    title: 'Your buddy needs support 💙',
    body: `${buddyName} hasn't logged their habits today. Send them a nudge!`,
    data: { type: 'buddy_inactive', buddyName },
  });
}

module.exports = {
  sendPushNotification,
  sendMulticastNotification,
  sendMorningBriefing,
  sendBuddyNudge,
  sendBuddyInactiveAlert,
};