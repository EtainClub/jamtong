import type { Claim } from "@/content/schema";
import type { Policy } from "@/content/policies/schema";

/**
 * 정책 데이터를 위키 페이지 본문(마크다운)으로 옮긴다.
 *
 * 정책 페이지는 에이전트가 따로 쓰지 않는다. `src/content/policies`의 claim이
 * 그대로 문장이 되고, 각 문장 끝에 그 claim의 출처가 `^[source:…]`로 붙는다.
 * 그래서 근거 없는 문장이 끼어들 자리가 없고, 데이터를 고치면 페이지도 바로 바뀐다.
 */

function cite(claim: Claim): string {
  return claim.sourceIds.map((id) => `^[source:${id}]`).join(" ");
}

function line(claim: Claim): string {
  return `- ${claim.text} ${cite(claim)}`;
}

export function policyMarkdown(policy: Policy): string {
  const byId = new Map(policy.claims.map((c) => [c.id, c]));
  const L: string[] = [];

  L.push(`# ${policy.title}`, "");
  L.push(`${policy.scope}. 기준일 ${policy.asOf}.`);
  if (policy.ministries.length > 0) L.push(`소관 ${policy.ministries.join("·")}.`);
  if (policy.origin) {
    const where = policy.origin.url.replace(/^https?:\/\//, "");
    L.push(`${policy.origin.name}(${where})의 정책 항목을 옮겨 왔습니다. 내용은 원본과 같습니다.`);
  }

  const unverified = policy.claims.filter((c) => !c.verified).length;
  if (unverified > 0) {
    L.push(
      "",
      `이 페이지의 사실 ${policy.claims.length}건 가운데 ${unverified}건은 편집팀이 ` +
        "1차 자료와 아직 대조하지 않았습니다. 언론 보도와 공공기관 안내를 근거로 적었습니다.",
    );
  }

  const shown = new Set<string>();
  if (policy.rumors.length > 0) {
    L.push("", "## 도는 주장과 확인된 것");
    for (const rumor of policy.rumors) {
      L.push("", `### 도는 주장 — 「${rumor.text}」`, "");
      for (const id of rumor.claimIds) {
        const claim = byId.get(id);
        if (!claim) continue;
        L.push(line(claim));
        shown.add(id);
      }
    }
  }

  const critiques = new Set(policy.critiqueIds);
  const rest = policy.claims.filter((c) => !shown.has(c.id) && !critiques.has(c.id));
  if (rest.length > 0) {
    L.push("", "## 확인된 사실", "");
    for (const claim of rest) L.push(line(claim));
  }

  const critiqueClaims = policy.claims.filter((c) => critiques.has(c.id) && !shown.has(c.id));
  if (critiqueClaims.length > 0) {
    L.push("", "## 비판과 한계", "");
    for (const claim of critiqueClaims) L.push(line(claim));
  }

  if (policy.timeline.length > 0) {
    L.push("", "## 경과", "", "| 날짜 | 내용 |", "|---|---|");
    for (const event of [...policy.timeline].sort((a, b) => a.date.localeCompare(b.date))) {
      const sources = [
        ...new Set(event.claimIds.flatMap((id) => byId.get(id)?.sourceIds ?? [])),
      ];
      const notes = sources.map((id) => `^[source:${id}]`).join(" ");
      L.push(`| ${event.displayDate ?? event.date} | **${event.title}** ${event.summary} ${notes} |`);
    }
  }

  if (policy.gaps.length > 0) {
    L.push("", "## 아직 확인하지 못한 것", "");
    for (const gap of policy.gaps) L.push(`- ${gap}`);
  }

  return L.join("\n") + "\n";
}
