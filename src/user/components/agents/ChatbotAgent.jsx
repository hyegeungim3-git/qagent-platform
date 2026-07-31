import React, { useState, useRef, useEffect } from "react";
import {
  Bot, Send, Paperclip, Mic, ChevronRight, RotateCcw, Sparkles,
  ThumbsUp, ThumbsDown, Copy, Search, BookOpen, FileText, CheckCircle,
  Loader2, Radio, MessageCircle, HelpCircle,
  AlertCircle, ArrowRight, Cpu, ChevronDown, Users, X,
  Scale, ScrollText, ExternalLink, ChevronLeft
} from "lucide-react";
import AgentWorkflowPanel from "./AgentWorkflowPanel.jsx";
import { AGENT_TEAMS } from "../../data/constants.js";
import { cn } from "../../utils.jsx";


/* ─── 에이전트 파이프라인 ─── */
const AGENTS = [
  { icon: Search,   label: '의도 파악 에이전트', sub: '질의 의도 및 맥락 분석 중',     color: 'bg-indigo-600', ms: 900  },
  { icon: BookOpen, label: 'RAG 검색 에이전트',  sub: '관련 문서·규정 시맨틱 검색 중', color: 'bg-blue-600',   ms: 1400 },
  { icon: Bot,      label: '답변 생성 에이전트', sub: '근거 기반 답변 작성 중',         color: 'bg-violet-600', ms: 1200 },
];

