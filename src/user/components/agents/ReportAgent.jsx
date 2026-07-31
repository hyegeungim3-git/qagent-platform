import React, { useState, useEffect } from "react";
import {
  FileText, Search, Filter, Cpu, Radio, Loader2, CheckCircle,
  ChevronRight, Network, Play, RotateCcw, Download, FileCheck,
  ExternalLink, Clock, Edit3, Eye, Printer
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine, ResponsiveContainer, Cell, LabelList
} from "recharts";
import ApprovalModal from "../ApprovalModal.jsx";
import SelfCheckModal from "../SelfCheckModal.jsx";
import AgentWorkflowPanel from "./AgentWorkflowPanel.jsx";
import { AGENT_TEAMS } from "../../data/constants.js";
import { useAgentSimulation } from "../../hooks/useAgentSimulation.js";
import { cn, agentHeader, downloadTextFile, buildDocHtml, orgLogoDataUri } from "../../utils.jsx";


const APV_LINE=[
  {name:'김민준',dept:'부동산공시처',title:'과장',role:'작성자'},
  {name:'박지현',dept:'부동산공시처',title:'공시관리부장',role:'검토자'},
  {name:'이상호',dept:'부동산공시처',title:'처장',role:'승인자'},
];

const AGENTS=[
  {icon:Search, label:'템플릿 검색기',  sub:'표준 보고서 양식 불러오는 중',    color:'bg-emerald-600', ms:1600},
  {icon:Filter, label:'데이터 정제기',  sub:'입력 정보 매핑 및 정제 중',       color:'bg-green-600',   ms:2200},
  {icon:Cpu,    label:'보고서 포맷터', sub:'GPT-OSS 120B 문서 생성 중',      color:'bg-teal-600',    ms:2500},
];

const REPORT_TYPES=[
  {id:'weekly',    label:'주간실적보고',     icon:'📊', desc:'주간 업무 실적 및 차주 계획'},
  {id:'field',     label:'현장조사보고',     icon:'🏗️', desc:'현장 방문 조사 결과 보고'},
  {id:'monthly',   label:'월간실적보고',     icon:'📈', desc:'월간 종합 업무 실적 보고'},
  {id:'officetel', label:'주택가격동향조사', icon:'🏢', desc:'분기별 주택가격동향 통계 보고'},
  {id:'market',    label:'시황보고서',       icon:'📉', desc:'주택시장 동향 및 전망 보고'},
];

const TONES=[
  {id:'formal',   label:'공식체',  desc:'공문서 개조식 문체'},
  {id:'summary',  label:'요약체',  desc:'핵심만 간결하게'},
  {id:'detailed', label:'상세체',  desc:'배경·근거 포함 상세'},
];

const LENGTHS_REPORT=[
  {id:'short',  label:'단문 (1~2p)', desc:'핵심 위주'},
  {id:'medium', label:'표준 (3~5p)', desc:'일반 업무 보고'},
  {id:'long',   label:'장문 (6p+)',  desc:'종합 분석 보고'},
];

/* 내보내기 형식 — 백엔드 없이 브라우저에서 실제로 만들 수 있는 것만 둔다.
   한글(.hwpx)은 독점 바이너리라 클라이언트에서 생성 불가 → 메뉴 하단에 변환 경유를 명시하고,
   한글이 그대로 열 수 있는 .html을 대신 제공한다. */
const EXPORT_FORMATS=[
  {label:'Word (.doc)',  icon:'📄', ext:'doc',  color:'text-blue-600'},
  {label:'HTML (.html)', icon:'📋', ext:'html', color:'text-green-600'},
  {label:'PDF (인쇄)',   icon:'📕', ext:'pdf',  color:'text-red-600'},
];

const DOC_NUMS={
  weekly:    'KREA-부동산공시처-2026-027',
  field:     'KREA-부동산공시처-2026-028',
  monthly:   'KREA-부동산공시처-2026-030',
  officetel: 'KREA-부동산통계처-2025-034',
  market:    'KREA-부동산통계처-2026-035',
};

const REPORT_DEFAULTS={
  market:{
    dept:'부동산통계처 상업자산통계부',
    period:'2026. 03. (2026년 1분기)',
    mainWork:'- 전국 주택매매가격지수 96.74 (전월 대비 -0.09%)\n- 수도권 매매가격 -0.08%, 서울 -0.04% (하락폭 축소 추세)\n- 전세가격 전국 -0.06%, 월세가격 전국 +0.04%\n- 전세수급지수 94.3 (공급 우위 지속)',
    nextPlan:'- 2분기 주택시장 동향 조사 계획 수립\n- 4월 주택가격동향 속보치 산출 및 검증\n- 부동산 시장 전문가 패널 동향 조사 실시',
    special:'- 서울 일부 지역(강남·서초) 상승 압력 증가 — 모니터링 강화\n- 미분양 주택 전국 69,214호 (2월 말 기준), 준공 후 미분양 1만5천호 초과',
  },
  weekly:{
    dept:'부동산공시처',
    period:'2026. 03. 09. ~ 03. 13.',
    mainWork:'- 표준지공시지가 현장조사 8건 완료 (서울 노원구·강북구)\n- 비교표준지 가격 검토 3건 처리\n- 이의신청 검토 의견서 작성 2건',
    nextPlan:'- 표준지공시지가 현장조사 12건 예정 (서울 도봉구·중랑구)\n- 분기 실적 집계 및 보고서 작성\n- 이의신청 처리 결과 통보 3건',
    special:'- 노원구 일부 표준지 현황 변동 사항 발생 (재조사 필요 2건)',
  },
  field:{
    dept:'부동산공시처',
    period:'2026. 03. 11. (화)',
    mainWork:'- 서울 노원구 표준지 5필지 현장 방문 조사 완료\n- 인근 거래 사례 수집 및 비교 분석 완료\n- 현황 변동(용도지역 변경) 2건 확인 및 기록',
    nextPlan:'- 조사 결과 시스템 입력 및 상급자 검토 제출\n- 도봉구 잔여 필지 현장조사 일정 협의',
    special:'- 조사 대상 필지 중 1건 무단 형질변경 의심 — 관계 기관 통보 예정',
  },
  monthly:{
    dept:'부동산공시처',
    period:'2026. 02.',
    mainWork:'- 표준지공시지가 현장조사 총 47건 완료\n- 비교표준지 가격 검토 18건 처리\n- 이의신청 처리 결과 통보 11건',
    nextPlan:'- 3월 현장조사 계획 수립 및 조사원 배정\n- 1분기 실적 취합 및 처장 보고',
    special:'- 2월 조사 완료율 94.0% — 전월(91.2%) 대비 개선',
  },
  officetel:{
    dept:'부동산통계처 상업자산통계부',
    period:'2025. 04. ~ 06. (2분기)',
    mainWork:"- '25년 2분기 주택가격동향조사 완료 (9개 시도, 표본 2,300호)\n- 매매가격 전국 0.39% 하락 (수도권 -0.34%, 지방 -0.56%), 서울 보합(0.00%)\n- 전세가격 전국 0.25% 하락, 전세기피 현상 심화에 따른 월세전환 증가 추세 확인\n- 월세가격 전국 0.20% 상승, 역세권 주택 중심 수도권 수요 견조\n- 전국 전월세전환율 6.35%, 매매 대비 전세가율 85.18%, 수익률 5.55% 산출 완료",
    nextPlan:"- '25년 3분기 주택가격동향조사 준비 (7월 조사 개시)\n- 시도별 표본 유지·교체 현황 점검 및 조사원 배정\n- 조사 결과 검증 및 통계청 보고 (10월 예정)\n- 규모별(4구간: 40㎡ 이하 등) 지수 이상치 검증 작업",
    special:"- 서울 매매 보합(0.00%) 전환: 중대형 상승·초소형 하락 상쇄 (전분기 +0.03%)\n- 인천 전세 하락폭 확대(-0.47%→-0.64%): 전세사기 우려 지속\n- 전국 매매가 대비 전세가율 85.18% — 고위험 임계치 근접, 모니터링 강화 필요",
  },
};

/* ── 차트 데이터 ── */
// 주택가격동향조사 — 가격지수 월별 추이
const INDEX_TREND=[
  {month:'2025.4월', 매매:97.82, 전세:98.67, 월세:101.79},
  {month:'2025.5월', 매매:97.71, 전세:98.58, 월세:101.85},
  {month:'2025.6월', 매매:97.57, 전세:98.49, 월세:101.92},
];
// 지역별 전분기 변동률
const REGION_RATE=[
  {area:'전국',  매매:-0.39, 전세:-0.25, 월세:0.20},
  {area:'수도권',매매:-0.34, 전세:-0.23, 월세:0.25},
  {area:'서울',  매매:0.00,  전세:-0.02, 월세:0.28},
  {area:'인천',  매매:-0.91, 전세:-0.64, 월세:0.08},
  {area:'경기',  매매:-0.47, 전세:-0.31, 월세:0.28},
];
// 주간/월간 실적 차트 데이터
const WEEKLY_CHART=[
  {item:'현장조사', 완료:8, 목표:10},
  {item:'가격검토', 완료:3, 목표:5},
  {item:'의견서',   완료:2, 목표:2},
];
const MONTHLY_CHART=[
  {item:'현장조사', 완료:47, 목표:50},
  {item:'가격검토', 완료:18, 목표:20},
  {item:'이의신청', 완료:11, 목표:15},
];
const FIELD_CHART=[
  {item:'대상 필지', 완료:5, 목표:5},
  {item:'사례 수집', 완료:8, 목표:10},
  {item:'현황 기록', 완료:3, 목표:3},
];

const CustomTooltip=({active,payload,label})=>{
  if(!active||!payload?.length) return null;
  return(
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-[11px]">
      <div className="font-black text-slate-700 mb-1">{label}</div>
      {payload.map(p=>(
        <div key={p.name} className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{background:p.color}}/>
          <span className="text-slate-600">{p.name}:</span>
          <span className="font-bold" style={{color:p.color}}>{p.value}{typeof p.value==='number'&&p.value<=10?'건':''}</span>
        </div>
      ))}
    </div>
  );
};

