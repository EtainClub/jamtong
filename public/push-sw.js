/*
 * 잼통 정원 알림 — 거대 잡초가 나타났을 때의 푸시를 그리고, 누르면 광장을 연다.
 * 설계는 docs/garden-raid-boss.md §8. 등록은 src/lib/firebase/push.ts.
 *
 * 이 워커는 푸시만 맡는다. fetch를 가로채지 않고 아무것도 캐시하지 않는다 — 범위도 실제 화면이
 * 없는 경로(/firebase-cloud-messaging-push-scope)라 사이트의 어느 화면도 이 워커 아래에 들지 않는다.
 * 서버는 글을 data로 싣는다(src/lib/server/push.ts). 파이어베이스 SDK 없이 그 모양만 읽는다.
 */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = (event.data ? event.data.json() : {}).data || {};
  } catch {
    // 읽지 못한 푸시도 알림은 띄운다 — 띄우지 않으면 브라우저가 푸시 권한을 거둘 수 있다.
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "잼통 광장 · 거대 잡초가 나타났어요", {
      body: data.body || "혼자서는 못 잡아요. 같이 잡아요.",
      icon: "/images/jamtong-icon-192.png",
      badge: "/images/jamtong-icon-192.png",
      tag: data.tag || "raid",
      data: { url: data.url || "/garden?tab=plaza" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  // 우리 사이트 안의 경로만 연다.
  const raw = (event.notification.data && event.notification.data.url) || "/garden?tab=plaza";
  const url = new URL(raw.startsWith("/") && !raw.startsWith("//") ? raw : "/garden?tab=plaza", self.location.origin).href;
  // 이 워커는 어느 화면도 맡지 않으므로(범위 밖) 열려 있는 탭을 옮길 수 없다. 새로 연다.
  event.waitUntil(self.clients.openWindow(url));
});
