import React, { useState } from "react";
import {
  Database, Search, Code2, BarChart3, Loader2, CheckCircle,
  ChevronRight, Play, RotateCcw, Download, Copy, ChevronDown,
  Filter, History, TableProperties, TrendingUp,
  Clock, FileSpreadsheet, Zap, Shield, Building2, MapPin, TreePine
} from "lucide-react";
import AgentWorkflowPanel from "./AgentWorkflowPanel.jsx";
import { AGENT_TEAMS } from "../../data/constants.js";
import { cn, agentHeader } from "../../utils.jsx";


/* ── 데이터 소스 아이콘 (key 고정: building | land | lup) ── */
const SOURCE_ICONS = { building: Building2, land: MapPin, lup: TreePine };

/* ── 데이터 소스 ── */
const DB_SOURCES = [
  { key: 'building', label: '건축물대장',       desc: '건물명·구조·용도·면적·건축연도' },
  { key: 'land',     label: '토지대장',          desc: '지번·지목·면적·소유구분' },
  { key: 'lup',      label: '토지이용계획확인원', desc: '용도지역·지구·각종 규제사항' },
];

/* ── 권한 레벨 ── */
const PERMISSION_LEVELS = [
  { id: 'general',   label: '일반',       desc: '공개 데이터 + 지번주소',        badge: 'bg-slate-100 text-slate-600' },
  { id: 'manager',   label: '관리자',     desc: '소유자 정보 + 거래 이력 포함',  badge: 'bg-blue-100 text-blue-700' },
  { id: 'evaluator', label: '감정평가사', desc: '전체 데이터 + 과세정보 포함',   badge: 'bg-violet-100 text-violet-700' },
];

/* ── 에이전트 파이프라인 ── */
const AGENTS = [
  { icon: Search,    label: 'NL 파서',          sub: '자연어 질의 의도·조건 구조화 중',  color: 'bg-cyan-600',  ms: 1600 },
  { icon: Code2,     label: 'Text2SQL 에이전트', sub: 'SQL 쿼리 자동 생성 중',            color: 'bg-blue-600',  ms: 2800 },
  { icon: BarChart3, label: '결과 포맷터',       sub: '조회 결과 집계·시각화 처리 중',    color: 'bg-teal-600',  ms: 1800 },
];

/* ── 쿼리 히스토리 ── */
const QUERY_HISTORY = [
  { id: 1, query: '강남구 역삼동 건축물 현황 (2020년 이후 신축)',  date: '2026-03-31 16:42', rows: 12, ms: '0.31초' },
  { id: 2, query: '서초구 대지면적 1000㎡ 이상 토지 목록',        date: '2026-03-30 11:18', rows: 8,  ms: '0.55초' },
  { id: 3, query: '용도지역 제1종일반주거 토지이용계획 현황',      date: '2026-03-28 09:05', rows: 23, ms: '0.22초' },
  { id: 4, query: '노원구 건축물대장 위반건축물 현황',             date: '2026-03-25 14:30', rows: 5,  ms: '0.18초' },
];

/* ── 빠른 질의 ── */
const QUICK = [
  '강남구 역삼동 일반상업지역 건축물 현황',
  '서초구 토지대장 대지면적 500㎡ 이상',
  '노원구 토지이용계획 용도지역 현황',
  '분당구 공동주택 건축물대장 조회',
];

/* ── 결과 데이터 ── */
const BUILDING_ROWS = [
  { jibun: '역삼동 738',   buildingName: '강남파이낸스센터', structure: '철골철근콘크리트', yongdo: '업무시설', area: 135420, floor: '지하5/지상44', year: 2002, status: '정상' },
  { jibun: '역삼동 828-1', buildingName: 'GS타워',          structure: '철골철근콘크리트', yongdo: '업무시설', area: 88230,  floor: '지하7/지상43', year: 2004, status: '정상' },
  { jibun: '역삼동 639-1', buildingName: '역삼아이파크',    structure: '철근콘크리트',    yongdo: '공동주택', area: 24500,  floor: '지하2/지상25', year: 2018, status: '정상' },
  { jibun: '역삼동 821',   buildingName: '한국타이어빌딩',  structure: '철골철근콘크리트', yongdo: '업무시설', area: 52100,  floor: '지하5/지상22', year: 1998, status: '정상' },
  { jibun: '역삼동 702-8', buildingName: '역삼역센트럴뷰',  structure: '철근콘크리트',    yongdo: '공동주택', area: 8900,   floor: '지하1/지상10', year: 2021, status: '정상' },
  { jibun: '역삼동 648',   buildingName: '역삼SK허브',      structure: '철근콘크리트',    yongdo: '근린생활', area: 3200,   floor: '지하1/지상8',  year: 2015, status: '정상' },
  { jibun: '역삼동 731',   buildingName: '한신인터밸리24',  structure: '철골철근콘크리트', yongdo: '업무시설', area: 41800,  floor: '지하7/지상24', year: 2005, status: '정상' },
  { jibun: '역삼동 815-4', buildingName: '(무명)',           structure: '철근콘크리트',    yongdo: '단독주택', area: 280,    floor: '지상2',        year: 1992, status: '위반' },
];