/* ─── 출처 미리보기 데이터 ─── */
const SOURCE_PREVIEWS = {
  '표준지공시지가_조사지침.pdf': {
    title: '표준지공시지가 조사지침', type: 'PDF', pages: 48, page: 3, section: '제3조',
    excerpt: [
      { text: '제3조(조사 기준일)\n', hl: false },
      { text: '표준지공시지가의 조사·산정 기준일은 매년 1월 1일로 한다.', hl: true },
      { text: ' 다만, 국토교통부장관이 필요하다고 인정하는 경우에는 기준일을 따로 정할 수 있다.\n\n제4조(조사 방법) 표준지공시지가의 조사는 인근 지역의 지가 수준, 토지 이용 현황 및 지역 특성 등을 종합적으로 고려하여 산정한다.', hl: false },
    ],
  },
  '부동산 가격공시에 관한 법률 제3조': {
    title: '부동산 가격공시에 관한 법률', type: 'LAW', article: '제3조 제1·2항',
    excerpt: [
      { text: '제3조(표준지공시지가의 조사·공시 등)\n① 국토교통부장관은 ', hl: false },
      { text: '토지이용 상황이나 주변 환경, 그 밖의 자연적·사회적 조건이 일반적으로 유사하다고 인정되는 일단의 토지 중에서 선정한 표준지에 대하여 매년 공시기준일 현재의 적정가격을 조사·산정하고, 중앙부동산가격공시위원회의 심의를 거쳐 이를 공시', hl: true },
      { text: '하여야 한다.\n② 제1항에 따른 공시기준일은 1월 1일로 한다.', hl: false },
    ],
  },
  '취업규칙 제42조': {
    title: '한국부동산원 취업규칙', type: 'HWP', page: 18, section: '제42조',
    excerpt: [
      { text: '제42조(출장비 지급)\n① ', hl: false },
      { text: '직원이 공무 출장을 하는 경우에는 소정의 출장비를 지급한다. 출장비는 교통비, 숙박비 및 일비로 구분하며, 각 항목별 지급 기준은 별표에 따른다.', hl: true },
      { text: '\n② 출장비는 출장 종료 후 7일 이내에 정산서를 제출하여야 하며, 정산 후 잔액이 발생한 경우 즉시 반환하여야 한다.', hl: false },
    ],
  },
  '출장업무처리지침.pdf': {
    title: '출장업무처리지침', type: 'PDF', pages: 22, page: 7, section: '4.1절',
    excerpt: [
      { text: '4. 출장비 정산 절차\n\n4.1 사전 신청\n', hl: false },
      { text: '출장 3일 전까지 WorksOn 시스템에서 출장신청서를 작성하고 부서장의 승인을 받아야 한다. 긴급 출장의 경우 출발 전까지 유선 보고 후 사후 승인을 받을 수 있다.', hl: true },
      { text: '\n\n4.2 일비 기준\n- 식비: 1일 2만원 이내 (영수증 제출)\n- 숙박비: 1박 8만원 이내 (서울·수도권 10만원)\n- 교통비: 실비 지급', hl: false },
    ],
  },
  '부동산 가격공시에 관한 법률 제7조': {
    title: '부동산 가격공시에 관한 법률', type: 'LAW', article: '제7조',
    excerpt: [
      { text: '제7조(이의신청)\n① ', hl: false },
      { text: '표준지공시지가에 이의가 있는 자는 그 공시일부터 30일 이내에 서면으로 국토교통부장관에게 이의를 신청할 수 있다.', hl: true },
      { text: '\n② 국토교통부장관은 제1항에 따른 이의신청 기간이 만료된 날부터 30일 이내에 이의신청을 심사하여 그 결과를 신청인에게 서면으로 통지하여야 한다.', hl: false },
    ],
  },
  '이의신청 처리지침': {
    title: '이의신청 처리지침', type: 'PDF', section: '제2·3조',
    excerpt: [
      { text: '제2조(접수 방법)\n이의신청의 접수 방법은 다음 각 호와 같다.\n', hl: false },
      { text: '1. 온라인: 부동산공시가격알리미(www.realtyprice.kr)\n2. 서면: 한국부동산원 본사 또는 지사 방문 제출\n3. 팩스: 관할 지사 팩스번호로 전송', hl: true },
      { text: '\n\n제3조(처리 기간)\n접수일로부터 30일 이내에 처리 결과를 신청인에게 통보하여야 한다.', hl: false },
    ],
  },
  '개인정보처리방침 제5조': {
    title: '개인정보처리방침', type: 'PDF', section: '제5조',
    excerpt: [
      { text: '제5조(개인정보의 보유 기간)\n', hl: false },
      { text: 'AI 플랫폼 이용 기록(채팅 내용, 접속 로그)은 보안 정책에 따라 최대 90일간 내부 서버에 보관되며, 이후 자동 파기된다.', hl: true },
      { text: '\n단, 법령에 따라 보존이 필요한 경우 해당 기간 동안 별도 보관한다. 이용 기록은 감사·컴플라이언스 목적의 관리자 열람 외에는 제3자에게 제공되지 않는다.', hl: false },
    ],
  },
  '보안정책 3장': {
    title: '정보보안 운영 정책', type: 'PDF', section: '제12·13조',
    excerpt: [
      { text: '제3장 AI 시스템 보안\n\n제12조(사용 이력 관리)\n', hl: false },
      { text: 'AI 플랫폼의 모든 대화 이력은 내부망 전용 서버에 암호화하여 저장된다. 보안 채팅(SECURE 탭) 이용 시에는 세션 종료와 함께 해당 세션의 대화 내용이 즉시 삭제된다.', hl: true },
      { text: '\n\n제13조(접근 제어)\n관리자는 감사 목적으로만 이용 이력을 열람할 수 있으며, 무단 열람 시 징계 처분을 받는다.', hl: false },
    ],
  },
  '보안정책 제7조': {
    title: '정보보안 운영 정책', type: 'PDF', section: '제7조',
    excerpt: [
      { text: '제7조(비밀 등급 문서 처리)\n', hl: false },
      { text: '비밀 등급 문서를 AI 플랫폼에서 처리할 경우, 반드시 SECURE 탭(보안 채팅)을 이용하여야 한다. SECURE 탭에서는 내부망 전용 모델만 사용되며, 클라우드 모델로의 데이터 전송이 차단된다.', hl: true },
      { text: '\n\n비밀(S) 등급 이상의 문서 처리 시에는 보안관리관의 사전 승인이 필요하다.', hl: false },
    ],
  },
  '개인정보보호지침': {
    title: '개인정보보호 업무지침', type: 'PDF', section: '제8조',
    excerpt: [
      { text: '제8조(AI 시스템 이용 시 준수 사항)\n', hl: false },
      { text: 'AI 플랫폼에서 비밀 등급 문서를 처리한 결과물은 외부 저장 매체에 저장하거나 출력할 수 없다. 처리 결과는 업무 목적으로만 활용하여야 하며, 세션 종료 시 자동 삭제된다.', hl: true },
      { text: '\n\n위반 시 개인정보보호법 및 사내 보안 규정에 따른 징계 절차가 진행된다.', hl: false },
    ],
  },
  '부동산 가격공시에 관한 법률 제3·10조': {
    title: '부동산 가격공시에 관한 법률', type: 'LAW', article: '제3조, 제10조',
    excerpt: [
      { text: '제3조(표준지공시지가)\n표준지공시지가는 ', hl: false },
      { text: '개별공시지가 산정의 기준이 되며, 국토교통부장관이 공시한다.', hl: true },
      { text: '\n\n제10조(개별공시지가의 결정·공시 등)\n① 시장·군수 또는 구청장은 ', hl: false },
      { text: '표준지공시지가를 기준으로 산정한 개별토지의 단위면적당 가격인 개별공시지가를 결정·공시', hl: true },
      { text: '하여야 한다.', hl: false },
    ],
  },
  '업무매뉴얼_v3.2.pdf': {
    title: '한국부동산원 업무 매뉴얼 v3.2', type: 'PDF', pages: 134, page: 52, section: '6.1절',
    excerpt: [
      { text: '제6장 AI 플랫폼 활용 업무\n\n6.1 챗봇 에이전트 활용\n', hl: false },
      { text: 'AI 챗봇은 내부 지식베이스를 기반으로 업무 관련 질의응답을 제공한다. 공시지가 조사, 사내 규정, 업무 절차 등의 질문에 RAG(검색 증강 생성) 방식으로 정확한 답변을 생성한다.', hl: true },
      { text: '\n\n6.2 이용 시 주의 사항\n- 답변은 참고용이며 최종 판단은 담당자가 확인 후 결정\n- 비밀 문서는 SECURE 탭 사용', hl: false },
    ],
  },
  '한국부동산원 AI 플랫폼 운영지침': {
    title: 'AI 플랫폼 운영지침', type: 'PDF', section: '제1·2조',
    excerpt: [
      { text: '제1조(목적)\n이 지침은 ', hl: false },
      { text: '한국부동산원 생성형 AI 플랫폼의 안전하고 효율적인 운영을 위한 기준과 절차를 정함을 목적으로 한다.', hl: true },
      { text: '\n\n제2조(적용 범위)\n이 지침은 한국부동산원 임직원 전원에게 적용되며, AI 플랫폼의 모든 기능(챗봇, 보고서, 회의록, OCR 등)에 적용된다.', hl: false },
    ],
  },
};

