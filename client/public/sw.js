self.addEventListener("push", (event) => {
  if (!event.data) {
    return;
  }

  try {
    const data = event.data.json();

    const title = data.title || "RobMorFood";

    const options = {
      body: data.message || "มีการแจ้งเตือนใหม่",

      icon: "/logo.png",
      badge: "/logo.png",

      vibrate: [200, 100, 200],

      tag: data.type || "robmorfood",

      renotify: true,

      data: {
        notificationId: data.notificationId || null,
        type: data.type || null,
        deliveryId: data.deliveryId || null,
        orderId: data.orderId || null,
      },
    };

    event.waitUntil(
      self.registration.showNotification(
        title,
        options
      )
    );
  } catch (error) {
    console.error(
      "Push notification error =",
      error
    );
  }
});

self.addEventListener(
  "notificationclick",
  (event) => {
    event.notification.close();

    const data =
      event.notification.data || {};

    let url = "/";

    if (data.type === "CHAT_MESSAGE") {
      url = "/user/notification";
    }

    if (data.orderId) {
      url = `/user/orderDetail/${data.orderId}`;
    }

    event.waitUntil(
      clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      }).then((clientList) => {
        for (const client of clientList) {
          if (
            "navigate" in client &&
            "focus" in client
          ) {
            client.navigate(url);
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
);

// =====================================================
// กด Notification
// =====================================================

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true,
    }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});