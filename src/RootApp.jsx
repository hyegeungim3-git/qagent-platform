/**
 * RootApp.jsx
 * AgentQ 생성형 AI 플랫폼 — 최상위 진입점 (도메인 중립 코어)
 * 사용자 포털(UserApp) ↔ AgentQ 관리자 시스템(App) 전환 + 도메인 팩 선택 관리
 */
import React, { useState, useEffect, Suspense, lazy } from "react";
import { Shield, User, ArrowRight, Lock, CheckCircle2, Layers } from "lucide-react";
import { DOMAINS, DOMAIN_LIST, getDomain, getDomainList, getActiveDomainId, setActiveDomainId } from "./domains/index.js";
import { parseRoute, syncHash, sameRoute, DEFAULT_ADMIN_ID } from "./router.js";

// 코드 스플리팅: 초기 로드 사이즈 축소
const UserApp = lazy(() => import("./UserApp"));
const AgentQAdmin = lazy(() => import("./App"));

function cn(...classes) { return classes.filter(Boolean).join(" "); }

/* ------------------------------------------------------------------ */
/* DOMAIN SWITCHER (데모 도메인 전환)                                   */
/* ------------------------------------------------------------------ */
const DomainSwitcher = ({ domain, onChange }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/80 border border-slate-200 shadow-sm backdrop-blur">
    <Layers className="w-4 h-4 text-slate-400 shrink-0" />
    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider shrink-0">데모 도메인</span>
    <div className="flex items-center gap-1">
      {getDomainList().map(d => (
        <button
          key={d.id}
          onClick={() => onChange(d.id)}
          className={cn(
            "px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all",
            domain.id === d.id ? "text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
          )}
          style={domain.id === d.id ? { backgroundColor: d.brandColor } : undefined}
        >
          {d.sectorLabel || d.orgName}
        </button>
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* PORTAL SELECTOR (최초 진입 화면)                                    */
/* ------------------------------------------------------------------ */
const PortalSelector = ({ domain, onChangeDomain, onSelectUser, onSelectAdmin }) => {
  const [hovered, setHovered] = useState(null);

  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 relative overflow-hidden"
      style={{ fontFamily: "'Pretendard Variable', 'Pretendard', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif" }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-slate-100/60 rounded-full blur-2xl"></div>
      </div>

      {/* Domain switcher — 우상단 고정 */}
      <div className="absolute top-6 right-6 z-20">
        <DomainSwitcher domain={domain} onChange={onChangeDomain} />
      </div>

      <main className="relative z-10 w-full max-w-3xl px-6 flex flex-col items-center">
        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl mb-6 border-4" style={{ backgroundColor: domain.brandColor, borderColor: `${domain.brandColor}33` }}>
            {/* 지구본 로고 (도메인 중립) */}
            <svg viewBox="0 0 28 28" fill="none" className="w-12 h-12">
              <circle cx="14" cy="14" r="10.5" stroke="white" strokeWidth="1.8" fill="none"/>
              <path d="M14 3.5 Q10 14 14 24.5" stroke="white" strokeWidth="1.1" fill="none" opacity="0.65"/>
              <path d="M14 3.5 Q18 14 14 24.5" stroke="white" strokeWidth="1.1" fill="none" opacity="0.65"/>
              <path d="M3.5 14 Q14 11 24.5 14" stroke="white" strokeWidth="1.1" fill="none" opacity="0.65"/>
              <path d="M6 9 Q14 7 22 9" stroke="white" strokeWidth="0.7" fill="none" opacity="0.4"/>
              <path d="M6 19 Q14 21 22 19" stroke="white" strokeWidth="0.7" fill="none" opacity="0.4"/>
            </svg>
          </div>
          <div className="flex items-baseline gap-3 mb-3">
            {/* 솔루션명 고정 + 조직명 — 어느 분야에나 적용되는 제품임을 첫 화면에서 드러낸다 */}
            <span className="text-4xl font-black tracking-[0.15em]" style={{ color: domain.brandColor }}>AgentQ</span>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">{domain.sectorLabel || domain.orgName}</h1>
          </div>
          <p className="text-[16px] text-slate-500 font-medium max-w-md leading-relaxed">
            {domain.welcome}<br />
            접속 유형을 선택해 주세요.
          </p>
          <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-green-50 border border-green-200">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[12px] font-bold text-green-700">{domain.statusBadge}</span>
          </div>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          {/* User Portal */}
          <button
            onClick={onSelectUser}
            onMouseEnter={() => setHovered("user")}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "group p-8 rounded-3xl border-2 text-left transition-all duration-300 relative overflow-hidden",
              hovered === "user"
                ? "border-blue-400 shadow-2xl shadow-blue-100 -translate-y-1 bg-white"
                : "border-slate-200 bg-white shadow-md hover:shadow-xl"
            )}
          >
            {/* Accent bar */}
            <div className={cn("absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl transition-all duration-300", hovered === "user" ? "bg-blue-600" : "bg-blue-300")}></div>

            <div className="flex items-center gap-4 mb-5">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-sm", hovered === "user" ? "bg-blue-600 border-blue-700 text-white" : "bg-blue-50 border-blue-100 text-blue-600")}>
                <User className="w-7 h-7" />
              </div>
              <div>
                <div className="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-1">일반 직원</div>
                <h2 className="text-[22px] font-black text-slate-900 tracking-tight leading-tight">사용자 포털</h2>
              </div>
            </div>

            <p className="text-[14px] text-slate-600 font-medium leading-relaxed mb-6">
              업무 질의응답, 문서 검토, 번역·요약, 보고서 작성 등<br />
              일상 업무를 AI로 간편하게 처리하세요.
            </p>

            <div className="space-y-2 mb-6">
              {domain.userFeatures.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className={cn("flex items-center justify-between pt-4 border-t transition-colors", hovered === "user" ? "border-blue-100" : "border-slate-100")}>
              <span className={cn("text-[13px] font-black transition-colors", hovered === "user" ? "text-blue-600" : "text-slate-500")}>사용자 포털 입장</span>
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300", hovered === "user" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500")}>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </button>

          {/* Admin Portal */}
          <button
            onClick={onSelectAdmin}
            onMouseEnter={() => setHovered("admin")}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "group p-8 rounded-3xl border-2 text-left transition-all duration-300 relative overflow-hidden",
              hovered === "admin"
                ? "border-indigo-400 shadow-2xl shadow-indigo-100 -translate-y-1 bg-white"
                : "border-slate-200 bg-white shadow-md hover:shadow-xl"
            )}
          >
            {/* Accent bar */}
            <div className={cn("absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl transition-all duration-300", hovered === "admin" ? "bg-indigo-600" : "bg-indigo-300")}></div>

            <div className="flex items-center gap-4 mb-5">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-300 shadow-sm", hovered === "admin" ? "bg-indigo-600 border-indigo-700 text-white" : "bg-indigo-50 border-indigo-100 text-indigo-600")}>
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <div className="text-[11px] font-black text-indigo-600 uppercase tracking-widest mb-1">시스템 관리자</div>
                <h2 className="text-[22px] font-black text-slate-900 tracking-tight leading-tight">관리자 시스템</h2>
              </div>
            </div>

            <p className="text-[14px] text-slate-600 font-medium leading-relaxed mb-6">
              GPU·서빙 인프라, LLM 학습·배포, 에이전트 빌더,<br />
              데이터셋·벡터DB 및 사용자 운영을 통합 관리합니다.
            </p>

            <div className="space-y-2 mb-6">
              {["대시보드 (시스템·GPU·서비스 현황)", "모델 학습·배포·서빙 파이프라인 관리", "에이전트 태스크플로우 빌더 & 워크플로우", "사용자 관리 · 승인 · 이용 통계 · 접근 로그"].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[13px] text-slate-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className={cn("flex items-center justify-between pt-4 border-t transition-colors", hovered === "admin" ? "border-indigo-100" : "border-slate-100")}>
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span className={cn("text-[13px] font-black transition-colors", hovered === "admin" ? "text-indigo-600" : "text-slate-500")}>관리자 시스템 입장</span>
              </div>
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300", hovered === "admin" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500")}>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </button>
        </div>

        {/* Footer note */}
        <div className="mt-10 text-center">
          <p className="text-[12px] text-slate-400 font-medium">
            {domain.footerNote}<br />
            모든 데이터는 내부망에서만 처리되며 외부로 전송되지 않습니다.
          </p>
        </div>
      </main>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* ROOT APP (View Router)                                              */