/* ── 도메인 이관: REB 기본 콘텐츠 (모듈 상수) ── */
// 보도자료(통계 보고) 레이아웃용 데이터
const PRESS_KPI_CARDS=[
  {label:'매매가격',value:'▼ 0.39%',sub:'전분기 -0.39%',color:'#dc2626'},
  {label:'전세가격',value:'▼ 0.25%',sub:'전분기 -0.22%',color:'#dc2626'},
  {label:'월세가격',value:'▲ 0.20%',sub:'전분기 +0.49%',color:'#16a34a'},
  {label:'전월세전환율',value:'6.35%',sub:'수익률 5.55%',color:'#1e40af'},
];
const PRESS_KPI_STATS=[
  {label:'전국 매매 평균가격',value:'221,662천원'},
  {label:'전국 전세가율',value:'85.18%'},
  {label:'서울 월세 평균',value:'914천원/월'},
];
const PRESS_SECTIONS=[
  {num:'1',title:'매매가격동향',
    regions:[{area:'전국',rate:'-0.39%',prev:'-0.39%'},{area:'수도권',rate:'-0.34%',prev:'-0.31%'},{area:'지방',rate:'-0.56%',prev:'-0.72%'}],
    details:[
      {area:'서울',rate:'0.00%',note:'중대형 주택 상승 + 초소형 하락 상쇄 → 보합 전환 (전분기 0.03%→0.00%)'},
      {area:'인천',rate:'-0.91%',note:'입주예정 매물 누적 하락세 지속. 역세권 신축 매수 문의 증가로 하락폭 소폭 축소 (-0.96%→-0.91%)'},
      {area:'경기',rate:'-0.47%',note:'신도시 신축 공급 과잉이 하락 주도. 노후 단지 투자 수요 감소로 하락폭 확대 (-0.40%→-0.47%)'},
    ],
  },
  {num:'2',title:'전세가격동향',
    regions:[{area:'전국',rate:'-0.25%',prev:'-0.22%'},{area:'수도권',rate:'-0.23%',prev:'-0.16%'},{area:'지방',rate:'-0.30%',prev:'-0.44%'}],
    details:[
      {area:'서울',rate:'-0.02%',note:'이사철 마무리로 이주 수요 감소. 전세기피·월세전환 증가로 상승→하락 전환 (0.01%→-0.02%)'},
      {area:'인천',rate:'-0.64%',note:'전세사기·역전세 우려로 전세기피 지속. 노후 주택 중심 하락폭 확대 (-0.47%→-0.64%)'},
      {area:'경기',rate:'-0.31%',note:'매매가 하락에 따른 보증금 미반환 불안 확산. 공급 과잉 지역 중심 하락폭 확대 (-0.22%→-0.31%)'},
    ],
  },
  {num:'3',title:'월세가격동향',
    regions:[{area:'전국',rate:'+0.20%',prev:'+0.49%'},{area:'수도권',rate:'+0.25%',prev:'+0.56%'},{area:'지방',rate:'+0.04%',prev:'+0.20%'}],
    details:[
      {area:'서울',rate:'+0.28%',note:'역세권 입주여건 양호 지역 중심 상승. 이사철 마무리로 상승폭 축소 (0.44%→0.28%)'},
      {area:'인천',rate:'+0.08%',note:'공급 과잉·노후 주택 하락으로 상승폭 대폭 축소 (1.30%→0.08%)'},
      {area:'경기',rate:'+0.28%',note:'교통 양호 지역 월세선호 증가로 상승. 신도시 공급 과잉 지역은 하락 (0.43%→0.28%)'},
    ],
  },
];
const PRESS_INDEX_GROUPS=[
  {label:'매매가격 (2023.12=100.0)',rows:[{a:'전국',v1:'97.82',v2:'97.71',v3:'97.57',c:'-0.39'},{a:'수도권',v1:'98.24',v2:'98.13',v3:'98.02',c:'-0.34'},{a:'서울',v1:'99.70',v2:'99.71',v3:'99.70',c:'0.00'}]},
  {label:'전세가격 (2023.12=100.0)',rows:[{a:'전국',v1:'98.67',v2:'98.58',v3:'98.49',c:'-0.25'},{a:'수도권',v1:'99.03',v2:'98.95',v3:'98.87',c:'-0.23'},{a:'서울',v1:'99.81',v2:'99.79',v3:'99.80',c:'-0.02'}]},
  {label:'월세가격 (2023.12=100.0)',rows:[{a:'전국',v1:'101.79',v2:'101.85',v3:'101.92',c:'+0.20'},{a:'수도권',v1:'102.31',v2:'102.38',v3:'102.47',c:'+0.25'},{a:'서울',v1:'102.24',v2:'102.33',v3:'102.42',c:'+0.28'}]},
];
const PRESS_RATIO_DATA=[
  {area:'서울',전세가율:88.34,수익률:4.82},
  {area:'인천',전세가율:87.20,수익률:5.41},
  {area:'경기',전세가율:86.72,수익률:5.13},
  {area:'부산',전세가율:83.45,수익률:5.77},
  {area:'전국',전세가율:85.18,수익률:5.55},
];

/* 인쇄용 HTML 빌더 — (args, C, org) 계약.
   본문 데이터는 C(CONTENT_DEFAULTS+팩 병합)의 press* 키에서 생성하고, 조직명·브랜드색은 org에서 취한다.
   팩은 press* 데이터만 공급하면 인쇄물이 완성되며, 필요 시 함수 자체를 통째로 교체할 수도 있다.
   buildPressHtml: 보도자료(통계) 레이아웃 / buildReportHtml: 일반 보고서 레이아웃 */
/* 인쇄 HTML의 조직 폴백 — 호출부(downloadDoc)는 항상 domain 기반 org를 넘긴다 */
const FALLBACK_ORG={name:'조직명',short:'ORG',color:'#334155',en:'ORGANIZATION'};

/* ── 인쇄용 SVG 생성 헬퍼 — 기존 인쇄 마크업 구조(HTML/CSS·SVG 차트) 유지, 값·라벨·색만 데이터에서 ── */
const _r=v=>Math.round(v*100)/100;
const _tick=v=>{const n=+v||0;const a=Math.abs(n);return String(parseFloat(a>=100?n.toFixed(0):a>=10?n.toFixed(1):n.toFixed(2)));};
const _signTick=v=>(+v>0?'+':'')+_tick(v);
const _valLabel=v=>{const n=+v||0;return Math.abs(n)>=10?String(parseFloat(n.toFixed(1))):String(n);};
const _rateColor=v=>{const s=String(v??'').trim();return s.startsWith('-')?'#dc2626':s.startsWith('+')?'#16a34a':'#475569';};

/* 좌측 카드: 지표 월별 추이 꺾은선 (pressTrendData/pressTrendSeries/pressTrendDomain) */
const _pressTrendSvg=C=>{
  const data=C.pressTrendData||[],series=C.pressTrendSeries||[];
  const [mn,mx]=C.pressTrendDomain||[0,100];const rg=(mx-mn)||1;
  const X0=40,W=250,Y0=10,H=110,PAD=35;
  const xi=i=>_r(data.length>1?X0+PAD+i*(W-2*PAD)/(data.length-1):X0+W/2);
  const yi=v=>_r(Y0+(mx-(+v||0))/rg*H);
  const grid=[1,2,3].map(k=>`<line x1="${X0}" y1="${_r(Y0+k*H/4)}" x2="${X0+W}" y2="${_r(Y0+k*H/4)}" stroke="#e2e8f0" stroke-dasharray="3,3"/>`).join('');
  const yLbls=[0,1,2,3].map(k=>`<text x="${X0-4}" y="${_r(Y0+k*H/4+4)}" text-anchor="end" font-size="7" fill="#94a3b8">${_tick(mx-k*rg/4)}</text>`).join('');
  const xLbls=data.map((d,i)=>`<text x="${xi(i)}" y="132" text-anchor="middle" font-size="8" fill="#64748b">${String(d.month??'').replace(/^\d+\./,'')}</text>`).join('');
  const lines=series.map(s=>{
    const pts=data.map((d,i)=>`${xi(i)},${yi(d[s.key])}`).join(' ');
    const dots=data.map((d,i)=>`<circle cx="${xi(i)}" cy="${yi(d[s.key])}" r="3.5" fill="${s.color}"/>`).join('');
    const f=data[0],l=data[data.length-1];
    const lbls=f&&l?`<text x="${_r(xi(0)-3)}" y="${_r(yi(f[s.key])-5)}" text-anchor="end" font-size="7" fill="${s.color}" font-weight="700">${f[s.key]}</text><text x="${_r(xi(data.length-1)+4)}" y="${_r(yi(l[s.key])+3)}" font-size="7" fill="${s.color}" font-weight="700">${l[s.key]}</text>`:'';
    return `<polyline points="${pts}" fill="none" stroke="${s.color}" stroke-width="2.5" stroke-linejoin="round"/>${dots}${lbls}`;
  }).join('');
  const legend=series.map((s,i)=>`<rect x="${60+i*50}" y="140" width="16" height="3" rx="1" fill="${s.color}"/><text x="${80+i*50}" y="143" font-size="7" fill="#64748b">${s.key}</text>`).join('');
  return `<svg viewBox="0 0 310 155" width="100%" style="display:block;margin-bottom:6px">
      <defs><linearGradient id="gBg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f0f9ff"/><stop offset="100%" stop-color="#f8fafc"/></linearGradient></defs>
      <rect x="${X0}" y="${Y0}" width="${W}" height="${H}" fill="url(#gBg)" rx="3"/>
      ${grid}${yLbls}${xLbls}${lines}${legend}
    </svg>`;
};

/* 우측 카드: 그룹 막대 (pressBarData/pressBarSeries) — 값<0이면 color, 0 이상이면 posColor (화면 미리보기와 동일 규칙) */
const _pressBarSvg=C=>{
  const data=C.pressBarData||[],series=C.pressBarSeries||[];
  const X0=40,W=250,Y0=10,H=110,BW=10,GAP=3;
  const vals=data.flatMap(d=>series.map(s=>+d[s.key]||0));
  let P=Math.max(0,...vals)*1.15,N=Math.min(0,...vals)*1.15;
  if(P-N===0){P=1;N=-1;}
  const sc=H/(P-N);const zy=_r(Y0+P*sc);
  const slot=data.length?W/data.length:W;const gw=series.length*BW+(series.length-1)*GAP;
  const groups=data.map((d,i)=>{
    const gx=X0+i*slot+(slot-gw)/2;
    const bars=series.map((s,j)=>{
      const v=+d[s.key]||0;const h=Math.max(_r(Math.abs(v)*sc),1);
      return `<rect x="${_r(gx+j*(BW+GAP))}" y="${v>=0?_r(zy-h):zy}" width="${BW}" height="${h}" rx="2" fill="${v<0?s.color:s.posColor}"/>`;
    }).join('');
    return `<g>${bars}<text x="${_r(gx+gw/2)}" y="132" text-anchor="middle" font-size="7.5" fill="#334155" font-weight="700">${d.area}</text></g>`;
  }).join('');
  const yLbls=[
    P>0?`<text x="${X0-4}" y="${Y0+4}" text-anchor="end" font-size="7" fill="#94a3b8">${_signTick(P)}</text>`:'',
    `<text x="${X0-4}" y="${_r(zy+3)}" text-anchor="end" font-size="7" fill="#94a3b8">0</text>`,
    N<0?`<text x="${X0-4}" y="${Y0+H+4}" text-anchor="end" font-size="7" fill="#94a3b8">${_signTick(N)}</text>`:'',
  ].join('');
  const legend=series.map((s,i)=>`<rect x="${60+i*50}" y="140" width="10" height="5" rx="1" fill="${s.color}"/><text x="${74+i*50}" y="145" font-size="7" fill="#64748b">${s.key}</text>`).join('');
  return `<svg viewBox="0 0 310 155" width="100%" style="display:block;margin-bottom:6px">
      <rect x="${X0}" y="${Y0}" width="${W}" height="${H}" fill="#fafbfd" rx="3"/>
      <line x1="${X0}" y1="${_r(Y0+H*0.25)}" x2="${X0+W}" y2="${_r(Y0+H*0.25)}" stroke="#e2e8f0" stroke-dasharray="3,3"/>
      <line x1="${X0}" y1="${zy}" x2="${X0+W}" y2="${zy}" stroke="#94a3b8" stroke-width="1.2"/>
      <line x1="${X0}" y1="${_r(Y0+H*0.75)}" x2="${X0+W}" y2="${_r(Y0+H*0.75)}" stroke="#e2e8f0" stroke-dasharray="3,3"/>
      ${yLbls}${groups}${legend}
    </svg>`;
};

