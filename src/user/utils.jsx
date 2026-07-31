export function cn(...classes) { return classes.filter(Boolean).join(" "); }

/* 도메인 팩 orchestration 필드 정규화 — 객체 1개(기존 팩 하위호환) 또는 배열(시나리오 여러 개) 모두 허용 */
export const orchList = (o) => (Array.isArray(o) ? o : o ? [o] : []);

/* 텍스트 계열 파일 내려받기 공용 헬퍼 — BOM을 붙여 엑셀·워드에서 한글이 깨지지 않게 한다.
   mime: 'text/plain' | 'text/tab-separated-values'(.xls) | 'application/msword'(.doc) 등 */
export function downloadTextFile(filename, text, mime = 'text/plain;charset=utf-8') {
  const url = URL.createObjectURL(new Blob(['﻿' + text], { type: mime }));
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

/* 에이전트 화면 제목·설명의 단일 승계 경로.
   이름이 허브 카드(agentCatalog)와 안쪽 화면 두 곳에 따로 정의되면 반드시 어긋난다(실제 사고 이력).
   제목 우선순위: 팩 agentContent.headerTitle > 팩 agentCatalog.name > 코어 AGENT_TEAMS.name > 컴포넌트 기본값.
   설명은 카탈로그를 승계하지 않는다 — 카드 desc는 '무엇을 하는가'(홍보 문장),
   내부 headerDesc는 '어떤 순서로 진행되는가'(작업 흐름)로 역할이 다르기 때문.
   teams: 순환 import를 피하려고 호출부가 AGENT_TEAMS를 넘긴다. */
export function agentHeader(domain, agentId, defaults = {}, teams = null) {
  const pack = domain?.agentContent?.[agentId] || {};
  const cat = domain?.agentCatalog?.[agentId] || {};
  const core = teams?.find(t => t.id === agentId) || null;
  return {
    title: pack.headerTitle || cat.name || core?.name || defaults.headerTitle || '',
    desc: pack.headerDesc || defaults.headerDesc || '',
  };
}

/* 워드(.doc)로 열리는 최소 HTML 문서 — 제목 + 본문 문단 */
export function buildDocHtml(title, body) {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const paras = String(body).split('\n').map(l => l.trim() ? `<p>${esc(l)}</p>` : '<p>&nbsp;</p>').join('\n');
  return `<html xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8">
<title>${esc(title)}</title>
<style>body{font-family:'맑은 고딕',Malgun Gothic,sans-serif;font-size:11pt;line-height:1.6}
h1{font-size:15pt}p{margin:0 0 6pt}</style></head>
<body><h1>${esc(title)}</h1>
${paras}
</body></html>`;
}

/* 데이터 보안 등급 체계 (정보공개법 제9조 기반) */
export const SECURITY_LEVELS = {
  C: { label:"기밀", code:"C", bg:"bg-red-600",    text:"text-red-700",    border:"border-red-200",    light:"bg-red-50",    dot:"bg-red-500",    desc:"법률상 비밀 / 안보·국방·외교·국민 생명·안전",       fullDesc:"법률상 비밀·비공개 / 안보·국방·외교·국민 생명·안전과 직결" },
  S: { label:"민감", code:"S", bg:"bg-orange-500", text:"text-orange-700", border:"border-orange-200", light:"bg-orange-50", dot:"bg-orange-400", desc:"개인정보·경영비밀 등 비공개 정보",                   fullDesc:"개인·국가 이익 침해 가능한 비공개 정보 (개인정보·경영비밀 등)" },
  O: { label:"공개", code:"O", bg:"bg-green-600",  text:"text-green-700",  border:"border-green-200",  light:"bg-green-50",  dot:"bg-green-500",  desc:"기밀·민감 외 공개 가능한 정보",                     fullDesc:"기밀·민감 외 공개 가능한 모든 정보" },
};

import React from "react";
export const SecurityBadge = ({ level, size = "sm" }) => {
  const cfg = SECURITY_LEVELS[level] || { bg:"bg-slate-400", label:"미분류", code:"?" };
  const sz = size === "xs" ? "text-[8px] px-1.5 py-0.5"
           : size === "md" ? "text-[11px] px-2.5 py-1"
           : "text-[9px] px-1.5 py-0.5";
  return (
    <span className={`${cfg.bg} text-white ${sz} rounded font-black tracking-wide shrink-0 leading-none whitespace-nowrap`}>
      {cfg.label}({cfg.code})
    </span>
  );
};