/* ─── FAQ 데이터 ─── */
const FAQ_ITEMS = [
  {
    id: 'f1', q: '표준지공시지가 조사 기준일은 언제인가요?', category: '공시지가',
    a: `**표준지공시지가 조사 기준일**은 **매년 1월 1일**입니다.\n\n「부동산 가격공시에 관한 법률」 제3조에 따라 국토교통부장관이 매년 1월 1일을 기준으로 표준지의 단위면적당 적정가격을 조사·산정하여 공시합니다.\n\n**주요 일정:**\n- 기준일: 1월 1일\n- 조사·산정: 전년도 10월 ~ 당해 1월\n- 공시일: 2월 말 (예정)\n- 이의신청: 공시일 후 30일 이내`,
    sources: ['표준지공시지가_조사지침.pdf', '부동산 가격공시에 관한 법률 제3조'],
  },
  {
    id: 'f2', q: '현장조사 출장비 정산 절차를 알려주세요.', category: '복무규정',
    a: `현장조사 출장비 정산 절차는 다음과 같습니다.\n\n**1. 출장 전**\n- 출장 3일 전 출장비 신청서 제출 (WorksOn 시스템)\n- 부서장 사전 승인 필수\n\n**2. 출장 중**\n- 영수증 원본 수취 (숙박·식비·교통)\n- 1일 식대 한도: 2만원 / 숙박비: 8만원\n\n**3. 출장 후 (7일 이내)**\n- 출장비 정산서 + 영수증 제출\n- 실비 지급 처리`,
    sources: ['취업규칙 제42조', '출장업무처리지침.pdf'],
  },
  {
    id: 'f3', q: '이의신청 접수 기간과 방법은?', category: '이의신청',
    a: `**이의신청 접수 기간:** 공시일로부터 **30일 이내**\n\n**접수 방법:**\n- 온라인: 부동산공시가격알리미(www.realtyprice.kr)\n- 서면: 한국부동산원 또는 시·군·구청 방문\n- 팩스: 관할 부서 팩스 접수\n\n**처리 기간:** 접수일로부터 **30일 이내** 결과 통보\n**재이의 신청:** 1회 가능 (통보일로부터 30일)`,
    sources: ['부동산 가격공시에 관한 법률 제7조', '이의신청 처리지침'],
  },
  {
    id: 'f4', q: '개별공시지가와 표준지공시지가의 차이는?', category: '공시지가',
    a: `**표준지공시지가**와 **개별공시지가**의 주요 차이:\n\n| 구분 | 표준지공시지가 | 개별공시지가 |\n|------|--------------|------------|\n| 대상 | 전국 50만 필지 (표준지) | 전국 모든 개별 토지 |\n| 산정주체 | 국토교통부장관 | 시장·군수·구청장 |\n| 활용 | 개별공시지가 산정 기준 | 과세·부담금 기준 |`,
    sources: ['부동산 가격공시에 관한 법률 제3·10조'],
  },
  {
    id: 'f5', q: 'AI 플랫폼 사용 이력은 저장되나요?', category: '시스템',
    a: `사용 이력은 보안 정책에 따라 **최대 90일**간 내부 서버에 보관됩니다.\n\n- 타 부서·상급자에 자동 공유되지 않습니다\n- 감사·컴플라이언스 목적으로만 관리자 열람 가능\n- 보안 채팅(SECURE 탭) 이용 시 세션 종료와 함께 즉시 삭제`,
    sources: ['개인정보처리방침 제5조', '보안정책 3장'],
  },
  {
    id: 'f6', q: '비밀 등급 문서는 어떻게 처리하나요?', category: '보안',
    a: `비밀 등급 문서 처리 절차:\n\n**1. 접근 권한 확인**\n- 대외비(C): 해당 부서원 이상\n- 비밀(S): 보안관리관 사전 승인 필요\n\n**2. 처리 원칙**\n- 반드시 SECURE 탭(보안 채팅) 사용\n- 내부망 전용 모델만 사용 (클라우드 모델 차단)\n- 처리 결과 세션 종료 시 자동 삭제\n\n**3. 출력·저장 금지**\n- 결과물 외부 저장·출력 금지`,
    sources: ['보안정책 제7조', '개인정보보호지침'],
  },
];

/* ─── 에이전트 전달 규칙 ─── */
const DELEGATE_RULES = [
  { keywords: ['보고서', '작성', '기안'],       agentId: 'agent-report',      agentName: '보고서 작성 에이전트', reason: '보고서 자동 작성 전문 에이전트입니다.' },
  { keywords: ['회의', '녹음', '회의록'],        agentId: 'agent-meeting',     agentName: '회의록 작성 에이전트', reason: '음성 기반 회의록 작성 전문입니다.' },
  { keywords: ['내규', '규정', '취업규칙'],       agentId: 'agent-internalreg', agentName: '내규 조회 에이전트',   reason: '사내 규정 조항 근거 제시 전문입니다.' },
  { keywords: ['OCR', '스캔', '이미지'],         agentId: 'agent-ocr',         agentName: 'OCR 에이전트',         reason: '이미지·스캔 문서 텍스트 추출 전문입니다.' },
  { keywords: ['요약', '정리', '줄여'],           agentId: 'agent-summary',     agentName: '문서 요약 에이전트',   reason: '문서 요약 전문 에이전트입니다.' },
  { keywords: ['데이터', '엑셀', '분석'],        agentId: 'agent-dataanalysis', agentName: '데이터 분석 에이전트', reason: '정형 데이터 분석·시각화 전문입니다.' },
];