/* 이중축 막대 (pressRatioData) — 좌축 leftKey는 threshold 이상이면 경고색, 우축 rightKey (화면 미리보기와 동일 규칙) */
const _pressRatioSvg=C=>{
  const data=C.pressRatioData||[];const lk=C.pressRatioLeftKey,rk=C.pressRatioRightKey;
  const [lmn,lmx]=C.pressRatioLeftDomain||[0,100];const lrg=(lmx-lmn)||1;
  const [rmn,rmx]=C.pressRatioRightDomain||[0,10];const rrg=(rmx-rmn)||1;
  const th=C.pressRatioThreshold;
  const X0=50,W=270,Y0=10,H=105,BOT=Y0+H;
  const yl=v=>_r(Y0+(lmx-(+v||0))/lrg*H),yr=v=>_r(Y0+(rmx-(+v||0))/rrg*H);
  const grid=[0,1,2,3,4].map(k=>`<line x1="${X0}" y1="${_r(Y0+k*H/4)}" x2="${X0+W}" y2="${_r(Y0+k*H/4)}" stroke="#e2e8f0" stroke-dasharray="3,3"/><text x="${X0-4}" y="${_r(Y0+k*H/4+4)}" text-anchor="end" font-size="7" fill="#94a3b8">${_tick(lmx-k*lrg/4)}%</text>`).join('');
  const thLine=th!=null?`<line x1="${X0}" y1="${yl(th)}" x2="${X0+W}" y2="${yl(th)}" stroke="#ef4444" stroke-dasharray="4,3" stroke-width="1"/><text x="${X0+W-2}" y="${_r(yl(th)-3)}" text-anchor="end" font-size="7" fill="#ef4444" font-weight="700">${C.pressRatioRefLabel||''}</text>`:'';
  const slot=data.length?W/data.length:W;
  const groups=data.map((d,i)=>{
    const gx=X0+i*slot+(slot-47)/2;
    const lv=+d[lk]||0,rv=+d[rk]||0;
    const ly=Math.min(yl(lv),BOT-1),ry=Math.min(yr(rv),BOT-1);
    return `<g><rect x="${_r(gx)}" y="${ly}" width="22" height="${_r(BOT-ly)}" rx="3" fill="${th!=null&&lv>=th?'#fca5a5':'#bfdbfe'}"/><rect x="${_r(gx+25)}" y="${ry}" width="22" height="${_r(BOT-ry)}" rx="3" fill="#6ee7b7"/><text x="${_r(gx+11)}" y="${_r(ly-4)}" text-anchor="middle" font-size="7" fill="#3b82f6" font-weight="700">${_valLabel(lv)}%</text><text x="${_r(gx+36)}" y="${_r(ry-4)}" text-anchor="middle" font-size="7" fill="#16a34a" font-weight="700">${_valLabel(rv)}%</text><text x="${_r(gx+23.5)}" y="130" text-anchor="middle" font-size="8" fill="#334155" font-weight="700">${d.area}</text></g>`;
  }).join('');
  const legend=th!=null
    ?`<rect x="65" y="142" width="12" height="5" rx="1" fill="#fca5a5"/><text x="81" y="147" font-size="7" fill="#64748b">${lk}(≥${th}%)</text><rect x="145" y="142" width="12" height="5" rx="1" fill="#bfdbfe"/><text x="161" y="147" font-size="7" fill="#64748b">${lk}(&lt;${th}%)</text><rect x="225" y="142" width="12" height="5" rx="1" fill="#6ee7b7"/><text x="241" y="147" font-size="7" fill="#64748b">${rk}</text>`
    :`<rect x="65" y="142" width="12" height="5" rx="1" fill="#bfdbfe"/><text x="81" y="147" font-size="7" fill="#64748b">${lk}</text><rect x="145" y="142" width="12" height="5" rx="1" fill="#6ee7b7"/><text x="161" y="147" font-size="7" fill="#64748b">${rk}</text>`;
  return `<svg viewBox="0 0 340 155" width="100%" style="display:block;margin-bottom:8px">
    <rect x="${X0}" y="${Y0}" width="${W}" height="${H}" fill="#fafbfd" rx="3"/>
    ${grid}${thLine}${groups}${legend}
  </svg>`;
};

const buildPressHtml=({title,docNum,dept,period,mainWork,nextPlan,special,apvLine,logo},C=CONTENT_DEFAULTS,org=FALLBACK_ORG)=>`<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8">
<title>${title} — ${docNum}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;900&display=swap');
  @page{size:A4;margin:12mm 15mm}
  *{-webkit-print-color-adjust:exact;print-color-adjust:exact;box-sizing:border-box}
  body{font-family:'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif;margin:0;color:#1a202c;font-size:12px;line-height:1.75;word-break:keep-all;letter-spacing:-0.01em}
  .hd{border:1px solid ${org.color};display:grid;grid-template-columns:150px 1fr;grid-template-rows:auto auto;margin-bottom:14px}
  .hd-logo{grid-column:1;grid-row:1/3;display:flex;align-items:center;justify-content:center;padding:14px 12px;background:#fff;border-right:1px solid ${org.color}}
  .hd-logo img{width:120px;height:auto}
  .hd-title{grid-column:2;grid-row:1;display:flex;align-items:center;justify-content:center;padding:14px 12px;background:#e6e6e6;border-bottom:1px solid ${org.color}}
  .hd-h1{font-size:28px;font-weight:900;letter-spacing:.4em;padding-right:.4em;color:${org.color};line-height:1.2}
  .hd-meta{grid-column:2;grid-row:2;display:grid;grid-template-columns:64px 1fr 64px 1fr}
  .hd-ml{display:flex;align-items:center;justify-content:center;padding:6px 8px;background:#dbeafe;border-right:1px solid ${org.color};font-size:10px;font-weight:700;color:${org.color}}
  .hd-mv{display:flex;align-items:center;padding:6px 10px;border-right:1px solid ${org.color};font-size:11px;color:#1a202c;font-weight:600}
  .hd-mv-last{display:flex;flex-direction:column;justify-content:center;gap:2px;padding:6px 10px;font-size:10px;color:#1a202c}
  .kpi{background:#eef2ff;border:1px solid #c7d2fe;border-radius:8px;padding:12px 16px;margin-bottom:12px}
  .kpi-title{font-size:10px;font-weight:800;color:${org.color};margin-bottom:10px}
  .kpi-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:8px}
  .kpi-card{background:#fff;border:1px solid #e0e7ff;border-radius:6px;padding:8px 10px;text-align:center}
  .kpi-lbl{font-size:9px;color:#6b7280;font-weight:700;margin-bottom:3px}
  .kpi-val{font-size:16px;font-weight:900;line-height:1.2}
  .kpi-sub{font-size:9px;color:#9ca3af;margin-top:2px}
  .kpi-stat{background:#f8fafc;border:1px solid #e2e8f0;border-radius:5px;padding:5px 8px;display:flex;justify-content:space-between;align-items:center}
  .kpi-sl{font-size:9px;color:#6b7280;font-weight:600}
  .kpi-sv{font-size:11px;color:#1e3a8a;font-weight:800}
  .sh{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:900;color:#1a202c;margin:14px 0 7px}
  .sn{width:20px;height:20px;background:${org.color};color:white;border-radius:3px;display:inline-flex;align-items:center;justify-content:center;font-size:9px;font-weight:900;flex-shrink:0}
  .ml{margin-left:27px}
  .rcard-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-bottom:8px}
  .rcard{background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:6px 10px}
  .rcard-area{font-size:9px;color:#94a3b8;font-weight:700;margin-bottom:1px}
  .rcard-rate{font-size:14px;font-weight:900;line-height:1.2}
  .rcard-prev{font-size:9px;color:#cbd5e1;margin-top:2px}
  .drow{display:flex;gap:6px;font-size:11px;line-height:1.6;align-items:flex-start;margin-bottom:5px}
  .drow-area{font-weight:800;color:${org.color};width:36px;flex-shrink:0}
  .drow-rate{font-weight:700;flex-shrink:0;width:52px}
  .drow-note{color:#475569}
  table.idx{width:100%;border-collapse:collapse;font-size:10px;border:1px solid #e2e8f0}
  table.idx th{background:${org.color};color:#fff;padding:5px 7px;font-weight:700;text-align:left}
  table.idx td{padding:4px 7px;border-bottom:1px solid #f1f5f9}
  table.idx tr.cat td{background:#dbeafe;font-weight:800;color:${org.color}}
  .note{font-size:9px;color:#9ca3af;margin-top:4px}
  table.jw{width:100%;border-collapse:collapse;font-size:10px;border:1px solid #e2e8f0}
  table.jw th{background:${org.color};color:#fff;padding:5px 7px;font-weight:700;text-align:center}
  table.jw td{padding:4px 7px;border-bottom:1px solid #f1f5f9;text-align:center}
  .contact{background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:8px 12px;font-size:10px;color:#64748b;margin-top:14px}
  .sig-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:14px;border-top:2px solid ${org.color};padding-top:12px}
  .sig-box{border:1px solid #cbd5e0;border-radius:5px;overflow:hidden}
  .sig-lbl{background:${org.color};color:white;text-align:center;padding:5px;font-size:10px;font-weight:700}
  .sig-sp{height:48px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:6px;gap:2px}
  .sig-name{font-size:12px;font-weight:700;color:#334155}
  .sig-dept{font-size:10px;color:#94a3b8}
  .footer{text-align:center;font-size:9px;color:#9ca3af;margin-top:10px}
  .red{color:#dc2626}.green{color:#16a34a}.blue{color:#1e40af}.gray{color:#475569}
</style></head><body>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};</script>
<div class="hd">
  <div class="hd-logo"><img src="${logo}" alt="${org.name}"/></div>
  <div class="hd-title"><div class="hd-h1">${title}</div></div>
  <div class="hd-meta">
    <div class="hd-ml">담당부서</div><div class="hd-mv">${dept}</div>
    <div class="hd-ml">문서번호</div>
    <div class="hd-mv-last"><span style="font-family:monospace;font-weight:700">${docNum}</span><span style="color:#6b7280;font-size:9px">수신: 내부결재</span></div>
  </div>
</div>

<table style="width:100%;border-collapse:collapse;font-size:11px;border-top:2px solid ${org.color};margin-bottom:12px">
  <tr style="border-bottom:1px solid #e2e8f0"><td style="padding:5px 8px;font-weight:700;color:${org.color};width:80px">담당 부서</td><td style="padding:5px 8px;font-weight:600" colspan="3">${dept}</td></tr>
  <tr style="border-bottom:1px solid #e2e8f0"><td style="padding:5px 8px;font-weight:700;color:${org.color}">조사 기간</td><td style="padding:5px 8px">${period}</td><td style="padding:5px 8px;font-weight:700;color:${org.color};width:70px">배포 일시</td><td style="padding:5px 8px">${C.pressDistDate||''}</td></tr>
  <tr style="border-bottom:1px solid #e2e8f0"><td style="padding:5px 8px;font-weight:700;color:${org.color}">주요 내용</td><td style="padding:5px 8px;font-size:10px" colspan="3">${mainWork.replace(/\n/g,'<br/>')}</td></tr>
</table>

<div class="kpi">
  <div class="kpi-title">${C.pressKpiTitle||''}</div>
  <div class="kpi-grid">
    ${(C.pressKpiCards||[]).map(c=>`<div class="kpi-card"><div class="kpi-lbl">${c.label}</div><div class="kpi-val" style="color:${c.color}">${c.value}</div><div class="kpi-sub">${c.sub}</div></div>`).join('')}
  </div>
  <div style="display:grid;grid-template-columns:repeat(${(C.pressKpiStats||[]).length||3},1fr);gap:6px">
    ${(C.pressKpiStats||[]).map(s=>`<div class="kpi-stat"><span class="kpi-sl">${s.label}</span><span class="kpi-sv">${s.value}</span></div>`).join('')}
  </div>
</div>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px">
    <div style="font-size:10px;font-weight:800;color:${org.color};margin-bottom:6px;letter-spacing:0.03em">${C.pressTrendTitle||''}</div>
    ${_pressTrendSvg(C)}
  </div>
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px">
    <div style="font-size:10px;font-weight:800;color:${org.color};margin-bottom:6px;letter-spacing:0.03em">${C.pressBarTitle||''}</div>
    ${_pressBarSvg(C)}
  </div>
</div>

${(C.pressSections||[]).map(sec=>`<div class="sh"><span class="sn">${sec.num}</span> ${sec.title}</div>
<div class="ml">
  <div class="rcard-grid">
    ${(sec.regions||[]).map(g=>`<div class="rcard"><div class="rcard-area">${g.area}</div><div class="rcard-rate" style="color:${_rateColor(g.rate)}">${g.rate}</div><div class="rcard-prev">전분기 ${g.prev}</div></div>`).join('')}
  </div>
  ${(sec.details||[]).map(d=>`<div class="drow"><span class="drow-area">${d.area}</span><span class="drow-rate" style="color:${_rateColor(d.rate)}">(${d.rate})</span><span class="drow-note">${d.note}</span></div>`).join('')}