/* ------------------------------------------------------------------ */
const LoadingFallback = ({ domain }) => (
  <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100">
    <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl mb-4 animate-pulse" style={{ backgroundColor: domain?.brandColor || "#003087" }}>
      <span className="text-2xl font-black text-white">{(domain?.orgShort || "G")[0]}</span>
    </div>
    <p className="text-slate-500 font-bold text-[14px] tracking-wide">{domain?.orgShort || "AgentQ"} · 로딩 중…</p>
  </div>
);

const RootApp = () => {
  /* 주소(해시)가 화면 상태의 정본 — 새로고침·공유·뒤로가기가 모두 같은 화면을 연다 */
  const [route, setRoute] = useState(() => {
    const r = parseRoute();
    const id = (r.domainId && getDomain(r.domainId)) ? r.domainId : getActiveDomainId();
    return { ...r, domainId: id };
  });
  /* 브라우저 뒤로/앞으로처럼 외부에서 주소가 바뀐 경우에만 하위 앱을 새로 마운트한다 */
  const [extNonce, setExtNonce] = useState(0);

  const domainId = route.domainId;
  // 커스텀 팩(스튜디오)이 삭제된 직후에도 안전하도록 REB 폴백
  const domain = getDomain(domainId) || DOMAIN_LIST[0];
  const view = route.view;

  useEffect(() => {
    document.title = `AgentQ · ${domain.sectorLabel || domain.orgName}`;
  }, [domain]);

  // 상태 → 주소
  useEffect(() => { syncHash(route); }, [route]);

  // 주소 → 상태 (뒤로/앞으로·직접 입력)
  useEffect(() => {
    const onHash = () => {
      const next = parseRoute();
      setRoute(prev => {
        const merged = { ...next, domainId: (next.domainId && getDomain(next.domainId)) ? next.domainId : prev.domainId };
        if (sameRoute(prev, merged)) return prev;
        setExtNonce(n => n + 1);
        if (merged.domainId !== prev.domainId) setActiveDomainId(merged.domainId);
        return merged;
      });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const handleChangeDomain = (id) => {
    setDomainId2(id);
    setActiveDomainId(id);
  };
  const setDomainId2 = (id) => setRoute(r => ({ ...r, domainId: id }));
  const go = (patch) => setRoute(r => ({ ...r, ...patch }));
  const mountKey = `${domainId}-${extNonce}`;

  if (view === "USER") {
    return (
      <Suspense fallback={<LoadingFallback domain={domain} />}>
        <UserApp key={mountKey} domain={domain}
          initialTab={route.tab} initialAgentId={route.agentId}
          onRouteChange={(tab, agentId) => go({ tab, agentId })}
          onSwitchToAdmin={() => go({ view: "ADMIN", adminId: route.adminId || DEFAULT_ADMIN_ID })}
          onExitPortal={() => go({ view: "SELECTOR" })} />
      </Suspense>
    );
  }

  if (view === "ADMIN") {
    return (
      <Suspense fallback={<LoadingFallback domain={domain} />}>
        <AgentQAdmin key={mountKey} domain={domain}
          initialMenuId={route.adminId}
          onRouteChange={(adminId) => go({ adminId })}
          onSwitchToUser={() => go({ view: "USER" })}
          onExitPortal={() => go({ view: "SELECTOR" })} />
      </Suspense>
    );
  }

  return (
    <PortalSelector
      domain={domain}
      onChangeDomain={handleChangeDomain}
      onSelectUser={() => go({ view: "USER" })}
      onSelectAdmin={() => go({ view: "ADMIN" })}
    />
  );
};

export default RootApp;
