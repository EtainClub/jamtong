import assert from "node:assert/strict";
import { test } from "node:test";
import { roomBgm } from "@/lib/firebase/roomBgm";
import { leaveGardenSound, musicGrid, quietGardenMusic, setGardenSound, setGardenTrack } from "./feedback";

const tick = () => new Promise<void>((resolve) => setImmediate(resolve));
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}

test("스트리밍 BGM: 꺼져 있을 때 지연 조회, 늦은 Storage URL 취소, 덕킹·숨김·전환·오류 안내", async (t) => {
  const created: FakeAudio[] = [];
  const urlCalls: Array<{ path: string; next: ReturnType<typeof deferred<string | null>> }> = [];
  class FakeAudio {
    src = "";
    preload = "";
    loop = false;
    volume = 1;
    currentTime = 0;
    paused = true;
    playCalls = 0;
    pauseCalls = 0;
    onerror: (() => void) | null = null;
    constructor() { created.push(this); }
    play() { this.paused = false; this.playCalls++; return Promise.resolve(); }
    pause() { this.paused = true; this.pauseCalls++; }
    removeAttribute(name: string) { if (name === "src") this.src = ""; }
    load() {}
  }
  class Param {
    value = 1;
    setValueAtTime() {}
    setTargetAtTime() {}
    exponentialRampToValueAtTime() {}
    linearRampToValueAtTime() {}
    cancelScheduledValues() {}
  }
  class Node {
    gain = new Param();
    frequency = new Param();
    connect(node: Node) { return node; }
    disconnect() {}
    start() {}
    stop() {}
  }
  class Context {
    currentTime = 0;
    state = "running";
    destination = new Node();
    createGain() { return new Node(); }
    createOscillator() { return new Node(); }
    createBuffer() { return {}; }
    createBufferSource() { return new Node(); }
    resume() { return Promise.resolve(); }
    suspend() { return Promise.resolve(); }
  }
  const browser = Object.assign(new EventTarget(), { AudioContext: Context });
  const doc = Object.assign(new EventTarget(), { hidden: false });
  const descriptors = ["window", "document", "Audio"].map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const);
  Object.defineProperty(globalThis, "window", { configurable: true, value: browser });
  Object.defineProperty(globalThis, "document", { configurable: true, value: doc });
  Object.defineProperty(globalThis, "Audio", { configurable: true, value: FakeAudio });
  t.mock.method(roomBgm, "url", (path: string) => {
    const next = deferred<string | null>();
    urlCalls.push({ path, next });
    return next.promise;
  });

  let errors = 0;
  browser.addEventListener("garden-music-error", () => errors++);

  try {
    // 꺼져 있을 때는 Storage 주소를 조회하지도, 오디오를 만들지도 않는다.
    setGardenTrack("song-together-road");
    assert.equal(urlCalls.length, 0);
    assert.equal(created.length, 0);

    // 켜면 Storage 주소를 조회하고, 응답 전에 다른 곡으로 바꾸면 늦은 응답을 무시한다.
    setGardenSound(true, false);
    assert.equal(urlCalls.length, 1);
    assert.equal(urlCalls[0].path, "bgm/catalog/together-road.mp3");

    setGardenTrack("record-jazz");
    assert.equal(urlCalls[1].path, "bgm/catalog/jazz.mp3");
    urlCalls[1].next.resolve("https://storage.example/jazz.mp3");
    await tick();
    assert.equal(created.length, 1);
    const el = created[0];
    assert.equal(el.preload, "none");
    assert.equal(el.src, "https://storage.example/jazz.mp3");
    assert.equal(el.loop, true);
    assert.equal(el.paused, false);
    assert.equal(musicGrid(), null, "스트리밍 곡에는 합성곡 박자를 적용하지 않는다");

    // 늦게 도착한 together-road URL이 jazz 재생을 덮어쓰지 않는다.
    urlCalls[0].next.resolve("https://storage.example/together-road.mp3");
    await tick();
    assert.equal(el.src, "https://storage.example/jazz.mp3");

    // 음량 덕킹 및 복원.
    const baseVolume = el.volume;
    const restore = quietGardenMusic();
    assert.ok(el.volume < baseVolume);
    restore();
    assert.equal(el.volume, baseVolume);

    // 페이지 숨김·복귀.
    doc.hidden = true;
    doc.dispatchEvent(new Event("visibilitychange"));
    assert.equal(el.paused, true);
    doc.hidden = false;
    doc.dispatchEvent(new Event("visibilitychange"));
    assert.equal(el.paused, false);

    // Storage 곡 재생: URL 캐시 이후 재시작 시 추가 조회 없이 즉시 재생.
    setGardenTrack("song-together-road");
    assert.equal(urlCalls.length, 3);
    urlCalls[2].next.resolve("https://storage.example/together-road.mp3");
    await tick();
    assert.equal(el.src, "https://storage.example/together-road.mp3");
    assert.equal(el.paused, false);

    setGardenSound(false, false);
    assert.equal(el.paused, true);
    assert.equal(el.src, "");

    setGardenSound(true, false);
    assert.equal(urlCalls.length, 3, "한 번 받은 Storage URL은 세션 동안 재사용한다");
    assert.equal(el.src, "https://storage.example/together-road.mp3");
    assert.equal(el.paused, false);

    // 오디오 요소 오류 시 안내 이벤트.
    el.onerror?.();
    assert.equal(errors, 1);
    assert.equal(el.paused, true);

    leaveGardenSound();
    assert.equal(el.paused, true);
  } finally {
    leaveGardenSound();
    for (const [key, descriptor] of descriptors) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});