const LAND_ROWS = [
  { jibun: '역삼동 738',   jimok: '대', area: 5823.0, ownership: '법인', zoning: '일반상업',       pnu: '1168010300101380000', landPrice: 25800000 },
  { jibun: '역삼동 828-1', jimok: '대', area: 3612.5, ownership: '법인', zoning: '일반상업',       pnu: '1168010300102810000', landPrice: 22100000 },
  { jibun: '역삼동 639-1', jimok: '대', area: 2105.0, ownership: '법인', zoning: '준주거',         pnu: '1168010300106390000', landPrice: 18500000 },
  { jibun: '역삼동 702-8', jimok: '대', area: 482.0,  ownership: '개인', zoning: '일반상업',       pnu: '1168010300107020000', landPrice: 21200000 },
  { jibun: '역삼동 815-4', jimok: '대', area: 183.0,  ownership: '개인', zoning: '제1종일반주거',  pnu: '1168010300108150000', landPrice: 9800000 },
];

const LUP_ROWS = [
  { jibun: '역삼동 738',   zoning: '일반상업지역',   district: '중심지미관지구', restrictions: ['건폐율 80%이하', '용적률 800%이하', '높이제한 없음'], fireZone: '일반화재경계지구' },
  { jibun: '역삼동 828-1', zoning: '일반상업지역',   district: '중심지미관지구', restrictions: ['건폐율 80%이하', '용적률 800%이하'],                  fireZone: '일반화재경계지구' },
  { jibun: '역삼동 639-1', zoning: '준주거지역',     district: '',              restrictions: ['건폐율 70%이하', '용적률 400%이하'],                  fireZone: '' },
  { jibun: '역삼동 702-8', zoning: '일반상업지역',   district: '',              restrictions: ['건폐율 80%이하', '용적률 800%이하'],                  fireZone: '' },
  { jibun: '역삼동 815-4', zoning: '제1종일반주거',  district: '최고고도지구',  restrictions: ['건폐율 60%이하', '용적률 200%이하', '높이 12m이하'],   fireZone: '' },
];

/* ── SQL 예시 ── */
const SQL_MAP = {
  building: `SELECT b.jibun, b.building_name, b.main_purpose,
       b.structure_code, b.total_area, b.floors,
       b.approval_date, b.violation_yn
FROM building_register b
  JOIN land_info l ON b.pnu = l.pnu
WHERE l.sigungu = '강남구'
  AND l.dong = '역삼동'
  AND b.approval_date >= '2000-01-01'
ORDER BY b.total_area DESC
LIMIT 50;`,
  land: `SELECT l.jibun, l.jimok_code, l.land_area,
       l.ownership_type, l.zoning_code,
       l.pnu, l.official_land_price
FROM land_register l
WHERE l.sigungu = '서초구'
  AND l.land_area >= 500
ORDER BY l.land_area DESC
LIMIT 50;`,
  lup: `SELECT p.jibun, p.zoning_code, p.district_code,
       p.restriction_list, p.fire_zone_code
FROM land_use_plan p
WHERE p.sigungu = '노원구'
  AND p.zoning_code IS NOT NULL
ORDER BY p.jibun ASC
LIMIT 50;`,
};

/* ── 통계 카드 아이콘 (icon 키 고정: table | filter | trend | clock | shield) ── */
const STAT_ICONS = { table: TableProperties, filter: Filter, trend: TrendingUp, clock: Clock, shield: Shield };