/* ─── 질문 보정 ─── */
const CORRECTIONS = {
  short: ['더 구체적으로 질문해 주시면 정확한 답변이 가능합니다.'],
};

const SUGGEST_QUESTIONS = [
  '표준지공시지가 조사 기준일은 언제인가요?',
  '현장조사 출장비 정산 절차를 알려주세요.',
  '이의신청 접수 기간과 방법은?',
];

/* ─── 목업 응답 ─── */
const MOCK_RESPONSES = {
  default: {
    text: `안녕하세요! 한국부동산원 AI 어시스턴트입니다.\n\n부동산 공시, 사내 규정, 업무 지침 등에 관해 자유롭게 질문해 주세요. 내부 지식베이스와 규정집을 기반으로 정확한 답변을 제공합니다.\n\n**자주 묻는 주제:**\n- 표준지공시지가 조사 기준 및 일정\n- 이의신청 절차 및 기간\n- 현장조사 출장비 정산\n- 개별공시지가 산정 방법`,
    sources: ['한국부동산원 AI 플랫폼 운영지침'],
  },
};

/* 도메인 이관: REB 기본 콘텐츠 — 도메인 팩 agentContent["agent-chatbot"]로 키 단위 오버라이드 */
export const CONTENT_DEFAULTS = {
  welcomeText: MOCK_RESPONSES.default.text,          // 최초 인사 메시지 본문 (마크다운: **굵게**, - 목록, | 표 지원)
  welcomeSources: MOCK_RESPONSES.default.sources,    // string[] — 출처명. sourcePreviews 키와 일치하면 원문 미리보기 가능
  sourcePreviews: SOURCE_PREVIEWS,                   // { [출처명]: {title,type:'PDF'|'LAW'|'HWP',pages?,page?,section?,article?,excerpt:{text,hl}[]} } — 출처 칩 클릭 시 우측 원문 패널
  faqItems: FAQ_ITEMS,                               // {id,q,category,a,sources:string[]}[6] — category는 faqCategories 항목과 일치해야 함
  faqCategories: ['공시지가', '복무규정', '이의신청', '보안', '시스템'], // string[5] — FAQ 필터 탭. '전체' 탭은 코어가 자동으로 앞에 추가
  faqCategoryColors: {                               // { [category]: tailwind 배지 클래스 } — faqCategories 전 항목 매핑 (미매핑 시 slate 폴백)
    '공시지가': 'bg-blue-100 text-blue-700',
    '복무규정': 'bg-emerald-100 text-emerald-700',
    '이의신청': 'bg-amber-100 text-amber-700',
    '보안':     'bg-rose-100 text-rose-700',
    '시스템':   'bg-violet-100 text-violet-700',
  },
  delegateRules: DELEGATE_RULES,                     // {keywords:string[],agentId,agentName,reason}[6] — 질문에 keywords 포함 시 해당 에이전트 추천 배너
  correctionExample: '예: "연차 사용 기준이 어떻게 되나요?"', // 짧은 질문 보정 배너의 예시 문구 1줄
  suggestQuestions: SUGGEST_QUESTIONS,               // string[3] — 보정 배너의 추천 질문 칩 (faqItems.q와 일치 시 FAQ 답변 매칭됨)
  fallbackAnswerBody: `한국부동산원 내부 지식베이스 및 규정을 검토한 결과, 관련 내용을 정리해 드립니다.\n\n현재 질문하신 내용과 관련하여 사내 규정집, 업무 지침서, 공시 관련 법령 등을 검색하였습니다. 보다 정확한 답변을 위해 구체적인 상황이나 관련 문서명을 함께 알려주시면 더 상세한 안내가 가능합니다.\n\n**참고 자료:**\n- 표준지공시지가 조사지침 (2026년 개정본)\n- 한국부동산원 업무 매뉴얼 v3.2\n- 부동산 가격공시에 관한 법률`, // FAQ 미매칭 질문의 답변 본문(마크다운) — 앞에 **"질문"** 헤더는 코어가 붙임
  fallbackSources: ['표준지공시지가_조사지침.pdf', '업무매뉴얼_v3.2.pdf'], // string[2] — 미매칭 답변의 출처
  headerSubtitle: '내부 지식베이스 · 규정집 · 공시 법령 기반 응답', // 헤더 부제 1줄
  inputPlaceholder: '사내 규정이나 공시 업무에 대해 자유롭게 질문하세요...', // 입력창 placeholder
  quickAgents: [                                     // {label,id,color}[3] — 우측 하단 '자주 사용하는 에이전트' 바로가기
    { label: '회의록 작성 에이전트', id: 'agent-meeting',    color: 'bg-purple-100 text-purple-700' },
    { label: '보고서 작성 에이전트', id: 'agent-report',     color: 'bg-emerald-100 text-emerald-700' },
    { label: '내규 조회 에이전트',   id: 'agent-internalreg',color: 'bg-amber-100 text-amber-700' },
  ],
};