</div>`).join('\n')}

<div class="sh"><span class="sn">${(C.pressSections||[]).length+1}</span> ${C.pressIndexTitle||''}</div>
<div class="ml">
  <table class="idx">
    <thead><tr>${(C.pressIndexHead||[]).map(h=>`<th>${h}</th>`).join('')}</tr></thead>
    <tbody>
      ${(C.pressIndexGroups||[]).map(g=>`<tr class="cat"><td colspan="${(C.pressIndexHead||[]).length||5}">${g.label}</td></tr>`+(g.rows||[]).map(rw=>`<tr><td>${rw.a}</td><td>${rw.v1}</td><td>${rw.v2}</td><td>${rw.v3}</td><td style="color:${_rateColor(rw.c)}">${rw.c}</td></tr>`).join('')).join('\n      ')}
    </tbody>
  </table>
  <p class="note">${C.pressIndexNote||''}</p>
</div>

<div class="sh"><span class="sn">${(C.pressSections||[]).length+2}</span> ${C.pressRatioTitle||''}</div>
<div class="ml">
  ${_pressRatioSvg(C)}
  <table class="jw">
    <thead><tr><th>구분</th><th>${C.pressRatioLeftKey||''}(%)</th><th>${C.pressRatioRightKey||''}(%)</th><th>고위험 여부</th></tr></thead>
    <tbody>
      ${(C.pressRatioData||[]).map((row,i,arr)=>{const lv=+row[C.pressRatioLeftKey]||0;const hi=C.pressRatioThreshold!=null&&lv>=C.pressRatioThreshold;const last=i===arr.length-1;return `<tr${last?' style="background:#f0f9ff;font-weight:700"':''}><td>${row.area}</td><td class="blue">${row[C.pressRatioLeftKey]}</td><td class="green">${row[C.pressRatioRightKey]}</td><td class="${hi?'red':'gray'}"${hi?' style="font-weight:700"':''}>${hi?'고위험':'정상'}</td></tr>`;}).join('\n      ')}
    </tbody>
  </table>
  <p class="note">${C.pressRatioNote||''}</p>
</div>

<div class="sh"><span class="sn">${(C.pressSections||[]).length+3}</span> 향후 계획</div>
<div class="ml" style="font-size:11px;color:#374151;line-height:1.9">${nextPlan.replace(/\n/g,'<br/>')}</div>

<div class="sh"><span class="sn">${(C.pressSections||[]).length+4}</span> 특이 사항</div>
<div class="ml" style="font-size:11px;color:#374151;line-height:1.9">${(special||'(해당 없음)').replace(/\n/g,'<br/>')}</div>

<div class="contact">
  <span style="font-weight:700;color:${org.color}">문의</span>　${C.pressContact||''}
</div>

<div class="sig-grid">
  ${(apvLine||[]).map(p=>`<div class="sig-box"><div class="sig-lbl">${p.role}</div><div class="sig-sp"><div class="sig-name">${p.name}</div><div class="sig-dept">${p.dept}</div></div></div>`).join('')}
</div>
<p class="footer">본 보고서는 GENOS AI 보고서 작성 에이전트에 의해 자동 생성되었으며, 담당자 검토 후 확정됩니다.</p>
</body></html>`;

const buildReportHtml=({title,docNum,dept,period,mainWork,nextPlan,special,logo},C=CONTENT_DEFAULTS,org=FALLBACK_ORG)=>`<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>${title} — ${docNum}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700;900&display=swap');
      @page{size:A4;margin:15mm 18mm}
      *{-webkit-print-color-adjust:exact;print-color-adjust:exact;box-sizing:border-box}
      body{font-family:'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif;margin:0;color:#1a202c;font-size:14px;line-height:1.9;word-break:keep-all;letter-spacing:-0.01em}
      .hd{border:1px solid ${org.color}}
      .hd-grid{display:grid;grid-template-columns:170px 1fr;grid-template-rows:auto auto}
      .hd-logo{grid-column:1;grid-row:1/3;display:flex;align-items:center;justify-content:center;padding:16px 14px;background:#fff;border-right:1px solid ${org.color}}
      .hd-logo img{width:130px;height:auto}
      .hd-title{grid-column:2;grid-row:1;display:flex;align-items:center;justify-content:center;padding:16px 12px;background:#e6e6e6;border-bottom:1px solid ${org.color}}
      .hd-meta{grid-column:2;grid-row:2;display:grid;grid-template-columns:72px 1fr 72px 1fr}
      .hd-h1{font-size:34px;font-weight:900;letter-spacing:.4em;padding-right:.4em;white-space:nowrap;font-family:'HY견고딕','돋움','맑은 고딕',sans-serif;color:${org.color};line-height:1.2}
      .hd-meta-lbl{display:flex;align-items:center;justify-content:center;padding:7px 10px;background:#dfeaf5;border-right:1px solid ${org.color};font-size:12px;font-weight:700;color:${org.color}}
      .hd-meta-val{display:flex;align-items:center;padding:7px 12px;border-right:1px solid ${org.color};font-size:13.5px;color:#1a202c;font-weight:600}
      .hd-meta-val-last{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:2px;padding:7px 12px;font-size:12px;color:#1a202c}
      .body{background:white;padding:24px 30px}
      .info-tbl{width:100%;border-collapse:collapse;border-top:2px solid ${org.color};margin-bottom:18px}
      .info-tbl td{padding:9px 11px;border-bottom:1px solid #e2e8f0;font-size:13.5px;line-height:1.7}
      .lbl{font-weight:700;color:${org.color};width:72px;white-space:nowrap}
      .sh{display:flex;align-items:center;gap:8px;font-size:15.5px;font-weight:900;color:#1a202c;margin:20px 0 9px}
      .sn{width:22px;height:22px;background:${org.color};color:white;border-radius:3px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;flex-shrink:0}
      .sc{margin-left:30px;font-size:14px;color:#374151;line-height:2.0;word-break:keep-all}
      .sig-area{border-top:2px solid ${org.color};padding-top:14px;margin-top:20px}
      .sig-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
      .sig-box{border:1px solid #cbd5e0;border-radius:5px;overflow:hidden}
      .sig-lbl{background:${org.color};color:white;text-align:center;padding:6px;font-size:12px;font-weight:700}
      .sig-sp{height:54px}
      .footer{text-align:center;font-size:11px;color:#a0aec0;margin-top:12px}
    </style></head><body>
    <script>window.onload=function(){window.print();window.onafterprint=function(){window.close();};};</script>
    <div class="hd">
      <div class="hd-grid">
        <div class="hd-logo"><img src="${logo}" alt="${org.short} ${org.name}"/></div>
        <div class="hd-title"><div class="hd-h1">${title}</div></div>
        <div class="hd-meta">
          <div class="hd-meta-lbl">담당부서</div>
          <div class="hd-meta-val">${dept}</div>
          <div class="hd-meta-lbl">문서번호</div>
          <div class="hd-meta-val-last"><span style="font-family:monospace;font-weight:700">${docNum}</span><span style="color:#6b7280;font-size:9px">수신: 내부결재</span></div>
        </div>
      </div>
    </div>
    <div class="body">
      <table class="info-tbl">
        <tr><td class="lbl">보고 부서</td><td><strong>${dept}</strong></td><td class="lbl">문서번호</td><td><strong>${docNum}</strong></td></tr>
        <tr><td class="lbl">보고 기간</td><td colspan="3">${period}</td></tr>
      </table>
      <div class="sh"><span class="sn">1</span> 주요 실적</div>
      <div class="sc">${mainWork.split('\n').map(l=>`<p>${l}</p>`).join('')}</div>
      <div class="sh"><span class="sn">2</span> 차주 계획</div>
      <div class="sc">${nextPlan.split('\n').map(l=>`<p>${l}</p>`).join('')}</div>
      <div class="sh"><span class="sn">3</span> 특이 사항</div>
      <div class="sc">${(special||'(해당 없음)').split('\n').map(l=>`<p>${l}</p>`).join('')}</div>
      <div class="sig-area">
        <div class="sig-grid">${['작  성  자','검  토  자','승  인  자'].map(r=>`<div class="sig-box"><div class="sig-lbl">${r}</div><div class="sig-sp"></div></div>`).join('')}</div>
        <p class="footer">본 보고서는 GENOS AI 보고서 작성 에이전트에 의해 자동 생성되었으며, 담당자 검토 후 확정됩니다.</p>
      </div>
    </div>
    </body></html>`;