/* ── 통계 카드 (소스별 4개) ── */
const STATS_BY_SOURCE = {
  building: [
    { label: '총 건수',   value: '8건',       icon: 'table',  color: 'text-blue-600' },
    { label: '위반건수',  value: '1건',       icon: 'filter', color: 'text-red-500' },
    { label: '평균면적',  value: '44,304㎡',  icon: 'trend',  color: 'text-teal-600' },
    { label: '조회시간',  value: '0.31초',    icon: 'clock',  color: 'text-slate-500' },
  ],
  land: [
    { label: '총 건수',    value: '5건',      icon: 'table',  color: 'text-blue-600' },
    { label: '법인 소유',  value: '3건',      icon: 'shield', color: 'text-violet-600' },
    { label: '평균면적',   value: '2441.1㎡', icon: 'trend',  color: 'text-teal-600' },
    { label: '조회시간',   value: '0.55초',   icon: 'clock',  color: 'text-slate-500' },
  ],
  lup: [
    { label: '총 필지수',   value: '5건',     icon: 'table',  color: 'text-blue-600' },
    { label: '용도지역 수', value: '3종',     icon: 'filter', color: 'text-amber-600' },
    { label: '지구 지정',   value: '3건',     icon: 'trend',  color: 'text-teal-600' },
    { label: '조회시간',    value: '0.22초',  icon: 'clock',  color: 'text-slate-500' },
  ],
};

/* 도메인 이관: REB 기본 콘텐츠 — 도메인 팩 agentContent["agent-dbquery"]로 키 단위 오버라이드 */
export const CONTENT_DEFAULTS = {
  headerTitle: '부동산 대장 조회',
  headerSubtitle: '건축물대장 · 토지대장 · 토지이용계획확인원 자연어 검색',
  dbStatusLabel: '대장 DB 연결됨',
  emptyTitle: '부동산 대장을 자연어로 조회하세요',
  dbSources: DB_SOURCES,               // {key:'building'|'land'|'lup'(고정), label, desc}[3] — key별 결과 테이블 형태가 다름
  permissionLevels: PERMISSION_LEVELS, // {id:'general'|'manager'|'evaluator'(고정), label, desc, badge(tailwind 클래스)}[3]
  permissionNotices: {                 // 권한별 안내 문구 (id 3종 키 고정)
    general:   '공개 정보(지번·건물명·용도·면적)에 한해 조회 가능합니다.',
    manager:   '소유자 정보 및 거래 이력이 포함됩니다.',
    evaluator: '전체 데이터(소유·거래·과세·감정가) 조회 가능 — 개인정보 처리방침 준수 필요.',
  },
  queryHistory: QUERY_HISTORY,         // {id, query, date, rows(number), ms}[4]
  quickQueries: QUICK,                 // string[4] — 빈 화면 추천 질의
  buildingRows: BUILDING_ROWS,         // {jibun, buildingName, structure, yongdo, area(number), floor, year(number), status}[8] — status '위반'이면 붉은 배지
  landRows: LAND_ROWS,                 // {jibun, jimok, area(number), ownership, zoning, pnu, landPrice(number)}[5] — ownership '법인'이면 파란 배지, landPrice는 general 권한에서 가림
  lupRows: LUP_ROWS,                   // {jibun, zoning, district(''=미지정), restrictions:string[], fireZone(''=없음)}[5]
  sqlMap: SQL_MAP,                     // {building, land, lup} — 소스별 생성 SQL 문자열
  statsBySource: STATS_BY_SOURCE,      // {building|land|lup: {label, value, icon:'table'|'filter'|'trend'|'clock'|'shield', color(tailwind)}[4]}
  buildingColumns: [                   // {key: buildingRows 필드명, label}[8] — 건축물 결과 테이블 헤더
    { key: 'jibun', label: '지번' },
    { key: 'buildingName', label: '건물명' },
    { key: 'structure', label: '구조' },
    { key: 'yongdo', label: '주용도' },
    { key: 'area', label: '연면적(㎡)' },
    { key: 'floor', label: '층수' },
    { key: 'year', label: '준공연도' },
    { key: 'status', label: '상태' },
  ],
  landColumns: ['지번', '지목', '면적(㎡)', '소유구분', '용도지역', 'PNU', '공시지가(원/㎡)'], // string[7] — landRows 필드 순서와 일치
  lupColumns: ['지번', '용도지역', '지구', '건축제한', '화재경계지구'],                        // string[5] — lupRows 필드 순서와 일치
  restrictedNotice: '공시지가 정보는 관리자 이상 권한에서 조회 가능합니다.', // general 권한 안내 배너
  /* ── 아래는 전부 선택 필드 — 팩이 제공할 때만 해당 패널이 렌더된다(미제공 도메인 무변화) ── */
  interpretBySource: null, // {building|land|lup: {terms:[{phrase,column,op,value,note}], assumptions:[string], unmapped:[string]}}
  planBySource: null,      // {building|land|lup: {steps:[{op,detail,rows,ms}], totalMs, note}} — 실행 계획
  freshness: null,         // [{label,table,syncedAt,lag,rows,status:'ok'|'warn'|'bad'}] — 소스 신선도
  qualityFlags: null,      // [{level:'bad'|'warn'|'info',label,detail}] — 결과 해석 시 주의사항
  nextActions: null,       // [{label,agentId,reason}] — 결과를 넘길 후속 에이전트
};

