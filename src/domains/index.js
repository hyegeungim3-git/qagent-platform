/**
 * 도메인 팩 레지스트리
 * 코어 플랫폼(RootApp/UserApp)은 이 레지스트리를 통해서만 도메인 콘텐츠에 접근한다.
 * 새 도메인 추가 = 팩 파일 1개 작성 + 여기 등록이 전부여야 한다.
 */
import reb from "./reb.js";
import manufacturing from "./manufacturing.js";
import civic from "./civic.js";
import hospital from "./hospital.js";

export const DOMAINS = {
  [reb.id]: reb,
  [manufacturing.id]: manufacturing,
  [civic.id]: civic,
  [hospital.id]: hospital,
};

export const DOMAIN_LIST = [reb, manufacturing, civic, hospital];

const STORAGE_KEY = "genos.activeDomain";

/* ── 커스텀 팩 (도메인 팩 스튜디오) ─────────────────────────────────
 * localStorage에 { baseId, overrides }로 저장 — 직렬화 가능한 필드만
 * 오버라이드하고 아이콘·함수는 베이스 팩에서 상속한다 (JSON 한계).
 * 정식 팩 승격 시에는 스튜디오의 JSON 내보내기를 _template.js에 옮긴다. */
export const CUSTOM_PACK_KEY = "genos.customPack";
export const CUSTOM_ID = "custom";

export function loadCustomPack() {
  try {
    const raw = localStorage.getItem(CUSTOM_PACK_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    return p && p.baseId && p.overrides ? p : null;
  } catch { return null; }
}
export function saveCustomPack(pack) {
  try { localStorage.setItem(CUSTOM_PACK_KEY, JSON.stringify(pack)); } catch { /* 세션 한정 */ }
}
export function deleteCustomPack() {
  try { localStorage.removeItem(CUSTOM_PACK_KEY); } catch { /* 무시 */ }
}

/** 베이스 팩 + 오버라이드 병합 — 아이콘·함수·미지정 필드는 베이스 상속 */
export function buildCustomDomain(saved = loadCustomPack()) {
  if (!saved) return null;
  const base = DOMAINS[saved.baseId] || manufacturing;
  const ov = saved.overrides || {};
  const orchBase = Array.isArray(base.orchestration) ? base.orchestration : base.orchestration ? [base.orchestration] : [];
  return {
    ...base,
    id: CUSTOM_ID,
    orgName: ov.orgName || base.orgName,
    orgShort: ov.orgShort || base.orgShort,
    platformTitle: ov.platformTitle || base.platformTitle,
    brandColor: ov.brandColor || base.brandColor,
    welcome: ov.welcome || base.welcome,
    statusBadge: ov.statusBadge || base.statusBadge,
    footerNote: ov.footerNote || base.footerNote,
    user: { ...base.user, ...(ov.user || {}) },
    workspaces: base.workspaces.map((w, i) => (ov.workspaceNames?.[i] ? { ...w, name: ov.workspaceNames[i] } : w)),
    suggestions: base.suggestions.map((s, i) => ({ ...s, ...(ov.suggestions?.[i] || {}) })),
    orchestration: orchBase.map((o, i) => ({ ...o, ...(ov.orchestration?.[i] || {}) })),
  };
}

/** 코어가 도메인을 조회하는 유일한 경로 — 커스텀 팩 포함 */
export function getDomain(id) {
  if (id === CUSTOM_ID) return buildCustomDomain();
  return DOMAINS[id] || null;
}
/** 포털 스위처용 — 커스텀 팩이 있으면 4번째로 노출 */
export function getDomainList() {
  const custom = buildCustomDomain();
  return custom ? [...DOMAIN_LIST, custom] : DOMAIN_LIST;
}

export function getActiveDomainId() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === CUSTOM_ID && loadCustomPack()) return CUSTOM_ID;
    return saved && DOMAINS[saved] ? saved : manufacturing.id;
  } catch {
    return manufacturing.id;
  }
}

export function setActiveDomainId(id) {
  try { localStorage.setItem(STORAGE_KEY, id); } catch { /* 저장 실패 시 세션 한정 동작 */ }
}

/** 도메인 팩의 카탈로그 오버라이드를 기본 AGENT_TEAMS 위에 병합 */
export function mergeAgentTeams(baseTeams, domain) {
  const overrides = domain?.agentCatalog || {};
  return baseTeams.map(a => ({ ...a, ...(overrides[a.id] || {}) }));
}

export default DOMAINS;