/* 도메인 이관: REB 기본 콘텐츠 — 도메인 팩 agentContent["agent-report"]로 키 단위 오버라이드 */
export const CONTENT_DEFAULTS={
  headerTitle:'보고서 템플릿 자동 작성 에이전트',            // string — 미제공 시 허브 카탈로그 이름 승계
  headerDesc:'표준 양식 선택 → 정보 입력 → AI 보고서 자동 생성', // string — 헤더 설명(작업 흐름)
  apvLine: APV_LINE,                        // {name,dept,title,role}[3] — 작성자→검토자→승인자 순. [0]이 작성자 서명에 쓰임
  reportTypes: REPORT_TYPES,                // {id,label,icon(이모지),desc}[5] — 첫 항목이 초기 선택값
  docNums: DOC_NUMS,                        // {[typeId]: 문서번호} — reportTypes 전 id 매핑 권장
  docNumFallback:'KREA-부동산공시처-2026-027', // docNums 미매핑 typeId의 문서번호
  reportDefaults: REPORT_DEFAULTS,          // {[typeId]:{dept,period,mainWork,nextPlan,special}} — 유형 선택 시 입력폼 자동 채움
  reportDate:'2026. 03. 13.',               // 일반 보고서 작성일 표기
  approvalSystem:'WorksOn',                 // 전자결재 시스템명 (배지·링크 문구)
  apvRefNo:'APV-2026-0313-027',             // 결재 진행 참조번호
  logo: null,                          // 미제공 시 도메인 정보로 레터헤드 자동 생성
  logoAlt: null,                            // 미제공 시 '<약칭> <조직명>'
  perfCharts:{                              // {[typeId]:{label,data:{item,[perfDoneKey],[perfGoalKey]}[3]}} — 미매핑 typeId는 첫 항목 사용
    weekly:{label:'주간',data:WEEKLY_CHART},
    monthly:{label:'월간',data:MONTHLY_CHART},
    field:{label:'현장조사',data:FIELD_CHART},
  },
  perfDoneKey:'완료', perfGoalKey:'목표',     // 실적 차트 dataKey — perfCharts data 행의 키와 일치해야 함
  pressTypeId:'officetel',                  // 보도자료(통계) 레이아웃을 쓰는 reportTypes id — 없는 id를 주면 비활성
  pressDistDate:'2025년 7월 15일 (화)',      // 보도자료 배포 일시
  pressDate:'2025. 07. 15.',                // 보도자료 작성일 표기
  pressKpiTitle:'▪ 2025년 2분기 주택가격동향 핵심 지표 (전분기 대비)', // KPI 박스 제목
  pressKpiCards: PRESS_KPI_CARDS,           // {label,value,sub,color(hex)}[4] — KPI 카드
  pressKpiStats: PRESS_KPI_STATS,           // {label,value}[3] — KPI 하단 보조 지표
  pressTrendTitle:'▪ 가격지수 월별 추이 (2023.12=100.0)', // 좌측 꺾은선 차트 제목
  pressTrendData: INDEX_TREND,              // {month,...시리즈키}[3] — 시리즈키는 pressTrendSeries.key와 일치
  pressTrendSeries:[{key:'매매',color:'#dc2626'},{key:'전세',color:'#2563eb'},{key:'월세',color:'#16a34a'}], // {key,color}[3]
  pressTrendDomain:[96.5,103],              // 꺾은선 Y축 [min,max]
  pressBarTitle:'▪ 지역별 변동률 (전분기 대비, %)', // 우측 막대 차트 제목
  pressBarData: REGION_RATE,                // {area,...시리즈키}[5] — 시리즈키는 pressBarSeries.key와 일치
  pressBarSeries:[{key:'매매',color:'#fca5a5',posColor:'#86efac'},{key:'전세',color:'#93c5fd',posColor:'#6ee7b7'},{key:'월세',color:'#6ee7b7',posColor:'#86efac'}], // 값<0이면 color, 0 이상이면 posColor
  pressSections: PRESS_SECTIONS,            // {num,title,regions:{area,rate,prev}[3],details:{area,rate,note}[3]}[3] — 본문 섹션 1~3
  pressIndexTitle:'2025년 4~6월 가격지수 및 변동률', // 섹션 4 제목
  pressIndexHead:['구분','2025.4','2025.5','2025.6','전분기 변동률(%)'], // string[5] — 지수 테이블 헤더
  pressIndexGroups: PRESS_INDEX_GROUPS,     // {label,rows:{a,v1,v2,v3,c}[3]}[3] — 그룹 헤더행 label + 데이터행
  pressIndexNote:'* 지수산정: 제본스지수 | 통계청 국가통계 승인번호 408002', // 지수 테이블 각주
  pressRatioTitle:'지역별 전세가율 및 수익률', // 섹션 5 제목
  pressRatioData: PRESS_RATIO_DATA,         // {area,[leftKey]:number,[rightKey]:number}[5]
  pressRatioLeftKey:'전세가율', pressRatioRightKey:'수익률', // 이중축 막대 dataKey — pressRatioData 행 키와 일치
  pressRatioLeftDomain:[78,92], pressRatioRightDomain:[4,7], // 좌·우 Y축 [min,max]
  pressRatioThreshold:85,                   // leftKey 값이 이 이상이면 경고색 막대
  pressRatioRefLabel:'위험선 85%',           // 기준선 라벨
  pressRatioNote:'* 전세가율 85% 이상(빨간 막대): 전세사기·깡통전세 고위험 임계치 | 수익률: 월세 연환산 ÷ 전세보증금', // 섹션 5 각주
  pressContact:'부동산통계처 상업자산통계부장 최윤주 ☎ (053)663-8531 | 담당 차장 박병희 ☎ (053)663-8532　｜　자료확인: R-ONE 부동산통계정보시스템 www.reb.or.kr/r-one', // 문의처 1줄 ('문의' 라벨은 코어)
  buildPressHtml,                           // ({title,docNum,dept,period,mainWork,nextPlan,special,apvLine,logo}, C, org:{name,short,color,en})=>html — 보도자료 인쇄본. 본문은 C의 press* 키에서 생성되므로 팩은 데이터만 공급하면 됨(함수 통째 교체도 가능)
  buildReportHtml,                          // ({title,docNum,dept,period,mainWork,nextPlan,special,logo}, C, org)=>html — 일반 보고서 인쇄본. 조직 표기·색만 org 사용(함수 통째 교체도 가능)
};