/* ── 메인 컴포넌트 ── */
export default function DBQueryAgent({ onBack, domain, onNavigate }) {
  const C = { ...CONTENT_DEFAULTS, ...(domain?.agentContent?.["agent-dbquery"] || {}) };
  const [step, setStep] = useState(1);
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('building');
  const [permission, setPermission] = useState('general');
  const [agentIdx, setAgentIdx] = useState(0);
  const [agentDone, setAgentDone] = useState([false, false, false]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSQL, setShowSQL] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [sortField, setSortField] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const teamData = AGENT_TEAMS?.find(t => t.id === 'agent-dbquery') ?? null;
  const H = agentHeader(domain,'agent-dbquery',C,AGENT_TEAMS);
  const permInfo = C.permissionLevels.find(p => p.id === permission);
  const sourceInfo = C.dbSources.find(s => s.key === source);
  const stats = (C.statsBySource[source] || []).map(s => ({ ...s, icon: STAT_ICONS[s.icon] || TableProperties }));
  const interp = C.interpretBySource?.[source] || null;
  const plan = C.planBySource?.[source] || null;
  const currentRows = source === 'building' ? C.buildingRows : source === 'land' ? C.landRows : C.lupRows;
  const currentHeaders = source === 'building' ? C.buildingColumns.map(c => c.label)
    : source === 'land' ? C.landColumns : C.lupColumns;

  /* ── 파이프라인 실행 ── */
  function runPipeline() {
    if (!query.trim()) return;
    setStep(2);
    setAgentIdx(0);
    setAgentDone([false, false, false]);

    let elapsed = 0;
    AGENTS.forEach((ag, i) => {
      elapsed += ag.ms;
      setTimeout(() => {
        setAgentIdx(i + 1);
        setAgentDone(prev => { const n = [...prev]; n[i] = true; return n; });
        if (i === AGENTS.length - 1) {
          setTimeout(() => setStep(3), 600);
        }
      }, elapsed);
    });
  }

  /* ── 정렬 ── */
  function handleSort(field) {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  }

  function getSortedBuilding() {
    if (!sortField) return C.buildingRows;
    return [...C.buildingRows].sort((a, b) => {
      const av = a[sortField], bv = b[sortField];
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
  }

  /* ── CSV 복사 ── */
  function handleCopy() {
    const text = [currentHeaders.join('\t'), ...currentRows.map(r => Object.values(r).join('\t'))].join('\n');
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  /* ── 엑셀 다운로드 (BOM + TSV — 엑셀에서 한글 정상 인식) ── */
  function handleDownload() {
    const tsv = [currentHeaders.join('\t'), ...currentRows.map(r => Object.values(r).join('\t'))].join('\n');
    const url = URL.createObjectURL(new Blob(['﻿' + tsv], { type: 'text/tab-separated-values;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = `${sourceInfo.label}_조회결과.xls`; a.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  }

  /* ── 리셋 ── */
  function handleReset() {
    setStep(1);
    setQuery('');
    setSource('building');
    setPermission('general');
    setShowSQL(false);
    setSortField(null);
  }

  /* ════════════════ STEP 1 ════════════════ */
  if (step === 1) return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-white border-b border-slate-200 px-5 py-3 flex items-center gap-3 shrink-0">
        {onBack && (
          <button onClick={onBack} aria-label="뒤로 가기" className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0">
            <ChevronRight className="w-4 h-4 rotate-180" />
          </button>
        )}
        <div className="w-7 h-7 rounded-lg bg-cyan-600 flex items-center justify-center shrink-0 shadow-sm">
          <Database className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-black text-slate-800">{H.title}</div>
          <div className="text-[10px] text-slate-400">{C.headerSubtitle}</div>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-[10px] text-slate-400 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
          {C.dbStatusLabel}
        </div>
      </div>

      {/* 빈 상태 + 추천 질의 */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 py-6">
        <div className="w-16 h-16 rounded-2xl bg-cyan-50 border-2 border-cyan-100 flex items-center justify-center mb-5">
          <Database className="w-8 h-8 text-cyan-400"/>
        </div>
        <div className="text-[16px] font-black text-slate-600 mb-1.5">{C.emptyTitle}</div>
        <div className="text-[12px] text-slate-400 mb-6 text-center leading-relaxed">
          Text-to-SQL 엔진이 자연어를 SQL로 변환하여 조회합니다
        </div>
        {/* 추천 질의 */}
        <div className="w-full max-w-lg space-y-2 mb-4">
          {C.quickQueries.map((q, i) => (
            <button key={i} onClick={() => setQuery(q)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-600 hover:border-cyan-300 hover:text-cyan-700 hover:bg-cyan-50 transition-all shadow-sm text-left">
              <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0"/>
              {q}
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 ml-auto shrink-0"/>
            </button>
          ))}
        </div>
        {/* 최근 조회 내역 */}
        <div className="w-full max-w-lg">
          <button onClick={() => setShowHistory(h => !h)}
            className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-cyan-600 transition-colors mb-2">
            <History className="w-3.5 h-3.5"/>
            최근 조회 내역
            <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', showHistory && 'rotate-180')}/>
          </button>
          {showHistory && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {C.queryHistory.map(h => (
                <button key={h.id} onClick={() => { setQuery(h.query); setShowHistory(false); }}
                  className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 text-left transition-colors border-b border-slate-100 last:border-0">
                  <Clock className="w-3 h-3 text-slate-400 mt-0.5 shrink-0"/>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-slate-700 truncate">{h.query}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{h.date} · {h.rows}건 · {h.ms}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 하단 설정 + 입력창 */}
      <div className="shrink-0 bg-white border-t border-slate-100 px-5 pt-3 pb-4 space-y-2.5">
        {/* 데이터 소스 + 권한 컴팩트 선택 */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider shrink-0">데이터 소스</span>
            <div className="flex gap-1">
              {C.dbSources.map(s => {
                const Icon = SOURCE_ICONS[s.key] || Database;
                const active = source === s.key;
                return (
                  <button key={s.key} onClick={() => setSource(s.key)} title={s.desc}
                    className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all',
                      active ? 'bg-cyan-600 border-cyan-600 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-cyan-300 hover:text-cyan-600')}>
                    <Icon className="w-3 h-3"/>{s.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <Shield className="w-3.5 h-3.5 text-slate-400"/>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">권한</span>
            <div className="flex gap-1">
              {C.permissionLevels.map(pl => (
                <button key={pl.id} onClick={() => setPermission(pl.id)}
                  className={cn('px-2.5 py-1 rounded-full border text-[11px] font-bold transition-all',
                    permission===pl.id ? cn(pl.badge,'border-transparent') : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300')}>
                  {pl.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* 권한 범위 안내 */}
        <div className={cn('px-3 py-1.5 rounded-lg text-[11px] leading-relaxed',
          permission==='general'   ? 'bg-slate-50 text-slate-500 border border-slate-200' :
          permission==='manager'   ? 'bg-blue-50 text-blue-600 border border-blue-200' :
                                     'bg-violet-50 text-violet-600 border border-violet-200')}>
          {permission==='general'   && C.permissionNotices.general}
          {permission==='manager'   && C.permissionNotices.manager}
          {permission==='evaluator' && C.permissionNotices.evaluator}
        </div>
        {/* 질의 입력 */}
        <div className="flex gap-2 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none"/>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); runPipeline(); } }}
              placeholder={`${sourceInfo.label}에서 자연어로 조회하세요 (Enter로 실행)`}
              className="w-full pl-9 pr-4 py-3 text-[13px] border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-400 transition-all placeholder-slate-300 text-slate-700"
            />
          </div>
          <button onClick={runPipeline} disabled={!query.trim()} aria-label="질의 실행"
            className="w-[42px] h-[42px] max-w-full bg-cyan-600 text-white rounded-xl flex items-center justify-center hover:bg-cyan-700 transition-colors shadow-md shadow-cyan-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0">
            <Play className="w-4 h-4 fill-white"/>
          </button>
        </div>
      </div>
    </div>
  );

  /* ════════════════ STEP 2 (파이프라인) ════════════════ */
  if (step === 2) return (
    <div className="h-full flex flex-col bg-slate-50 overflow-auto">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
          <Database className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800">쿼리 생성 중...</h2>
          <p className="text-xs text-slate-500">{sourceInfo.label} 데이터 조회 파이프라인 실행</p>
        </div>
      </div>

      <div className="flex-1 p-6 max-w-2xl mx-auto w-full space-y-4">
        {/* 질의 표시 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs text-slate-400 mb-1">입력 질의</p>
          <p className="text-sm text-slate-700 font-medium">{query}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', permInfo.badge)}>{permInfo.label} 권한</span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">{sourceInfo.label}</span>
          </div>
        </div>

        {/* 에이전트 파이프라인 카드 */}
        <div className="space-y-3">
          {AGENTS.map((ag, i) => {
            const Icon = ag.icon;
            const isActive = agentIdx === i;
            const isDone = agentDone[i];
            const isPending = agentIdx < i;
            return (
              <div
                key={i}
                className={cn(
                  'bg-white rounded-xl border p-4 transition-all',
                  isDone    ? 'border-green-200 bg-green-50' :
                  isActive  ? 'border-blue-300 shadow-md' :
                              'border-slate-200 opacity-50'
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', isDone ? 'bg-green-500' : ag.color)}>
                    {isDone
                      ? <CheckCircle className="w-5 h-5 text-white" />
                      : isActive
                        ? <Loader2 className="w-5 h-5 text-white animate-spin" />
                        : <Icon className="w-5 h-5 text-white" />
                    }
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-700">{ag.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isDone ? '완료' : isActive ? ag.sub : '대기 중'}
                    </p>
                  </div>
                  {isActive && (
                    <div className="flex gap-1">
                      {[0,1,2].map(d => (
                        <div key={d} className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                      ))}
                    </div>
                  )}
                  {isDone && <span className="text-xs text-green-600 font-medium">완료</span>}
                  {isPending && <span className="text-xs text-slate-400">대기</span>}
                </div>

                {/* 진행바 */}
                {isActive && (
                  <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full animate-pulse w-2/3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* AgentWorkflowPanel (있을 경우) */}
        {teamData && (
          <div className="mt-2">
            <AgentWorkflowPanel team={teamData} />
          </div>
        )}
      </div>
    </div>
  );

  /* ════════════════ STEP 3 (결과) ════════════════ */
  const sortedBuilding = getSortedBuilding();
  const perm = C.permissionLevels.find(p => p.id === permission);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-auto">
      {/* 헤더 */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3 shrink-0">
        <button
          onClick={handleReset}
          aria-label="새 조회로 돌아가기"
          className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded hover:bg-slate-100"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
          <Database className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-slate-800">조회 결과 — {sourceInfo.label}</h2>
          <p className="text-xs text-slate-500 truncate max-w-xs">{query}</p>
        </div>
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', perm.badge)}>
            {perm.label} 권한으로 조회
          </span>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-300 rounded-lg px-3 py-1.5 bg-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            새 조회
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-4 max-w-6xl mx-auto w-full">

        {/* 통계 카드 4개 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <Icon className={cn('w-5 h-5', s.color)} />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-800">{s.value}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 질의 해석 — 자연어를 어떤 조건으로 옮겼는지 (Text2SQL 판단 근거) */}
        {interp && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
              <Search className="w-4 h-4 text-cyan-500" />
              <span className="text-sm font-semibold text-slate-700">질의 해석</span>
              <span className="ml-auto text-xs text-slate-400">자연어 → 조회 조건</span>
            </div>
            <div className="p-4 space-y-3">
              {interp.terms?.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] text-xs">
                    <thead>
                      <tr className="text-slate-400">
                        {['질의 표현', '대상 컬럼', '조건', '판단'].map(h => (
                          <th key={h} className="text-left font-semibold pb-2 pr-3 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {interp.terms.map((t, i) => (
                        <tr key={i}>
                          <td className="py-2 pr-3 align-top">
                            <span className="px-2 py-0.5 rounded bg-cyan-50 text-cyan-700 font-medium whitespace-nowrap">{t.phrase}</span>
                          </td>
                          <td className="py-2 pr-3 align-top font-mono text-slate-600 whitespace-nowrap">{t.column}</td>
                          <td className="py-2 pr-3 align-top font-mono text-slate-500 whitespace-nowrap">{t.op} {t.value}</td>
                          <td className="py-2 align-top text-slate-500 leading-snug">{t.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {interp.assumptions?.length > 0 && (
                <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 space-y-1">
                  <div className="text-[11px] font-bold text-amber-700">질의에 없어 AI가 가정한 조건</div>
                  {interp.assumptions.map((a, i) => (
                    <div key={i} className="text-[11px] text-amber-700 leading-relaxed">· {a}</div>
                  ))}
                </div>
              )}
              {interp.unmapped?.length > 0 && (
                <div className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 space-y-1">
                  <div className="text-[11px] font-bold text-slate-500">조건으로 옮기지 못한 표현</div>
                  {interp.unmapped.map((u, i) => (
                    <div key={i} className="text-[11px] text-slate-500 leading-relaxed">· {u}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* SQL Accordion */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <button
            onClick={() => setShowSQL(v => !v)}
            className="w-full flex items-center gap-2 px-4 py-3 hover:bg-slate-50 transition-colors text-left"
          >
            <Code2 className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold text-slate-700">생성된 SQL 쿼리</span>
            <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {sourceInfo.label}
            </span>
            <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform ml-1', showSQL && 'rotate-180')} />
          </button>
          {showSQL && (
            <div className="border-t border-slate-200">
              <pre className="bg-slate-900 text-green-300 text-xs p-4 overflow-x-auto font-mono leading-relaxed">
                {C.sqlMap[source]}
              </pre>
            </div>
          )}
        </div>

        {/* 실행 계획 */}
        {plan && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setShowPlan(v => !v)}
              className="w-full flex items-center gap-2 px-4 py-3 hover:bg-slate-50 transition-colors text-left">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-slate-700">실행 계획</span>
              {plan.totalMs && (
                <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{plan.totalMs}</span>
              )}
              <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform ml-1', showPlan && 'rotate-180')} />
            </button>
            {showPlan && (
              <div className="border-t border-slate-200 p-4 space-y-2">
                {plan.steps?.map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center shrink-0 pt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      {i < plan.steps.length - 1 && <div className="w-px flex-1 min-h-[18px] bg-slate-200" />}
                    </div>
                    <div className="flex-1 min-w-0 pb-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-semibold text-blue-700">{s.op}</span>
                        {s.rows != null && (
                          <span className="text-[10px] font-mono text-slate-400">rows {Number(s.rows).toLocaleString()}</span>
                        )}
                        {s.ms != null && (
                          <span className="text-[10px] font-mono text-slate-400">{s.ms}ms</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 leading-snug mt-0.5">{s.detail}</div>
                    </div>
                  </div>
                ))}
                {plan.note && (
                  <div className="text-[11px] text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 leading-relaxed mt-1">
                    {plan.note}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 데이터 신선도 + 품질 경고 */}
        {(C.freshness?.length > 0 || C.qualityFlags?.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {C.freshness?.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-100">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-600">데이터 신선도</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {C.freshness.map((f, i) => (
                    <div key={i} className="px-4 py-2.5 flex items-center gap-3">
                      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0',
                        f.status === 'bad' ? 'bg-rose-500' : f.status === 'warn' ? 'bg-amber-500' : 'bg-emerald-500')} />
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] font-medium text-slate-700 truncate">{f.label}</div>
                        <div className="text-[10px] font-mono text-slate-400 truncate">{f.table}{f.rows ? ` · ${f.rows}행` : ''}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[11px] text-slate-500 font-mono">{f.syncedAt}</div>
                        <div className={cn('text-[10px] font-bold',
                          f.status === 'bad' ? 'text-rose-600' : f.status === 'warn' ? 'text-amber-600' : 'text-slate-400')}>{f.lag}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {C.qualityFlags?.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-100">
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-600">결과 해석 시 주의</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {C.qualityFlags.map((q, i) => (
                    <div key={i} className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0',
                          q.level === 'bad' ? 'bg-rose-50 border-rose-200 text-rose-700'
                            : q.level === 'warn' ? 'bg-amber-50 border-amber-200 text-amber-700'
                              : 'bg-slate-50 border-slate-200 text-slate-500')}>
                          {q.level === 'bad' ? '결측' : q.level === 'warn' ? '주의' : '참고'}
                        </span>
                        <span className="text-[12px] font-medium text-slate-700 leading-snug">{q.label}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 leading-relaxed mt-1">{q.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 다운로드 / 복사 버튼 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-slate-700">
              {source === 'building' ? `${C.buildingRows.length}건` : source === 'land' ? `${C.landRows.length}건` : `${C.lupRows.length}건`} 조회됨
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={cn(
                'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all',
                copied
                  ? 'border-green-400 bg-green-50 text-green-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              )}
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? '복사됨' : 'CSV 복사'}
            </button>
            <button
              onClick={handleDownload}
              className={cn('flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all',
                downloaded
                  ? 'border-green-400 bg-green-50 text-green-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700')}>
              <Download className="w-3.5 h-3.5" />
              {downloaded ? '내려받음' : '엑셀 다운로드'}
            </button>
            {onNavigate && (
              <button
                onClick={() => onNavigate('agent-report')}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all">
                <FileSpreadsheet className="w-3.5 h-3.5" />
                보고서 생성
              </button>
            )}
          </div>
        </div>

        {/* ── 결과 테이블 ── */}

        {/* 건축물대장 */}
        {source === 'building' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {C.buildingColumns.map(col => (
                      <th
                        key={col.key}
                        onClick={() => handleSort(col.key)}
                        className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 whitespace-nowrap select-none"
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          <Filter className="w-3 h-3 opacity-40" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedBuilding.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-slate-600 whitespace-nowrap">{row.jibun}</td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-800 whitespace-nowrap">{row.buildingName}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{row.structure}</td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          row.yongdo === '업무시설' ? 'bg-blue-100 text-blue-700' :
                          row.yongdo === '공동주택' ? 'bg-green-100 text-green-700' :
                          row.yongdo === '근린생활' ? 'bg-amber-100 text-amber-700' :
                                                      'bg-slate-100 text-slate-600'
                        )}>
                          {row.yongdo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-right text-slate-700 font-mono whitespace-nowrap">
                        {row.area.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{row.floor}</td>
                      <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">{row.year}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-semibold',
                          row.status === '위반'
                            ? 'bg-red-100 text-red-600 ring-1 ring-red-300'
                            : 'bg-emerald-100 text-emerald-700'
                        )}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 토지대장 */}
        {source === 'land' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {C.landColumns.map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {C.landRows.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-slate-600 whitespace-nowrap">{row.jibun}</td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">{row.jimok}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-right font-mono text-slate-700 whitespace-nowrap">{row.area.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          row.ownership === '법인'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-slate-100 text-slate-600'
                        )}>
                          {row.ownership}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-700 whitespace-nowrap">{row.zoning}</td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-500 whitespace-nowrap">{row.pnu}</td>
                      <td className="px-4 py-3 text-xs text-right font-mono text-slate-800 whitespace-nowrap">
                        {permission === 'general'
                          ? <span className="text-slate-400 italic">권한 필요</span>
                          : row.landPrice.toLocaleString()
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {permission === 'general' && (
              <div className="px-4 py-3 bg-amber-50 border-t border-amber-200 text-xs text-amber-700 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 shrink-0" />
                {C.restrictedNotice}
              </div>
            )}
          </div>
        )}

        {/* 토지이용계획확인원 */}
        {source === 'lup' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {C.lupColumns.map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {C.lupRows.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-slate-600 whitespace-nowrap">{row.jibun}</td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          row.zoning.includes('상업') ? 'bg-blue-100 text-blue-700' :
                          row.zoning.includes('주거') ? 'bg-green-100 text-green-700' :
                                                        'bg-amber-100 text-amber-700'
                        )}>
                          {row.zoning}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                        {row.district
                          ? <span className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full text-xs">{row.district}</span>
                          : <span className="text-slate-300">—</span>
                        }
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {row.restrictions.map((r, j) => (
                            <span key={j} className="text-xs px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">{r}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                        {row.fireZone
                          ? <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs">{row.fireZone}</span>
                          : <span className="text-slate-300">—</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 다음 단계 — 조회 결과를 넘길 후속 에이전트 */}
        {C.nextActions?.length > 0 && onNavigate && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-100">
              <ChevronRight className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-xs font-semibold text-slate-600">다음 단계</span>
            </div>
            <div className="divide-y divide-slate-100">
              {C.nextActions.map((a, i) => (
                <button key={i} onClick={() => onNavigate(a.agentId)}
                  className="w-full text-left px-4 py-3 hover:bg-indigo-50/50 transition-colors group">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-slate-700 group-hover:text-indigo-700">{a.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 ml-auto shrink-0" />
                  </div>
                  <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{a.reason}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* AgentWorkflowPanel */}
        {teamData && (
          <div className="mt-2">
            <AgentWorkflowPanel team={teamData} />
          </div>
        )}
      </div>
    </div>
  );
}