function detectDelegate(text, rules) {
  for (const rule of rules) {
    if (rule.keywords.some(k => text.includes(k))) return rule;
  }
  return null;
}

/* ─── 마크다운 렌더러 ─── */
function renderMarkdown(text) {
  const lines = text.split('\n');
  const elements = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('| ')) {
      const tableLines = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      i--;
      const rows = tableLines.filter(l => !l.match(/^\|[-| ]+\|$/));
      elements.push(
        <div key={key++} className="overflow-x-auto my-2">
          <table className="text-sm border-collapse w-full">
            <tbody>
              {rows.map((row, ri) => {
                const cells = row.split('|').filter((_, ci) => ci > 0 && ci < row.split('|').length - 1);
                const TagEl = ri === 0 ? 'th' : 'td';
                return (
                  <tr key={ri} className={ri === 0 ? 'bg-slate-100' : ri % 2 === 0 ? 'bg-slate-50' : ''}>
                    {cells.map((cell, ci) => (
                      <TagEl key={ci} className="border border-slate-200 px-2 py-1 text-left font-normal">
                        {cell.trim()}
                      </TagEl>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      elements.push(<p key={key++} className="font-semibold text-slate-800 mt-2 mb-0.5 text-sm">{line.slice(2, -2)}</p>);
      continue;
    }

    if (line.startsWith('- ')) {
      elements.push(
        <li key={key++} className="ml-4 list-disc text-slate-700 text-sm leading-relaxed">
          {formatInline(line.slice(2))}
        </li>
      );
      continue;
    }

    if (line === '') {
      elements.push(<div key={key++} className="h-1" />);
      continue;
    }

    elements.push(
      <p key={key++} className="text-slate-700 text-sm leading-relaxed">
        {formatInline(line)}
      </p>
    );
  }

  return <div>{elements}</div>;
}

function formatInline(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

/* ─── 워크플로우 스텝 빌더 ─── */
function buildWorkflowSteps(agentList, completedCount) {
  return agentList.map((agent, i) => {
    let status = 'pending';
    if (i < completedCount) status = 'done';
    else if (i === completedCount) status = 'running';
    return { id: `step-${i}`, label: agent.label, sub: agent.sub, status, color: agent.color, icon: agent.icon, ms: agent.ms };
  });
}

/* ─── 출처 타입 스타일 ─── */
function getTypeStyle(type) {
  if (type === 'LAW') return { icon: Scale,      color: 'bg-blue-100 text-blue-700',    label: '법령' };
  if (type === 'HWP') return { icon: ScrollText, color: 'bg-amber-100 text-amber-700',  label: 'HWP' };
  return                      { icon: FileText,   color: 'bg-rose-100 text-rose-700',    label: 'PDF' };
}

/* ─── 출처 미리보기 패널 ─── */
function SourcePreviewPanel({ sourceKey, previews, onClose }) {
  const data = previews[sourceKey];
  if (!data) return null;
  const { icon: TypeIcon, color: typeColor, label: typeLabel } = getTypeStyle(data.type);

  const meta = [];
  if (data.pages)   meta.push(`총 ${data.pages}p`);
  if (data.page)    meta.push(`${data.page}p`);
  if (data.section) meta.push(data.section);
  if (data.article) meta.push(data.article);

  return (
    <div className="flex flex-col h-full">
      {/* 패널 헤더 */}
      <div className="shrink-0 px-4 py-3 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            title="FAQ로 돌아가기"
            aria-label="FAQ로 돌아가기"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold text-slate-600 flex-1 truncate">출처 확인</span>
        </div>
        <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold mb-2", typeColor)}>
          <TypeIcon size={12} />
          {typeLabel}
        </div>
        <p className="text-sm font-semibold text-slate-800 leading-snug">{data.title}</p>
        {meta.length > 0 && (
          <p className="text-xs text-slate-400 mt-1">{meta.join(' · ')}</p>
        )}
      </div>

      {/* 하이라이팅된 본문 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="text-sm font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-500" />
          관련 구절 하이라이트
        </div>
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 leading-relaxed text-sm text-slate-700 whitespace-pre-wrap">
          {data.excerpt.map((part, i) =>
            part.hl ? (
              <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5 not-italic font-medium">
                {part.text}
              </mark>
            ) : (
              <span key={i}>{part.text}</span>
            )
          )}
        </div>
        <p className="text-sm text-slate-400 mt-3 text-center">
          실제 문서에서 원문을 확인하세요
        </p>
      </div>
    </div>
  );
}

/* ─── 메인 컴포넌트 ─── */
export default function ChatbotAgent({ onBack, domain }) {
  const C = { ...CONTENT_DEFAULTS, ...(domain?.agentContent?.["agent-chatbot"] || {}) };
  const [messages, setMessages] = useState([
    {
      id: 'init',
      role: 'assistant',
      text: C.welcomeText,
      sources: C.welcomeSources,
      isFaq: false,
      isContext: false,
      delegate: null,
      feedback: null,
      ts: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [workflowStep, setWorkflowStep] = useState(0);
  const [faqCategory, setFaqCategory] = useState('전체');
  const [faqSearch, setFaqSearch] = useState('');
  const [copied, setCopied] = useState(null);
  const [activeSource, setActiveSource] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const attachRef = useRef(null);
  const [attachment, setAttachment] = useState(null); // {name,size} — 첨부 후 다음 질의에 동봉
  const [micNotice, setMicNotice] = useState(false);  // 음성 입력 미지원 안내
  const timerRef = useRef([]);

  const userMsgCount = messages.filter(m => m.role === 'user').length;
  const contextCount = userMsgCount > 1 ? userMsgCount - 1 : 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  useEffect(() => {
    return () => timerRef.current.forEach(clearTimeout);
  }, []);

  const showCorrectionBanner = input.length > 0 && input.length < 8;

  const filteredFaq = C.faqItems.filter(f => {
    const categoryMatch = faqCategory === '전체' || f.category === faqCategory;
    const searchMatch = faqSearch === '' || f.q.includes(faqSearch);
    return categoryMatch && searchMatch;
  });

  /* ─── 메시지 전송 ─── */
  function sendMessage(text, isFaq = false, faqItem = null) {
    if (!text.trim() || isProcessing) return;

    const userMsg = {
      id: `u-${Date.now()}`, role: 'user', text: text.trim(),
      attachment: isFaq ? null : attachment, ts: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    if (!isFaq) setAttachment(null);
    setIsProcessing(true);
    setActiveSource(null);

    const processingDelay = isFaq ? 500 : 3800;

    if (!isFaq) {
      setShowWorkflow(true);
      setWorkflowStep(0);
      let elapsed = 0;
      AGENTS.forEach((agent, i) => {
        elapsed += i === 0 ? 600 : AGENTS[i - 1].ms;
        const t = setTimeout(() => setWorkflowStep(i + 1), elapsed);
        timerRef.current.push(t);
      });
    }

    const t = setTimeout(() => {
      let responseText = '';
      let sources = [];

      if (faqItem) {
        responseText = faqItem.a;
        sources = faqItem.sources;
      } else {
        const matched = C.faqItems.find(f =>
          f.q.split(/[은는이가 ]+/).some(word => word.length > 2 && text.includes(word))
        );
        if (matched) {
          responseText = matched.a;
          sources = matched.sources;
        } else {
          responseText = `**"${text.trim()}"** 에 대한 답변입니다.\n\n${C.fallbackAnswerBody}`;
          sources = C.fallbackSources;
        }
      }

      const delegate = isFaq ? null : detectDelegate(text, C.delegateRules);
      const isContext = userMsgCount >= 1;

      const aiMsg = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: responseText,
        sources,
        isFaq,
        isContext,
        delegate,
        feedback: null,
        ts: new Date(),
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsProcessing(false);
      setShowWorkflow(false);
      setWorkflowStep(0);
    }, processingDelay);

    timerRef.current.push(t);
  }

  function handleSend() { sendMessage(input); }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  function handleFaqClick(item) { sendMessage(item.q, true, item); }

  function handleFeedback(msgId, type) {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, feedback: type } : m));
  }

  function handleCopy(msgId, text) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(msgId);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleReset() {
    timerRef.current.forEach(clearTimeout);
    timerRef.current = [];
    setMessages([{
      id: 'init-' + Date.now(), role: 'assistant',
      text: C.welcomeText, sources: C.welcomeSources,
      isFaq: false, isContext: false, delegate: null, feedback: null, ts: new Date(),
    }]);
    setInput(''); setIsProcessing(false); setShowWorkflow(false); setWorkflowStep(0); setActiveSource(null);
  }

  const wfSteps = buildWorkflowSteps(AGENTS, workflowStep);

  return (
    <div className="flex-1 flex min-h-0 overflow-hidden bg-slate-50">

      {/* ── 좌측: 메인 채팅 ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">

        {/* 헤더 */}
        <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
            <Bot size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-800 text-sm">AI 챗봇 어시스턴트</span>
              {contextCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                  <Radio size={10} className="animate-pulse" />
                  이전 {contextCount}개 대화 참조 중
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 truncate">{C.headerSubtitle}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={handleReset} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors" title="대화 초기화" aria-label="대화 초기화">
              <RotateCcw size={15} />
            </button>
            {onBack && (
              <button onClick={onBack} className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
                목록
              </button>
            )}
          </div>
        </div>

        {/* 메시지 목록 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map(msg => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              previews={C.sourcePreviews}
              onFeedback={handleFeedback}
              onCopy={handleCopy}
              copied={copied}
              activeSource={activeSource}
              onSourceClick={setActiveSource}
            />
          ))}

          {isProcessing && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <Bot size={14} className="text-white" />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Loader2 size={14} className="animate-spin" />
                  <span>답변 생성 중...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* 질문 보정 배너 */}
        {showCorrectionBanner && (
          <div className="shrink-0 mx-4 mb-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <AlertCircle size={15} className="text-amber-500 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-amber-700 mb-1">질문 보정 제안</p>
                <p className="text-xs text-amber-600 mb-2">{CORRECTIONS.short[0]}</p>
                <p className="text-xs text-amber-500 mb-2">{C.correctionExample}</p>
                <div className="flex flex-wrap gap-1.5">
                  {C.suggestQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => { setInput(q); inputRef.current?.focus(); }}
                      className="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 입력창 */}
        <div className="shrink-0 px-4 py-3 border-t border-slate-200 bg-white">
          {attachment && (
            <div className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-blue-700">
              <Paperclip size={12} className="shrink-0" />
              <span className="truncate font-medium">{attachment.name}</span>
              <span className="text-blue-400 shrink-0">{attachment.size}</span>
              <button onClick={() => setAttachment(null)} aria-label="첨부 취소"
                className="ml-auto text-blue-400 hover:text-blue-700 font-bold shrink-0">×</button>
            </div>
          )}
          {micNotice && (
            <div className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-500">
              <Mic size={12} className="shrink-0" />
              음성 입력은 이 데모 환경에서 비활성화돼 있습니다 — 질의는 직접 입력해 주세요.
            </div>
          )}
          <div className={cn(
            "flex items-end gap-2 rounded-xl border bg-white px-3 py-2 transition-colors",
            showCorrectionBanner ? "border-amber-300" : "border-slate-200 focus-within:border-blue-400"
          )}>
            <button onClick={() => attachRef.current?.click()}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors shrink-0" aria-label="파일 첨부"><Paperclip size={16} /></button>
            <input ref={attachRef} type="file" className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                if (!f) return;
                setAttachment({ name: f.name, size: `${(f.size / 1024).toFixed(0)}KB` });
                setMicNotice(false);
                e.target.value = '';
              }} />
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={C.inputPlaceholder}
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none leading-relaxed py-0.5 max-h-32"
              style={{ minHeight: '24px' }}
              onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'; }}
              disabled={isProcessing}
            />
            <button onClick={() => { setMicNotice(v => !v); inputRef.current?.focus(); }}
              aria-pressed={micNotice}
              className={cn('p-1 transition-colors shrink-0', micNotice ? 'text-slate-600' : 'text-slate-400 hover:text-slate-600')}
              aria-label="음성 입력"><Mic size={16} /></button>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              aria-label="메시지 전송"
              className={cn(
                "p-1.5 rounded-lg transition-colors shrink-0",
                input.trim() && !isProcessing ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-100 text-slate-400 cursor-not-allowed"
              )}
            >
              <Send size={15} />
            </button>
          </div>
          <p className="text-center text-xs text-slate-400 mt-2">내부망 전용 AI · 외부 전송 없음 · 결과 검토 필요</p>
        </div>
      </div>

      {/* ── <1024: 출처 미리보기 오버레이 (우측 패널 숨김 뷰포트에서 출처 칩 무반응 해소) ── */}
      {activeSource && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setActiveSource(null)} aria-hidden="true" />
          <div className="relative w-full sm:w-[420px] sm:mx-4 max-h-[80dvh] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-200">
            <SourcePreviewPanel sourceKey={activeSource} previews={C.sourcePreviews} onClose={() => setActiveSource(null)} />
          </div>
        </div>
      )}

      {/* ── 우측 패널: 출처 미리보기 또는 FAQ ── */}
      <div className="hidden lg:flex w-72 shrink-0 border-l border-slate-200 flex-col bg-white overflow-hidden">
        {activeSource ? (
          <SourcePreviewPanel sourceKey={activeSource} previews={C.sourcePreviews} onClose={() => setActiveSource(null)} />
        ) : (
          <>
            {/* FAQ 헤더 */}
            <div className="shrink-0 px-4 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-2.5">
                <HelpCircle size={15} className="text-blue-600" />
                <span className="text-sm font-semibold text-slate-700">자주 묻는 질문</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-2 focus-within:border-blue-400 transition-colors">
                <Search size={14} className="text-slate-400 shrink-0" />
                <input
                  value={faqSearch}
                  onChange={e => setFaqSearch(e.target.value)}
                  placeholder="FAQ 검색..."
                  className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                />
              </div>
            </div>

            {/* 카테고리 필터 */}
            <div className="shrink-0 px-3 py-2.5 border-b border-slate-100">
              <div className="flex flex-wrap gap-1.5">
                {['전체', ...C.faqCategories].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFaqCategory(cat)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-sm font-medium transition-colors",
                      faqCategory === cat ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ 목록 */}
            <div className="flex-1 overflow-y-auto">
              {filteredFaq.length === 0 ? (
                <div className="px-4 py-8 text-center text-slate-400 text-sm">검색 결과가 없습니다</div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredFaq.map(item => (
                    <FaqItem key={item.id} item={item} catColors={C.faqCategoryColors} onClick={() => handleFaqClick(item)} />
                  ))}
                </div>
              )}
            </div>

            {/* 자주 사용하는 에이전트 */}
            <div className="shrink-0 border-t border-slate-200 px-4 py-3 bg-slate-50">
              <div className="flex items-center gap-2 mb-2">
                <Users size={15} className="text-slate-500" />
                <span className="text-sm font-semibold text-slate-600">자주 사용하는 에이전트</span>
              </div>
              <div className="space-y-1">
                {C.quickAgents.map(a => (
                  <button
                    key={a.id}
                    onClick={onBack}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-slate-100 transition-colors text-left group"
                  >
                    <span className={cn("text-sm font-medium px-2 py-1 rounded", a.color)}>{a.label}</span>
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── 워크플로우 패널 (처리 중에만) ── */}
      {showWorkflow && (
        <div className="hidden lg:block absolute inset-y-0 right-72 w-72 shadow-xl z-20 border-l border-slate-200">
          <AgentWorkflowPanel steps={wfSteps} title="챗봇 파이프라인" agentTeams={AGENT_TEAMS} />
        </div>
      )}
    </div>
  );
}

/* ─── FAQ 항목 ─── */
function FaqItem({ item, catColors, onClick }) {
  const color = catColors[item.category] || 'bg-slate-100 text-slate-600';

  return (
    <button onClick={onClick} className="w-full text-left px-4 py-3.5 hover:bg-blue-50 transition-colors group">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <span className={cn("inline-block px-1.5 py-0.5 rounded text-xs font-medium mb-1.5", color)}>
            {item.category}
          </span>
          <p className="text-sm text-slate-700 leading-relaxed group-hover:text-blue-700 transition-colors line-clamp-2">
            {item.q}
          </p>
        </div>
        <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors mt-1 shrink-0" />
      </div>
    </button>
  );
}

/* ─── 메시지 말풍선 ─── */
function MessageBubble({ msg, previews, onFeedback, onCopy, copied, activeSource, onSourceClick }) {
  const [expanded, setExpanded] = useState(true);

  if (msg.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%]">
          <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5">
            <p className="text-sm leading-relaxed">{msg.text}</p>
          </div>
          <p className="text-right text-xs text-slate-400 mt-1 pr-1">
            {msg.ts.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
        <Bot size={14} className="text-white" />
      </div>
      <div className="flex-1 min-w-0 max-w-[85%]">
        <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">

          {/* 상단 배지 */}
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            {msg.isFaq && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-xs font-medium">
                <CheckCircle size={10} /> FAQ 자동응답
              </span>
            )}
            {msg.isContext && !msg.isFaq && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-xs font-medium">
                <Radio size={10} /> 이전 대화 반영
              </span>
            )}
          </div>

          {/* 본문 */}
          <div className="text-sm leading-relaxed">
            {renderMarkdown(msg.text)}
          </div>

          {/* 출처 */}
          {msg.sources && msg.sources.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-slate-200">
              <button
                onClick={() => setExpanded(p => !p)}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors mb-2"
              >
                <FileText size={12} />
                <span>출처 {msg.sources.length}건</span>
                <ChevronDown size={12} className={cn("transition-transform", expanded && "rotate-180")} />
              </button>
              {expanded && (
                <>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((src, i) => {
                      const hasPreview = !!previews[src];
                      const isActive = activeSource === src;
                      return (
                        <button
                          key={i}
                          onClick={() => hasPreview && onSourceClick(isActive ? null : src)}
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all",
                            isActive
                              ? "bg-amber-200 text-amber-800 ring-1 ring-amber-400 shadow-sm"
                              : hasPreview
                              ? "bg-slate-200 text-slate-600 hover:bg-amber-100 hover:text-amber-700 cursor-pointer"
                              : "bg-slate-200 text-slate-500 cursor-default"
                          )}
                          title={hasPreview ? "클릭하여 원문 확인" : undefined}
                        >
                          <FileText size={11} />
                          {src}
                          {hasPreview && <ExternalLink size={9} className="opacity-60" />}
                        </button>
                      );
                    })}
                  </div>
                  {msg.sources.some(s => previews[s]) && (
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                      <Sparkles size={11} className="text-amber-400" />
                      출처 칩을 클릭하면 오른쪽에서 원문 확인 가능
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* 에이전트 추천 배너 */}
        {msg.delegate && (
          <div className="mt-2 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2">
            <Cpu size={14} className="text-blue-600 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-blue-800 font-medium">
                이 작업에는 <span className="font-semibold">{msg.delegate.agentName}</span>이 더 적합합니다
              </p>
              <p className="text-xs text-blue-600 mt-0.5">{msg.delegate.reason}</p>
            </div>
            <ArrowRight size={14} className="text-blue-500 shrink-0" />
          </div>
        )}

        {/* 피드백 */}
        <div className="flex items-center gap-1 mt-1.5 pl-1">
          <span className="text-xs text-slate-400 mr-1">
            {msg.ts.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            onClick={() => onFeedback(msg.id, 'up')}
            className={cn("p-1 rounded transition-colors", msg.feedback === 'up' ? "text-emerald-600 bg-emerald-50" : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50")}
            title="도움됨"
            aria-label="도움됨"
          >
            <ThumbsUp size={13} />
          </button>
          <button
            onClick={() => onFeedback(msg.id, 'down')}
            className={cn("p-1 rounded transition-colors", msg.feedback === 'down' ? "text-rose-600 bg-rose-50" : "text-slate-400 hover:text-rose-600 hover:bg-rose-50")}
            title="도움 안됨"
            aria-label="도움 안됨"
          >
            <ThumbsDown size={13} />
          </button>
          <button
            onClick={() => onCopy(msg.id, msg.text)}
            className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="복사"
            aria-label="복사"
          >
            {copied === msg.id ? <CheckCircle size={13} className="text-emerald-500" /> : <Copy size={13} />}
          </button>
        </div>
      </div>
    </div>
  );
}