const ReportAgent=({onBack,domain})=>{
  const C={...CONTENT_DEFAULTS,...(domain?.agentContent?.["agent-report"]||{})};

  /* 문서 레터헤드 — 팩이 자체 로고를 주면 그것을, 아니면 도메인 정보로 생성.
     (기본값이 REB 래스터 로고여서 타 분야 문서에 한국부동산원이 찍히던 문제) */
  const orgMeta = { name: domain?.orgName || '조직명', short: domain?.orgShort || 'ORG', color: domain?.brandColor || '#334155' };
  const docLogo = C.logo || orgLogoDataUri(orgMeta);
  const docLogoAlt = C.logoAlt || `${orgMeta.short} ${orgMeta.name}`;
  const H=agentHeader(domain,'agent-report',C,AGENT_TEAMS);
  const initialDefaults=C.reportDefaults[C.reportTypes[0].id]||{};
  const {step,setStep,agentIdx,doneIdx,start:startSim,resetSim}=useAgentSimulation(AGENTS,{
    onComplete:()=>setEditResult(buildRawText()),
  });
  const [reportType,setReportType]=useState(C.reportTypes[0].id);
  const [dept,setDept]=useState(initialDefaults.dept||'');
  const [period,setPeriod]=useState(initialDefaults.period||'');
  const [mainWork,setMainWork]=useState(initialDefaults.mainWork||'');
  const [nextPlan,setNextPlan]=useState(initialDefaults.nextPlan||'');
  const [special,setSpecial]=useState(initialDefaults.special||'');
  const [viewMode,setViewMode]=useState('doc');
  const [apvState,setApvState]=useState(null);
  const [apvMsg,setApvMsg]=useState('검토 요청드립니다.');
  const [editResult,setEditResult]=useState('');
  const [tone,setTone]=useState('formal');
  const [length,setLength]=useState('medium');
  const [showExportMenu,setShowExportMenu]=useState(false);
  const [exported,setExported]=useState(null);

  const DOC_NUM=C.docNums[reportType]||C.docNumFallback;

  /* 보고서 유형 변경 시 기본값 자동 세팅 */
  useEffect(()=>{
    const d=C.reportDefaults[reportType];
    if(!d) return;
    setDept(d.dept);
    setPeriod(d.period);
    setMainWork(d.mainWork);
    setNextPlan(d.nextPlan);
    setSpecial(d.special);
  },[reportType]);

  const startProcess=()=>startSim();

  const reset=()=>{resetSim();setApvState(null);setApvMsg('검토 요청드립니다.');setShowExportMenu(false);};
  const submitApv=()=>{setApvState('submitting');setTimeout(()=>{setApvState('done');},1600);};

  const buildRawText=()=>`[${C.reportTypes.find(t=>t.id===reportType)?.label||C.reportTypes[0].label}]

부서: ${dept}
기간: ${period}
문서번호: ${DOC_NUM}

1. 주요 실적
${mainWork}

2. 차주 계획
${nextPlan}

3. 특이 사항
${special||'(해당 없음)'}

작성자: ${C.apvLine[0].name} (${C.apvLine[0].dept} ${C.apvLine[0].title})
작성일: ${C.reportDate}`;

  const selectedType=C.reportTypes.find(t=>t.id===reportType);

  /* 인쇄·내보내기가 같은 문서 HTML을 쓰도록 단일화 */
  const buildHtml=()=>{
    const docTitle=selectedType?.label||C.reportTypes[0].label;
    const org={name:domain?.orgName||'한국부동산원',short:domain?.orgShort||'REB',color:domain?.brandColor||'#003087',en:domain?.orgEn||'KOREA REAL ESTATE BOARD'};
    return {docTitle,html:reportType===C.pressTypeId
      ?C.buildPressHtml({title:docTitle,docNum:DOC_NUM,dept,period,mainWork,nextPlan,special,apvLine:C.apvLine,logo:docLogo},C,org)
      :C.buildReportHtml({title:docTitle,docNum:DOC_NUM,dept,period,mainWork,nextPlan,special,logo:docLogo},C,org)};
  };

  const downloadDoc=()=>{
    const {html}=buildHtml();
    const w=window.open('','_blank','width=900,height=1200');
    w.document.write(html);
    w.document.close();
    w.focus();
  };

  /* 내보내기 — 형식별로 실제 파일을 만들거나 인쇄 대화상자를 띄운다 */
  const exportAs=(ext)=>{
    setShowExportMenu(false);
    const {docTitle,html}=buildHtml();
    if(ext==='pdf'){ // 브라우저 인쇄 → 'PDF로 저장'이 실제 경로
      const w=window.open('','_blank','width=900,height=1200');
      w.document.write(html); w.document.close(); w.focus();
      setTimeout(()=>w.print(),400);
      return;
    }
    downloadTextFile(`${docTitle}_${DOC_NUM}.${ext}`,html,
      ext==='doc'?'application/msword;charset=utf-8':'text/html;charset=utf-8');
    setExported(ext);
    setTimeout(()=>setExported(null),2000);
  };

  if(step===1) return(
    <div className="flex-1 overflow-y-auto px-6 py-8 bg-white">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-2">
          {onBack&&<button onClick={onBack} className="text-slate-400 hover:text-slate-600 text-[11px] font-bold flex items-center gap-1 shrink-0 py-2 pr-2 max-md:py-2.5"><ChevronRight className="w-3.5 h-3.5 rotate-180"/>뒤로</button>}
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-md shrink-0"><FileText className="w-5 h-5 text-white"/></div>
          <div>
            <div className="text-[15px] font-black text-slate-800">{H.title}</div>
            <div className="text-xs text-slate-400">{H.desc}</div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">1 · 보고서 유형 선택</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {C.reportTypes.map(t=>(
              <button key={t.id} onClick={()=>setReportType(t.id)}
                className={cn(
                  'flex flex-col items-start gap-1.5 px-4 py-3.5 border-2 rounded-2xl text-left transition-all',
                  reportType===t.id
                    ?'border-emerald-500 bg-emerald-50 shadow-md shadow-emerald-100'
                    :'border-slate-200 hover:border-emerald-200 hover:bg-slate-50'
                )}>
                <div className="flex items-center gap-2 w-full">
                  <span className="text-xl">{t.icon}</span>
                  <span className={cn('font-black text-[13px]',reportType===t.id?'text-emerald-700':'text-slate-700')}>{t.label}</span>
                  {reportType===t.id&&<CheckCircle className="w-4 h-4 text-emerald-500 ml-auto shrink-0"/>}
                </div>
                <span className="text-[11px] text-slate-400 ml-7 leading-snug">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">2 · 기본 정보</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-500 font-bold mb-1 block">보고 부서</label>
              <input value={dept} onChange={e=>setDept(e.target.value)}
                className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100"/>
            </div>
            <div>
              <label className="text-[11px] text-slate-500 font-bold mb-1 block">보고 기간</label>
              <input value={period} onChange={e=>setPeriod(e.target.value)}
                className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100"/>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">3 · 주요 실적</label>
          <textarea value={mainWork} onChange={e=>setMainWork(e.target.value)} rows={4}
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 resize-none text-slate-700 leading-relaxed"/>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">4 · 차주 계획</label>
          <textarea value={nextPlan} onChange={e=>setNextPlan(e.target.value)} rows={4}
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 resize-none text-slate-700 leading-relaxed"/>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">5 · 특이 사항</label>
            <span className="text-[10px] text-slate-400">(선택)</span>
          </div>
          <textarea value={special} onChange={e=>setSpecial(e.target.value)} rows={2}
            placeholder="특이 사항이 있으면 입력하세요"
            className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-100 resize-none text-slate-700 leading-relaxed"/>
        </div>

        {/* 보고서 톤/길이 설정 */}
        <div className="space-y-4 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4">
          <div className="text-[11px] font-black text-slate-500 uppercase tracking-wider">6 · 보고서 톤 &amp; 길이 설정</div>
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-500">문체 선택</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {TONES.map(t=>(
                <button key={t.id} onClick={()=>setTone(t.id)}
                  className={cn(
                    'flex flex-col items-start px-3 py-2.5 border-2 rounded-xl text-left transition-all',
                    tone===t.id?'border-emerald-400 bg-emerald-50':'border-slate-200 hover:border-emerald-200 bg-white'
                  )}>
                  <span className={cn('text-[12px] font-black',tone===t.id?'text-emerald-700':'text-slate-700')}>{t.label}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 leading-snug">{t.desc}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-500">분량 선택</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {LENGTHS_REPORT.map(l=>(
                <button key={l.id} onClick={()=>setLength(l.id)}
                  className={cn(
                    'flex flex-col items-start px-3 py-2.5 border-2 rounded-xl text-left transition-all',
                    length===l.id?'border-emerald-400 bg-emerald-50':'border-slate-200 hover:border-emerald-200 bg-white'
                  )}>
                  <span className={cn('text-[12px] font-black',length===l.id?'text-emerald-700':'text-slate-700')}>{l.label}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 leading-snug">{l.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button onClick={startProcess}
          className="w-full py-3.5 bg-emerald-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100 text-[15px]">
          <Play className="w-4 h-4 fill-white"/> 보고서 자동 작성 시작
        </button>
      </div>
    </div>
  );

  if(step===2) return(
    <div className="flex-1 flex min-h-0 overflow-hidden">
      <div className="flex-1 min-w-0 flex flex-col items-center justify-center overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-xl px-6">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-100">
              <Radio className="w-7 h-7 text-white animate-pulse"/>
            </div>
            <div className="text-[18px] font-black text-slate-800">멀티 에이전트 보고서 생성 중</div>
            <div className="text-sm text-slate-400 mt-1">표준 양식을 불러오고 AI가 내용을 자동 구성합니다</div>
          </div>
          <div className="space-y-3">
            {AGENTS.map((ag,i)=>{
              const isDone=doneIdx.includes(i);
              const isActive=agentIdx===i;
              const AgIcon=ag.icon;
              return(
                <div key={i}>
                  <div className={cn(
                    'rounded-2xl border-2 p-4 transition-all duration-500',
                    isDone?'border-emerald-200 bg-emerald-50/60':
                    isActive?'border-emerald-300 bg-emerald-50 shadow-md shadow-emerald-100':
                    'border-slate-100 bg-white opacity-50'
                  )}>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all',
                        isDone?'bg-emerald-500':isActive?ag.color:'bg-slate-200'
                      )}>
                        {isDone?<CheckCircle className="w-5 h-5 text-white"/>
                          :<AgIcon className={cn('w-5 h-5',isActive?'text-white animate-pulse':'text-slate-400')}/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn('font-black text-sm',isDone?'text-emerald-700':isActive?'text-emerald-700':'text-slate-400')}>{ag.label}</div>
                        <div className={cn('text-xs mt-0.5',isDone?'text-emerald-500':isActive?'text-emerald-500':'text-slate-300')}>
                          {isActive?`처리 중 — ${ag.sub}`:isDone?`완료 — ${ag.sub}`:ag.sub}
                        </div>
                      </div>
                      {isActive&&<Loader2 className="w-4 h-4 text-emerald-500 animate-spin shrink-0"/>}
                      {isDone&&<span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">완료</span>}
                    </div>
                    {isActive&&<div className="mt-3"><div className="h-1 bg-emerald-100 rounded-full overflow-hidden"><div className="h-1 bg-emerald-500 rounded-full animate-pulse" style={{width:'70%'}}/></div></div>}
                  </div>
                  {i<AGENTS.length-1&&<div className="flex justify-center my-1"><ChevronRight className="w-4 h-4 text-slate-300 rotate-90"/></div>}
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center text-xs text-slate-400">
            <Network className="w-3.5 h-3.5 inline mr-1 text-emerald-400"/>
            GPT-OSS 120B 문서 생성 모델 — 표준 공문서 형식 준수
          </div>
        </div>
      </div>
      <div className="hidden lg:flex w-80 shrink-0 border-l border-slate-100 bg-gradient-to-b from-slate-50 to-white p-4 overflow-y-auto custom-scrollbar flex-col">
        <AgentWorkflowPanel agentId="agent-report" activeStep={agentIdx} doneSteps={doneIdx} />
      </div>
    </div>
  );

  return(
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-100">
      <div className="shrink-0 bg-white border-b px-5 py-2.5 flex items-center gap-2 flex-wrap shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0"><CheckCircle className="w-3.5 h-3.5 text-white"/></div>
          <div className="min-w-0">
            <div className="text-[13px] font-black text-slate-800 truncate">보고서 생성 완료</div>
            <div className="text-[10px] text-slate-400">{selectedType?.label} · {DOC_NUM}</div>
          </div>
        </div>
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
          {[['doc','문서 보기'],['edit','원본 편집']].map(([m,l])=>(
            <button key={m} onClick={()=>setViewMode(m)}
              className={cn('px-3 py-1.5 rounded-md text-[11px] font-bold transition-all',
                viewMode===m?'bg-white text-emerald-700 shadow-sm':'text-slate-500 hover:text-slate-700')}>
              {m==='doc'?<Eye className="w-3 h-3 inline mr-1"/>:<Edit3 className="w-3 h-3 inline mr-1"/>}{l}
            </button>
          ))}
        </div>
        <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-[11px] font-bold text-slate-500 hover:bg-slate-50 transition-colors"><RotateCcw className="w-3 h-3"/>새 보고서</button>
        {/* 내보내기 드롭다운 */}
        <div className="relative">
          <button onClick={()=>setShowExportMenu(p=>!p)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 rounded-lg text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Download className="w-3 h-3"/>내보내기 ▾
          </button>
          {showExportMenu&&(
            <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
              {EXPORT_FORMATS.map(fmt=>(
                <button key={fmt.ext}
                  onClick={()=>exportAs(fmt.ext)}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left">
                  <span className="text-base">{fmt.icon}</span>
                  <span className={cn('text-[12px] font-bold',fmt.color)}>
                    {exported===fmt.ext?'내려받음':fmt.label}
                  </span>
                </button>
              ))}
              <p className="px-4 py-2 text-[10px] text-slate-400 border-t leading-relaxed">
                한글(.hwpx) 변환은 실서비스에서 문서 변환 서버를 경유합니다
              </p>
            </div>
          )}
        </div>
        <button onClick={downloadDoc} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-700 transition-colors shadow-sm"><Printer className="w-3 h-3"/>출력</button>
        {apvState!=='done'
          ?<button onClick={()=>setApvState('selfcheck')} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-800 transition-colors shadow-sm"><FileCheck className="w-3 h-3"/>결재 상신</button>
          :<span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold"><CheckCircle className="w-3 h-3"/>결재 진행 중</span>
        }
      </div>

      {apvState==='done'&&(
        <div className="shrink-0 bg-emerald-50 border-b border-emerald-100 px-5 py-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
              <span className="text-[11px] font-black text-slate-700">결재 현황</span>
              <span className="text-[9px] font-bold text-white bg-emerald-700 px-1.5 py-0.5 rounded">{C.approvalSystem}</span>
            </div>
            <div className="flex items-center gap-1 flex-1 min-w-0">
              {C.apvLine.map((p,i)=>(
                <React.Fragment key={i}>
                  <div className={cn(
                    'flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] border whitespace-nowrap',
                    i===0?'bg-emerald-50 border-emerald-200':i===1?'bg-blue-50 border-blue-200 shadow-sm':'bg-white border-slate-200'
                  )}>
                    {i===0?<CheckCircle className="w-3 h-3 text-emerald-500 shrink-0"/>
                      :i===1?<Loader2 className="w-3 h-3 text-blue-500 animate-spin shrink-0"/>
                      :<Clock className="w-3 h-3 text-slate-300 shrink-0"/>}
                    <span className="font-bold text-slate-700">{p.name}</span>
                    <span className={cn('font-black text-[9px]',i===0?'text-emerald-500':i===1?'text-blue-500':'text-slate-300')}>
                      {i===0?'서명 완료':i===1?'검토 중':'대기'}
                    </span>
                  </div>
                  {i<C.apvLine.length-1&&<ChevronRight className="w-3 h-3 text-slate-300 shrink-0"/>}
                </React.Fragment>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] text-slate-400 font-mono">{C.apvRefNo}</span>
              <a href="#" onClick={e=>e.preventDefault()} className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-0.5">{C.approvalSystem}에서 보기<ExternalLink className="w-2.5 h-2.5"/></a>
            </div>
          </div>
        </div>
      )}

      {apvState==='selfcheck'&&(
        <SelfCheckModal
          docType={reportType===C.pressTypeId?'officetel':'report'}
          domain={domain}
          onClose={()=>setApvState(null)}
          onProceed={()=>setApvState('modal')}
        />
      )}

      {(apvState==='modal'||apvState==='submitting')&&(
        <ApprovalModal
          docTitle={`${selectedType?.label} — ${period}`}
          docNum={DOC_NUM}
          apvLine={C.apvLine}
          apvMsg={apvMsg} setApvMsg={setApvMsg}
          onClose={()=>setApvState(null)}
          onSubmit={submitApv}
          submitting={apvState==='submitting'}
          accentBg="bg-emerald-700"
          accentBtn="bg-emerald-600 hover:bg-emerald-700"
        />
      )}

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {viewMode==='edit'?(
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border shadow-sm overflow-hidden">
            <textarea value={editResult} onChange={e=>setEditResult(e.target.value)}
              className="w-full p-6 font-mono text-[13px] text-slate-700 leading-relaxed resize-none outline-none"
              style={{minHeight:640}}/>
          </div>
        ):(
          <div className="max-w-3xl mx-auto shadow-2xl rounded-lg overflow-hidden"
            style={{fontFamily:"'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif",lineHeight:1.85,wordBreak:'keep-all',letterSpacing:'-0.01em'}}>
            {/* Document header — 공식 REB 보도자료 양식 */}
            <div style={{border:'1px solid #091D58',display:'grid',gridTemplateColumns:'170px 1fr',gridTemplateRows:'auto auto'}}>
              {/* 로고 — 2행 span */}
              <div style={{gridColumn:'1',gridRow:'1/3',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px 14px',background:'#fff',borderRight:'1px solid #091D58'}}>
                <img src={docLogo} alt={docLogoAlt} style={{width:'130px',height:'auto'}}/>
              </div>
              {/* 문서 제목 */}
              <div style={{gridColumn:'2',gridRow:'1',display:'flex',alignItems:'center',justifyContent:'center',padding:'18px 14px',background:'#e6e6e6',borderBottom:'1px solid #091D58',overflow:'hidden'}}>
                <div style={{fontSize:'34px',fontWeight:900,letterSpacing:'0.4em',paddingRight:'0.4em',fontFamily:"'HY견고딕','돋움','맑은 고딕',sans-serif",color:'#041E54',lineHeight:1.2,whiteSpace:'nowrap'}}>
                  {selectedType?.label||C.reportTypes[0].label}
                </div>
              </div>
              {/* 메타 정보 행 */}
              <div style={{gridColumn:'2',gridRow:'2',display:'grid',gridTemplateColumns:'72px 1fr 72px 1fr'}}>
                <div style={{padding:'7px 10px',background:'#dfeaf5',borderRight:'1px solid #091D58',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <span style={{fontSize:'12px',fontWeight:700,color:'#091D58'}}>담당부서</span>
                </div>
                <div style={{padding:'7px 12px',borderRight:'1px solid #091D58',display:'flex',alignItems:'center'}}>
                  <span style={{fontSize:'13px',color:'#1a202c',fontWeight:600}}>{dept}</span>
                </div>
                <div style={{padding:'7px 10px',background:'#dfeaf5',borderRight:'1px solid #091D58',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <span style={{fontSize:'12px',fontWeight:700,color:'#091D58'}}>문서번호</span>
                </div>
                <div style={{padding:'7px 12px',display:'flex',flexDirection:'column',justifyContent:'center',gap:'2px'}}>
                  <span style={{fontSize:'12px',fontFamily:'monospace',fontWeight:700,color:'#1a202c'}}>{DOC_NUM}</span>
                  <span style={{fontSize:'10px',color:'#6b7280'}}>수신: 내부결재</span>
                </div>
              </div>
            </div>

            {/* Document body */}
            {reportType===C.pressTypeId ? (
            /* ── 주택가격동향조사 보도자료 형식 ── */
            <div className="bg-white px-8 py-7 space-y-6" style={{fontFamily:"'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif",lineHeight:1.85,wordBreak:'keep-all',letterSpacing:'-0.01em'}}>
              {/* 메타 정보 */}
              <table className="w-full border-collapse text-[13px]" style={{borderTop:'2px solid #003087'}}>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-2.5 pr-4 font-bold text-[#003087] w-28 whitespace-nowrap">담당 부서</td>
                    <td className="py-2.5 pr-6 font-semibold text-slate-800" colSpan={3}>{dept}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2.5 font-bold text-[#003087] whitespace-nowrap">조사 기간</td>
                    <td className="py-2.5 text-slate-700 pr-6">{period}</td>
                    <td className="py-2.5 font-bold text-[#003087] w-24 whitespace-nowrap">배포 일시</td>
                    <td className="py-2.5 text-slate-700">{C.pressDistDate}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-2.5 font-bold text-[#003087] whitespace-nowrap">문서번호</td>
                    <td className="py-2.5 font-mono text-slate-600 text-[12px]" colSpan={3}>{DOC_NUM}</td>
                  </tr>
                </tbody>
              </table>

              {/* 핵심 지표 요약 */}
              <div style={{background:'#eef2ff',border:'1px solid #c7d2fe',borderRadius:'10px',padding:'16px 18px'}}>
                <div style={{fontSize:'11px',fontWeight:800,color:'#003087',letterSpacing:'0.05em',marginBottom:'12px'}}>
                  {C.pressKpiTitle}
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'10px'}}>
                  {C.pressKpiCards.map(({label,value,sub,color})=>(
                    <div key={label} style={{background:'#fff',border:'1px solid #e0e7ff',borderRadius:'8px',padding:'10px 12px',textAlign:'center'}}>
                      <div style={{fontSize:'10px',color:'#6b7280',fontWeight:700,marginBottom:'4px'}}>{label}</div>
                      <div style={{fontSize:'18px',fontWeight:900,color,lineHeight:1.2}}>{value}</div>
                      <div style={{fontSize:'10px',color:'#9ca3af',marginTop:'3px'}}>{sub}</div>
                    </div>
                  ))}
                </div>
                <div style={{marginTop:'12px',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'8px'}}>
                  {C.pressKpiStats.map(({label,value})=>(
                    <div key={label} style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'6px',padding:'7px 10px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <span style={{fontSize:'10px',color:'#6b7280',fontWeight:600}}>{label}</span>
                      <span style={{fontSize:'12px',color:'#1e3a8a',fontWeight:800}}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 그래프 섹션 ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* 가격지수 월별 추이 꺾은선 */}
                <div style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'10px',padding:'14px 16px'}}>
                  <div style={{fontSize:'11px',fontWeight:800,color:'#003087',marginBottom:'12px',letterSpacing:'0.03em'}}>
                    {C.pressTrendTitle}
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={C.pressTrendData} margin={{top:5,right:12,left:-20,bottom:0}}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
                      <XAxis dataKey="month" tick={{fontSize:10,fill:'#94a3b8'}} tickLine={false}/>
                      <YAxis domain={C.pressTrendDomain} tick={{fontSize:9,fill:'#94a3b8'}} tickLine={false} axisLine={false}/>
                      <Tooltip content={<CustomTooltip/>}/>
                      <Legend wrapperStyle={{fontSize:'10px',paddingTop:'6px'}}/>
                      {C.pressTrendSeries.map(s=>(
                        <Line key={s.key} type="monotone" dataKey={s.key} stroke={s.color} strokeWidth={2.5} dot={{r:4,fill:s.color}} activeDot={{r:6}}/>
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* 지역별 변동률 막대 그래프 */}
                <div style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'10px',padding:'14px 16px'}}>
                  <div style={{fontSize:'11px',fontWeight:800,color:'#003087',marginBottom:'12px',letterSpacing:'0.03em'}}>
                    {C.pressBarTitle}
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={C.pressBarData} margin={{top:5,right:8,left:-24,bottom:0}} barCategoryGap="25%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/>
                      <XAxis dataKey="area" tick={{fontSize:10,fill:'#64748b'}} tickLine={false}/>
                      <YAxis tick={{fontSize:9,fill:'#94a3b8'}} tickLine={false} axisLine={false}/>
                      <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1.5}/>
                      <Tooltip content={<CustomTooltip/>}/>
                      <Legend wrapperStyle={{fontSize:'10px',paddingTop:'6px'}}/>
                      {C.pressBarSeries.map(s=>(
                        <Bar key={s.key} dataKey={s.key} fill={s.color} radius={[3,3,0,0]}>
                          {C.pressBarData.map((e,i)=><Cell key={i} fill={e[s.key]<0?s.color:s.posColor}/>)}
                        </Bar>
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 본문 섹션 (지표 그룹별) */}
              {C.pressSections.map(({num,title,regions,details})=>(
                <section key={num}>
                  <h3 className="flex items-center gap-2 text-[14px] font-black text-slate-800 mb-3">
                    <span className="w-6 h-6 rounded-md bg-[#003087] flex items-center justify-center text-white text-[10px] font-black shrink-0">{num}</span>
                    {title}
                  </h3>
                  <div className="ml-8 grid grid-cols-3 gap-2 mb-3">
                    {regions.map(r=>(
                      <div key={r.area} style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'8px 12px'}}>
                        <div style={{fontSize:'10px',color:'#94a3b8',fontWeight:700,marginBottom:'2px'}}>{r.area}</div>
                        <div style={{fontSize:'16px',fontWeight:900,color:r.rate.startsWith('-')?'#dc2626':'#16a34a',lineHeight:1.2}}>{r.rate}</div>
                        <div style={{fontSize:'10px',color:'#cbd5e1',marginTop:'2px'}}>전분기 {r.prev}</div>
                      </div>
                    ))}
                  </div>
                  <div className="ml-8 space-y-1.5">
                    {details.map(d=>(
                      <div key={d.area} style={{display:'flex',gap:'8px',fontSize:'13px',lineHeight:1.6,alignItems:'flex-start'}}>
                        <span style={{fontWeight:800,color:'#003087',width:'40px',flexShrink:0}}>{d.area}</span>
                        <span style={{fontWeight:700,flexShrink:0,color:d.rate.startsWith('-')?'#dc2626':d.rate.startsWith('+')?'#16a34a':'#475569'}}>({d.rate})</span>
                        <span style={{color:'#475569'}}>{d.note}</span>
                      </div>
                    ))}
                  </div>
                </section>
              ))}

              {/* 가격지수 변동률 테이블 */}
              <section>
                <h3 className="flex items-center gap-2 text-[14px] font-black text-slate-800 mb-3">
                  <span className="w-6 h-6 rounded-md bg-[#003087] flex items-center justify-center text-white text-[10px] font-black shrink-0">4</span>
                  {C.pressIndexTitle}
                </h3>
                <div className="ml-8">
                  <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-[12px]" style={{border:'1px solid #e2e8f0'}}>
                    <thead>
                      <tr style={{background:'#003087',color:'#fff'}}>
                        {C.pressIndexHead.map(h=>(
                          <th key={h} className="py-2 px-3 font-bold text-left">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {C.pressIndexGroups.map(({label,rows})=>(
                        <React.Fragment key={label}>
                          <tr style={{background:'#dbeafe'}}>
                            <td className="py-1.5 px-3 font-black text-[#003087] text-[11px]" colSpan={5}>{label}</td>
                          </tr>
                          {rows.map(r=>(
                            <tr key={r.a} className="border-b border-slate-100">
                              <td className="py-1.5 px-3 pl-5 text-slate-600">{r.a}</td>
                              <td className="py-1.5 px-3 text-slate-600">{r.v1}</td>
                              <td className="py-1.5 px-3 text-slate-600">{r.v2}</td>
                              <td className="py-1.5 px-3 text-slate-600">{r.v3}</td>
                              <td className={`py-1.5 px-3 font-black ${r.c.startsWith('-')?'text-rose-600':r.c==='0.00'?'text-slate-500':'text-emerald-600'}`}>{r.c}%</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                  </div>
                  <p style={{fontSize:'10px',color:'#9ca3af',marginTop:'5px'}}>{C.pressIndexNote}</p>
                </div>
              </section>

              {/* ── 전세가율 및 수익률 요약 차트 ── */}
              <section>
                <h3 className="flex items-center gap-2 text-[14px] font-black text-slate-800 mb-3">
                  <span className="w-6 h-6 rounded-md bg-[#003087] flex items-center justify-center text-white text-[10px] font-black shrink-0">5</span>
                  {C.pressRatioTitle}
                </h3>
                <div className="ml-8">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart
                      data={C.pressRatioData}
                      margin={{top:5,right:16,left:-10,bottom:0}}
                      barCategoryGap="30%"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false}/>
                      <XAxis dataKey="area" tick={{fontSize:11,fill:'#64748b'}} tickLine={false}/>
                      <YAxis yAxisId="left" domain={C.pressRatioLeftDomain} tick={{fontSize:9,fill:'#94a3b8'}} tickLine={false} axisLine={false} tickFormatter={v=>`${v}%`}/>
                      <YAxis yAxisId="right" orientation="right" domain={C.pressRatioRightDomain} tick={{fontSize:9,fill:'#94a3b8'}} tickLine={false} axisLine={false} tickFormatter={v=>`${v}%`}/>
                      <Tooltip content={({active,payload,label})=>{
                        if(!active||!payload?.length)return null;
                        return(
                          <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-[11px]">
                            <div className="font-black text-slate-700 mb-1">{label}</div>
                            {payload.map(p=>(
                              <div key={p.name} className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full" style={{background:p.color}}/>
                                <span className="text-slate-600">{p.name}:</span>
                                <span className="font-bold" style={{color:p.color}}>{p.value}%</span>
                              </div>
                            ))}
                          </div>
                        );
                      }}/>
                      <Legend wrapperStyle={{fontSize:'10px',paddingTop:'6px'}}/>
                      <ReferenceLine yAxisId="left" y={C.pressRatioThreshold} stroke="#ef4444" strokeDasharray="4 3" strokeWidth={1.5} label={{value:C.pressRatioRefLabel,position:'insideTopRight',fontSize:9,fill:'#ef4444'}}/>
                      <Bar yAxisId="left" dataKey={C.pressRatioLeftKey} fill="#bfdbfe" radius={[3,3,0,0]}>
                        {C.pressRatioData.map((row,i)=>(
                          <Cell key={i} fill={row[C.pressRatioLeftKey]>=C.pressRatioThreshold?'#fca5a5':'#bfdbfe'}/>
                        ))}
                        <LabelList dataKey={C.pressRatioLeftKey} position="top" style={{fontSize:9,fontWeight:700,fill:'#3b82f6'}} formatter={v=>`${v}%`}/>
                      </Bar>
                      <Bar yAxisId="right" dataKey={C.pressRatioRightKey} fill="#6ee7b7" radius={[3,3,0,0]}>
                        <LabelList dataKey={C.pressRatioRightKey} position="top" style={{fontSize:9,fontWeight:700,fill:'#16a34a'}} formatter={v=>`${v}%`}/>
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <p style={{fontSize:'10px',color:'#9ca3af',marginTop:'4px'}}>{C.pressRatioNote}</p>
                </div>
              </section>

              {/* 문의처 */}
              <div style={{background:'#f8fafc',border:'1px solid #e2e8f0',borderRadius:'8px',padding:'10px 14px',fontSize:'11px',color:'#64748b'}}>
                <span style={{fontWeight:700,color:'#003087'}}>문의</span>　{C.pressContact}
              </div>

              {/* 작성 정보 */}
              <div className="flex items-center justify-between text-[12px] text-slate-500">
                <span>작성자: <strong className="text-slate-700">{C.apvLine[0].name}</strong> · {dept} {C.apvLine[0].title}</span>
                <span>작성일: {C.pressDate}</span>
              </div>

              {/* 서명란 */}
              <div style={{borderTop:'2px solid #003087',paddingTop:'14px'}}>
                <div className="grid grid-cols-3 gap-4">
                  {C.apvLine.map((p,i)=>(
                    <div key={i} className="border border-slate-300 rounded-lg overflow-hidden">
                      <div className="py-2 text-center text-[12px] font-bold text-white" style={{background:'#003087'}}>{p.role}</div>
                      <div className="h-14 flex flex-col items-center justify-end pb-2 gap-0.5">
                        <div className="text-[13px] font-bold text-slate-700">{p.name}</div>
                        <div className="text-[11px] text-slate-400">{p.dept}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-[10px] text-slate-400 mt-3">
                  본 보고서는 GENOS AI 보고서 작성 에이전트 v1.0에 의해 자동 생성되었으며, 담당자 검토 후 확정됩니다.
                </p>
              </div>
            </div>
            ) : (
            /* ── 일반 보고서 형식 ── */
            <div className="bg-white px-10 py-8 space-y-7">
              <table className="w-full border-collapse text-[14.5px]" style={{borderTop:'2px solid #003087'}}>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-3.5 pr-4 font-bold text-[#064e3b] w-24 whitespace-nowrap">담당 부서</td>
                    <td className="py-3.5 pr-8 font-semibold text-slate-800">{dept}</td>
                    <td className="py-3.5 pr-4 font-bold text-[#064e3b] w-24 whitespace-nowrap">문서번호</td>
                    <td className="py-3.5 font-mono text-slate-700">{DOC_NUM}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-3.5 pr-4 font-bold text-[#064e3b] whitespace-nowrap">보고 기간</td>
                    <td className="py-3.5 text-slate-700" colSpan={3}>{period}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex items-center gap-3"><div className="flex-1 h-px bg-slate-200"/><div className="w-1.5 h-1.5 rounded-full bg-slate-300"/><div className="flex-1 h-px bg-slate-200"/></div>

              {/* 실적 현황 차트 */}
              {(()=>{
                const perf=C.perfCharts[reportType]||Object.values(C.perfCharts)[0];
                const chartData=perf.data;
                const accentColor='#064e3b';
                const label=perf.label;
                return(
                  <div style={{background:'#f0fdf4',border:'1px solid #bbf7d0',borderRadius:'10px',padding:'14px 18px'}}>
                    <div style={{fontSize:'11px',fontWeight:800,color:accentColor,marginBottom:'12px',letterSpacing:'0.03em'}}>
                      ▪ {label} 실적 현황 — 목표 대비 달성률
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-center">
                      <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={chartData} layout="vertical" margin={{top:0,right:40,left:10,bottom:0}}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" horizontal={false}/>
                          <XAxis type="number" tick={{fontSize:10,fill:'#6b7280'}} tickLine={false} axisLine={false}/>
                          <YAxis type="category" dataKey="item" tick={{fontSize:11,fill:'#374151',fontWeight:600}} tickLine={false} axisLine={false} width={52}/>
                          <Tooltip content={<CustomTooltip/>}/>
                          <Bar dataKey={C.perfGoalKey} fill="#d1fae5" radius={[0,3,3,0]} barSize={12}/>
                          <Bar dataKey={C.perfDoneKey} fill={accentColor} radius={[0,3,3,0]} barSize={12}>
                            <LabelList dataKey={C.perfDoneKey} position="right" style={{fontSize:10,fontWeight:700,fill:accentColor}}/>
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="space-y-2.5">
                        {chartData.map(d=>{
                          const pct=Math.round(d[C.perfDoneKey]/d[C.perfGoalKey]*100);
                          return(
                            <div key={d.item}>
                              <div className="flex justify-between text-[11px] mb-1">
                                <span className="font-bold text-slate-700">{d.item}</span>
                                <span className="font-black" style={{color:pct>=100?'#16a34a':pct>=80?accentColor:'#f59e0b'}}>{pct}%</span>
                              </div>
                              <div className="h-2 bg-emerald-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full transition-all" style={{width:`${Math.min(pct,100)}%`,background:pct>=100?'#16a34a':pct>=80?accentColor:'#f59e0b'}}/>
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">{d[C.perfDoneKey]} / {d[C.perfGoalKey]}건</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {[
                {num:'1',title:'주요 실적',content:mainWork},
                {num:'2',title:'차주 계획',content:nextPlan},
                {num:'3',title:'특이 사항',content:special||'해당 없음'},
              ].map(({num,title,content})=>(
                <section key={num}>
                  <h3 className="flex items-center gap-2 text-[16.5px] font-black text-slate-800 mb-3.5">
                    <span className="w-7 h-7 rounded-md bg-[#064e3b] flex items-center justify-center text-white text-[11px] font-black shrink-0">{num}</span>
                    {title}
                  </h3>
                  <div className="ml-9 text-[14.5px] text-slate-700 space-y-2" style={{lineHeight:2.0,wordBreak:'keep-all'}}>
                    {content.split('\n').filter(l=>l.trim()).map((line,i)=>(
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </section>
              ))}

              <div className="flex items-center gap-3"><div className="flex-1 h-px bg-slate-200"/><div className="w-1.5 h-1.5 rounded-full bg-slate-300"/><div className="flex-1 h-px bg-slate-200"/></div>

              <div className="flex items-center justify-between text-[13px] text-slate-500">
                <span>작성자: <strong className="text-slate-700">{C.apvLine[0].name}</strong> · {dept} {C.apvLine[0].title}</span>
                <span>작성일: {C.reportDate}</span>
              </div>

              <div className="pt-4" style={{borderTop:'2px solid #064e3b'}}>
                <div className="grid grid-cols-3 gap-4">
                  {C.apvLine.map((p,i)=>(
                    <div key={i} className="border border-slate-300 rounded-lg overflow-hidden">
                      <div className="py-2 text-center text-[12px] font-bold text-white" style={{background:'#064e3b'}}>{p.role}</div>
                      <div className="h-16 flex flex-col items-center justify-end pb-2 gap-1">
                        <div className="text-[13px] font-bold text-slate-700">{p.name}</div>
                        <div className="text-[11px] text-slate-400">{p.dept}</div>
                        <div className="w-16 border-b border-slate-300 mt-1"/>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-center text-[11px] text-slate-400 mt-4">
                  본 보고서는 GENOS AI 보고서 작성 에이전트 v1.0에 의해 자동 생성되었으며, 담당자 검토 후 확정됩니다.
                </p>
              </div>
            </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportAgent;
