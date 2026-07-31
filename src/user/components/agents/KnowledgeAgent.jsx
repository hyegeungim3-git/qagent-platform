import React, { useState } from "react";
import {
  Search, BookMarked, FileText, ChevronRight, Loader2, CheckCircle,
  Radio, Network, Play, RotateCcw, Download, Copy, ChevronDown,
  Filter, Clock, Zap, Star, Tag, BookOpen, Hash, TrendingUp, Eye,
  Sparkles, Lock, Shield, Globe
} from "lucide-react";
import AgentWorkflowPanel from "./AgentWorkflowPanel.jsx";
import { AGENT_TEAMS } from "../../data/constants.js";
import { cn, agentHeader } from "../../utils.jsx";


const AGENTS=[
  {icon:Hash,     label:'질의 임베딩',    sub:'자연어 질의 벡터화 중',         color:'bg-violet-600', ms:800},
  {icon:Search,   label:'시맨틱 검색',    sub:'벡터 DB 유사도 검색 중',         color:'bg-blue-600',   ms:1600},
  {icon:FileText, label:'결과 랭킹',      sub:'관련성 점수 재정렬·발췌 중',      color:'bg-indigo-600', ms:900},
];

const KNOWLEDGE_BASES=[
  {id:'kb1', name:'표준지공시지가 조사지침', docs:47, updated:'2026.01.15', icon:BookOpen, color:'violet'},
  {id:'kb2', name:'한국부동산원 취업규칙', docs:12, updated:'2026.02.10', icon:FileText, color:'blue'},
  {id:'kb3', name:'부동산 가격공시에 관한 법률', docs:83, updated:'2025.12.01', icon:BookMarked, color:'indigo'},
  {id:'kb4', name:'개별공시지가 업무매뉴얼', docs:31, updated:'2026.01.20', icon:BookOpen, color:'teal'},
  {id:'kb5', name:'이의신청 처리 지침', docs:8, updated:'2026.03.05', icon:FileText, color:'emerald'},
  {id:'kb6', name:'표준주택가격조사 매뉴얼', docs:24, updated:'2026.01.10', icon:BookOpen, color:'emerald'},
  {id:'kb7', name:'공동주택가격조사 매뉴얼', docs:18, updated:'2026.02.01', icon:BookOpen, color:'cyan'},
];

const RECENT_SEARCHES=[
  {id:1, query:'표준지 선정 기준',  date:'2026-03-31 16:20', results:5},
  {id:2, query:'이의신청 기간',      date:'2026-03-30 10:12', results:3},
  {id:3, query:'용도지역 가격배율',  date:'2026-03-28 14:55', results:7},
];

const MOCK_RESULTS=[
  {
    id:1, title:'표준지공시지가 조사·산정 업무 지침', source:'표준지공시지가_조사지침.pdf',
    page:12, score:97.3, secLevel:'C', line:'p.12 · 3번째 문단',
    excerpt:`표준지공시지가는 부동산 가격공시에 관한 법률 제3조에 따라 매년 1월 1일을 기준으로 국토교통부장관이 조사·산정하여 공시한다. 조사 기준일 이후 6개월 이내에 중대한 가격 변동이 확인된 경우 수시 조사를 실시할 수 있다.`,
    keywords:['표준지','공시지가','기준일','조사·산정'],
  },
  {
    id:2, title:'현장 조사 방법 및 절차', source:'표준지공시지가_조사지침.pdf',
    page:28, score:89.1, secLevel:'C', line:'p.28 · 1번째 문단',
    excerpt:`현장 조사는 표준지 소재지를 직접 방문하여 토지 이용 현황, 주위 환경, 교통 접근성 등을 확인한다. 인근 유사 토지의 거래 사례 및 감정 평가 선례를 수집하여 적정 가격 산정에 활용한다.`,
    keywords:['현장조사','토지 이용','거래 사례','감정 평가'],
  },
  {
    id:3, title:'가격 균형 유지 원칙', source:'표준지공시지가_조사지침.pdf',
    page:35, score:78.6, secLevel:'C', line:'p.35 · 2번째 문단',
    excerpt:`표준지 가격은 인근 표준지 간 균형을 유지해야 하며, 지역 실거래가 수준을 합리적으로 반영하여야 한다. 지역별 비교 표준지와의 가격 격차는 연간 30% 이내로 제한한다.`,
    keywords:['가격 균형','인근 표준지','실거래가'],
  },
  {
    id:4, title:'부동산 가격공시에 관한 법률 제3조', source:'부동산 가격공시에 관한 법률',
    page:3, score:71.2, secLevel:'O', line:'p.3 · 제3조 본문',
    excerpt:`국토교통부장관은 토지이용상황이나 주변 환경, 그 밖의 자연적·사회적 조건이 일반적으로 유사하다고 인정되는 일단의 토지 중에서 선정한 표준지에 대하여 매년 공시기준일 현재의 단위면적당 적정가격을 조사·평가하고 공시하여야 한다.`,
    keywords:['국토교통부장관','표준지','단위면적당','적정가격'],
  },
  {
    id:5, title:'공시지가 이의신청 처리 절차', source:'이의신청_처리지침.pdf',
    page:5, score:62.4, secLevel:'O', line:'p.5 · 4번째 문단',
    excerpt:`공시된 표준지 공시지가에 이의가 있는 자는 공시일로부터 30일 이내에 서면으로 국토교통부장관에게 이의를 신청할 수 있다. 이의신청을 받은 경우에는 30일 이내에 이를 심사하여 그 결과를 신청인에게 통지하여야 한다.`,
    keywords:['이의신청','30일','서면','심사'],
  },
];

const AI_SUMMARIES={
  '표준지공시지가 조사 기준일 및 조사 방법': `검색 결과 5건에 따르면, 표준지공시지가 조사 기준일은 매년 1월 1일이며, 전국 약 50만 필지를 대상으로 합니다. 현장 조사는 토지 이용 현황·교통 접근성 등 12개 항목을 의무 확인하며, ±30% 이상 가격 변동 시 재심의가 필요합니다.`,
  DEFAULT: `검색 결과를 분석한 결과, 관련 문서 5건에서 연관 내용을 찾았습니다. 상세 내용은 아래 검색 결과를 확인하세요.`,
};

const SIMILAR_DOCS=[
  {title:'개별공시지가 조사·산정 지침', source:'개별공시지가_지침.pdf', relevance:84},
  {title:'비교표준지 선정 기준 가이드', source:'비교표준지_가이드.pdf', relevance:79},
  {title:'표준주택가격조사 매뉴얼 제3장', source:'표준주택_매뉴얼.pdf', relevance:71},
];

const SEC_COLORS={C:'bg-rose-100 text-rose-700',S:'bg-amber-100 text-amber-700',O:'bg-slate-100 text-slate-600'};
const SEC_LABELS={C:'대외비',S:'내부',O:'일반'};

/* 도메인 이관: REB 기본 콘텐츠 — 도메인 팩 agentContent["agent-knowledge"]로 키 단위 오버라이드 */
export const CONTENT_DEFAULTS={
  headerTitle:'지식 검색 에이전트',          // string — 화면 헤더 제목(도메인별 리브랜딩용)
  headerDesc:'사내 문서·규정 시맨틱/전문 검색 — 벡터 임베딩 기반 유사도 검색', // string — 헤더 설명
  defaultQuery:'표준지공시지가 조사 기준일 및 조사 방법', // string — 검색어 초기값(aiSummaries 키와 일치 권장)
  quickQueries:['표준지 선정 기준','이의신청 처리 절차','현장조사 안전 수칙','출장비 정산 기준'], // string[4] — 추천 검색어 칩
  knowledgeBases: KNOWLEDGE_BASES,          // {id,name,docs,updated,icon(lucide 컴포넌트),color(tailwind 색상명)}[7] — 지식베이스 목록
  defaultSelectedKbIds:['kb1','kb2','kb3'], // string[3] — 초기 선택 지식베이스 id(knowledgeBases.id와 일치)
  recentSearches: RECENT_SEARCHES,          // {id,query,date,results}[3] — 최근 검색 이력
  results: MOCK_RESULTS,                    // {id,title,source,page,score,secLevel:'C'|'S'|'O',line,excerpt,keywords:string[]}[5] — 검색 결과(score 내림차순)
                                            //   선택 필드 attrs: {label,value,match:boolean}[] — 온톨로지 속성 매칭(제조 도면 등). 없으면 미노출
  aiSummaries: AI_SUMMARIES,                // {[질의문]:요약문, DEFAULT:폴백요약} — 질의별 AI 요약
  similarDocs: SIMILAR_DOCS,                // {title,source,relevance}[3] — 유사 문서 추천

  /* 선택(생략 시 해당 UI 비노출) — 온톨로지 기반 산출물 패널.
     '검색'을 넘어 참조 결과로 초안을 만들어내는 도메인(예: 금형 설계)용. */
  outline:null,
  /* outline 스키마:
     { title, subtitle, badge,
       shape: { viewBox, paths:[{d, stroke?, fill?, dash?}], labels:[{x,y,text}] },   // 단순 SVG 스케치
       specs: [{label, value, from}],           // 자동 산출 제원(출처 도면 표기)
       checks: [{label, status:'ok'|'warn'|'fail', detail}],  // 자동 검증(간섭·공차 등)
       effect: {label, before, after, delta},   // 기대 효과(리드타임 등)
       note }                                   // 하단 안내(실서비스 대체 지점 등)
  */
};

const KnowledgeAgent=({onBack,domain})=>{
  const C={...CONTENT_DEFAULTS,...(domain?.agentContent?.["agent-knowledge"]||{})};
  const H=agentHeader(domain,'agent-knowledge',C,AGENT_TEAMS);
  const [step,setStep]=useState(1);
  const [query,setQuery]=useState(C.defaultQuery);
  const [selectedKBs,setSelectedKBs]=useState(new Set(C.defaultSelectedKbIds));
  const [topK,setTopK]=useState('5');
  const [agentIdx,setAgentIdx]=useState(-1);
  const [doneIdx,setDoneIdx]=useState([]);
  const [expanded,setExpanded]=useState(new Set());
  const [histOpen,setHistOpen]=useState(false);
  const [searchMode,setSearchMode]=useState('semantic'); // 'semantic' | 'fulltext'
  const [secFilter,setSecFilter]=useState('all'); // 'all' | 'O' | 'S' | 'C'

  const toggleKB=(id)=>setSelectedKBs(p=>{
    const n=new Set(p);
    n.has(id)?n.delete(id):n.add(id);
    return n;
  });

  const toggleExpand=(id)=>setExpanded(p=>{
    const n=new Set(p);
    n.has(id)?n.delete(id):n.add(id);
    return n;
  });

  const startSearch=()=>{
    setStep(2);setAgentIdx(0);setDoneIdx([]);
    let delay=0;
    AGENTS.forEach((ag,i)=>{
      delay+=ag.ms;
      setTimeout(()=>{
        setAgentIdx(i+1<AGENTS.length?i+1:-1);
        setDoneIdx(p=>[...p,i]);
        if(i===AGENTS.length-1)setTimeout(()=>setStep(3),500);
      },delay);
    });
  };

  const reset=()=>{setStep(1);setAgentIdx(-1);setDoneIdx([]);setExpanded(new Set());};

  if(step===1)return(
    <div className="flex-1 overflow-y-auto px-6 py-8 bg-white">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-2">
          {onBack&&<button onClick={onBack} className="text-slate-400 hover:text-slate-600 text-[11px] font-bold flex items-center gap-1 shrink-0 py-2 pr-2 max-md:py-2.5">
            <ChevronRight className="w-3.5 h-3.5 rotate-180"/>뒤로
          </button>}
          <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-md shrink-0">
            <Search className="w-5 h-5 text-white"/>
          </div>
          <div>
            <div className="text-[15px] font-black text-slate-800">{H.title}</div>
            <div className="text-xs text-slate-400">{H.desc}</div>
          </div>
        </div>

        {/* 검색어 입력 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">1 · 검색어 입력</label>
            <button onClick={()=>setHistOpen(p=>!p)}
              className={cn('flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all',
                histOpen?'bg-violet-600 text-white border-violet-600':'border-slate-200 text-slate-500 hover:border-violet-300 hover:text-violet-600')}>
              <Clock className="w-3.5 h-3.5"/> 최근 검색
            </button>
          </div>

          {histOpen&&(
            <div className="border border-violet-200 rounded-xl bg-violet-50/40 overflow-hidden">
              {C.recentSearches.map(h=>(
                <button key={h.id} onClick={()=>{setQuery(h.query);setHistOpen(false);}}
                  className="w-full text-left px-3 py-2.5 hover:bg-violet-100/60 transition-colors border-b border-violet-100 last:border-0 flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-medium text-slate-700">{h.query}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{h.date}</div>
                  </div>
                  <span className="text-[10px] text-violet-600 font-bold bg-violet-50 px-1.5 py-0.5 rounded">{h.results}건</span>
                </button>
              ))}
            </div>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
            <input
              value={query} onChange={e=>setQuery(e.target.value)}
              onKeyDown={e=>e.key==='Enter'&&startSearch()}
              placeholder="검색하고 싶은 내용을 자연어로 입력하세요"
              className="w-full border rounded-xl pl-9 pr-4 py-3 text-sm bg-white outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-100 text-slate-700"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {C.quickQueries.map((q,i)=>(
              <button key={i} onClick={()=>setQuery(q)}
                className="text-[11px] px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 font-medium hover:bg-violet-100 transition-colors">
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* 검색 방식 토글 */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">2 · 검색 방식</label>
          <div className="flex flex-col sm:flex-row gap-2">
            {[
              {val:'semantic', label:'시맨틱 검색', desc:'의미 유사도 기반', icon:Zap},
              {val:'fulltext', label:'전문 검색 (Full-Text)', desc:'키워드 정확 매칭 + 위치 표시', icon:Hash},
            ].map(({val,label,desc,icon:Icon})=>(
              <label key={val} className={cn(
                'flex-1 flex items-start gap-2.5 px-4 py-3 border-2 rounded-xl cursor-pointer transition-all select-none',
                searchMode===val?'border-violet-400 bg-violet-50 shadow-sm':'border-slate-200 hover:bg-slate-50'
              )}>
                <input type="radio" name="searchmode" value={val} checked={searchMode===val} onChange={()=>setSearchMode(val)} className="sr-only"/>
                <Icon className={cn('w-4 h-4 mt-0.5 shrink-0',searchMode===val?'text-violet-600':'text-slate-400')}/>
                <div>
                  <div className={cn('text-[12px] font-black',searchMode===val?'text-violet-800':'text-slate-600')}>{label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{desc}</div>
                </div>
                {searchMode===val&&<CheckCircle className="w-4 h-4 text-violet-500 ml-auto shrink-0 mt-0.5"/>}
              </label>
            ))}
          </div>
        </div>

        {/* 보안 등급 필터 */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">3 · 보안 등급 필터</label>
          <div className="flex flex-wrap gap-2">
            {[
              {val:'all', label:'전체', color:'bg-slate-600'},
              {val:'O',   label:'일반 (공개)', color:'bg-slate-500'},
              {val:'S',   label:'내부', color:'bg-amber-500'},
              {val:'C',   label:'대외비', color:'bg-rose-500'},
            ].map(({val,label,color})=>(
              <label key={val} className={cn(
                'flex items-center gap-1.5 px-3 py-2 border-2 rounded-xl cursor-pointer transition-all select-none text-[12px] font-bold',
                secFilter===val?color+' text-white border-transparent shadow-sm':'border-slate-200 text-slate-500 hover:bg-slate-50'
              )}>
                <input type="radio" name="secfilter" value={val} checked={secFilter===val} onChange={()=>setSecFilter(val)} className="sr-only"/>
                {val!=='all'&&<Shield className="w-3 h-3"/>}
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* 지식베이스 선택 */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">4 · 검색 범위 선택</label>
          <div className="grid grid-cols-1 gap-2">
            {C.knowledgeBases.map(kb=>{
              const isSelected=selectedKBs.has(kb.id);
              const KBIcon=kb.icon;
              return(
                <label key={kb.id} className={cn(
                  'flex items-center gap-3 px-4 py-3 border rounded-xl cursor-pointer transition-all select-none',
                  isSelected?`bg-${kb.color}-50 border-${kb.color}-300`:'border-slate-200 hover:bg-slate-50'
                )}>
                  <input type="checkbox" checked={isSelected} onChange={()=>toggleKB(kb.id)} className="accent-violet-600 shrink-0"/>
                  <KBIcon className={cn('w-4 h-4 shrink-0',isSelected?`text-${kb.color}-600`:'text-slate-400')}/>
                  <div className="flex-1 min-w-0">
                    <div className={cn('text-[13px] font-bold',isSelected?'text-slate-800':'text-slate-500')}>{kb.name}</div>
                    <div className="text-[10px] text-slate-400">{kb.docs}개 문서 · 최종 업데이트 {kb.updated}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Top K */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">5 · 검색 결과 수</label>
          <div className="flex items-center gap-3">
            {['3','5','10'].map(v=>(
              <label key={v} className={cn(
                'flex items-center gap-1.5 px-4 py-2 border rounded-xl cursor-pointer transition-all text-sm font-bold select-none',
                topK===v?'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-100':'border-slate-200 text-slate-500 hover:bg-slate-50'
              )}>
                <input type="radio" name="topk" value={v} checked={topK===v} onChange={()=>setTopK(v)} className="sr-only"/>
                상위 {v}건
              </label>
            ))}
          </div>
        </div>

        <button onClick={startSearch}
          disabled={!query.trim()}
          className="w-full py-3.5 bg-violet-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-violet-700 transition-colors shadow-lg shadow-violet-100 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed">
          <Search className="w-4 h-4"/>
          {searchMode==='semantic'?'시맨틱 검색 시작':'전문 검색 시작'}
        </button>
      </div>
    </div>
  );

  if(step===2)return(
    <div className="flex-1 flex min-h-0 overflow-hidden">
      <div className="flex-1 min-w-0 flex flex-col items-center justify-center overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-xl px-6">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-100">
              <Radio className="w-7 h-7 text-white animate-pulse"/>
            </div>
            <div className="text-[18px] font-black text-slate-800">
              {searchMode==='semantic'?'시맨틱 검색 중':'전문 검색 중'}
            </div>
            <div className="text-sm text-slate-400 mt-1">
              {searchMode==='semantic'?'벡터 임베딩 기반으로 관련 문서를 검색합니다':'키워드 매칭으로 문서 내 정확한 위치를 탐색합니다'}
            </div>
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
                    isActive?'border-violet-300 bg-violet-50 shadow-md shadow-violet-100':
                    'border-slate-100 bg-white opacity-50'
                  )}>
                    <div className="flex items-center gap-3">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all',
                        isDone?'bg-emerald-500':isActive?ag.color:'bg-slate-200')}>
                        {isDone?<CheckCircle className="w-5 h-5 text-white"/>
                          :<AgIcon className={cn('w-5 h-5',isActive?'text-white animate-pulse':'text-slate-400')}/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn('font-black text-sm',isDone?'text-emerald-700':isActive?'text-violet-700':'text-slate-400')}>{ag.label}</div>
                        <div className={cn('text-xs mt-0.5',isDone?'text-emerald-500':isActive?'text-violet-500':'text-slate-300')}>
                          {isActive?`처리 중 — ${ag.sub}`:isDone?`완료 — ${ag.sub}`:ag.sub}
                        </div>
                      </div>
                      {isActive&&<Loader2 className="w-4 h-4 text-violet-500 animate-spin shrink-0"/>}
                      {isDone&&<span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">완료</span>}
                    </div>
                    {isActive&&<div className="mt-3"><div className="h-1 bg-violet-100 rounded-full overflow-hidden"><div className="h-1 bg-violet-500 rounded-full animate-pulse" style={{width:'65%'}}/></div></div>}
                  </div>
                  {i<AGENTS.length-1&&<div className="flex justify-center my-1"><ChevronRight className="w-4 h-4 text-slate-300 rotate-90"/></div>}
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center text-xs text-slate-400">
            <Network className="w-3.5 h-3.5 inline mr-1 text-violet-400"/>
            {searchMode==='semantic'?'벡터 임베딩 기반 시맨틱 검색 — 의미적 유사도로 최적 문서를 검색합니다':'키워드 전문 검색 — 문서 내 정확한 위치를 탐색합니다'}
          </div>
        </div>
      </div>
      <div className="hidden lg:flex w-80 shrink-0 border-l border-slate-100 bg-gradient-to-b from-slate-50 to-white p-4 overflow-y-auto custom-scrollbar flex-col">
        <AgentWorkflowPanel agentId="agent-knowledge" activeStep={agentIdx} doneSteps={doneIdx} />
      </div>
    </div>
  );

  /* ── STEP 3: 결과 ── */
  const allResults=C.results.slice(0,parseInt(topK));
  const topResults=secFilter==='all'?allResults:allResults.filter(r=>r.secLevel===secFilter);
  const aiSummary=C.aiSummaries[query]||C.aiSummaries.DEFAULT;

  return(
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      <div className="shrink-0 bg-white border-b px-5 py-2.5 flex items-center gap-2 flex-wrap shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0"><CheckCircle className="w-3.5 h-3.5 text-white"/></div>
          <div className="min-w-0">
            <div className="text-[13px] font-black text-slate-800 truncate">검색 완료 · {topResults.length}건</div>
            <div className="text-[10px] text-slate-400">
              {searchMode==='semantic'?'시맨틱 검색':'전문 검색'} 결과 · 검색 시간 0.38초
            </div>
          </div>
        </div>
        <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-[11px] font-bold text-slate-500 hover:bg-slate-50 transition-colors">
          <RotateCcw className="w-3 h-3"/>새 검색
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* 검색어 표시 */}
        <div className="bg-slate-800 rounded-xl px-4 py-3 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0"/>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">검색어</div>
            <div className="text-[13px] text-white">{query}</div>
          </div>
          <span className="shrink-0 text-[10px] font-black text-violet-400 bg-violet-900/40 px-2 py-1 rounded-lg flex items-center gap-1">
            <Zap className="w-3 h-3"/>
            {searchMode==='semantic'?'시맨틱 검색':'전문 검색'}
          </span>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {label:'검색 결과',value:`${topResults.length}건`,color:'text-violet-700',bg:'bg-violet-50 border-violet-200'},
            {label:'최고 유사도',value:`${topResults[0]?.score.toFixed(1)||0}%`,color:'text-emerald-600',bg:'bg-emerald-50 border-emerald-200'},
            {label:'검색 시간',value:'0.38초',color:'text-blue-600',bg:'bg-blue-50 border-blue-200'},
          ].map(({label,value,color,bg})=>(
            <div key={label} className={cn('border rounded-xl px-4 py-3 text-center',bg)}>
              <div className={cn('text-[18px] font-black',color)}>{value}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* AI 요약 카드 */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-600"/>
            <span className="text-[13px] font-black text-indigo-800">검색 결과 요약</span>
            <span className="ml-auto text-[10px] text-indigo-500">GPT-OSS 120B 생성</span>
          </div>
          <p className="text-[12px] text-indigo-700 leading-relaxed">{aiSummary}</p>
        </div>

        {/* 보안 등급 필터 (결과 화면) */}
        {secFilter!=='all'&&(
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-700 font-bold">
            <Shield className="w-3.5 h-3.5"/>
            <span>{SEC_LABELS[secFilter]} 등급 문서만 표시 중</span>
            <button onClick={()=>setSecFilter('all')} className="ml-auto text-amber-600 hover:text-amber-800 underline text-[10px]">전체 보기</button>
          </div>
        )}

        {/* 검색 결과 목록 */}
        <div className="space-y-3">
          {topResults.map((r,idx)=>(
            <div key={r.id} className="bg-white border rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
              <button onClick={()=>toggleExpand(r.id)} className="w-full text-left">
                <div className="px-5 py-4 flex items-start gap-3">
                  <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white text-[12px] font-black shadow-sm',
                    idx===0?'bg-amber-500':idx===1?'bg-slate-500':'bg-slate-400')}>
                    {idx+1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="text-[14px] font-black text-slate-800 leading-snug">{r.title}</div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={cn('text-[10px] font-black px-2 py-0.5 rounded-full',SEC_COLORS[r.secLevel])}>{SEC_LABELS[r.secLevel]}</span>
                        <span className={cn('text-[12px] font-black',r.score>=90?'text-emerald-600':r.score>=75?'text-blue-600':'text-slate-500')}>
                          {r.score.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mb-2">
                      <FileText className="w-3 h-3"/>
                      <span>{r.source}</span>
                      <span>·</span>
                      <span>p.{r.page}</span>
                      {searchMode==='fulltext'&&r.line&&(
                        <>
                          <span>·</span>
                          <span className="text-violet-500 font-bold">{r.line}</span>
                        </>
                      )}
                    </div>
                    <p className={cn('text-[12px] text-slate-600 leading-relaxed',expanded.has(r.id)?'':'line-clamp-2')}>
                      {r.excerpt}
                    </p>
                  </div>
                  <ChevronDown className={cn('w-4 h-4 text-slate-400 shrink-0 mt-1 transition-transform',expanded.has(r.id)&&'rotate-180')}/>
                </div>
              </button>
              {expanded.has(r.id)&&(
                <div className="px-5 pb-4 border-t border-slate-100 pt-3">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {r.keywords.map((kw,ki)=>(
                      <span key={ki} className="text-[10px] px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 font-medium flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5"/>{kw}
                      </span>
                    ))}
                  </div>
                  {searchMode==='fulltext'&&r.line&&(
                    <div className="mb-3 px-3 py-2 bg-violet-50 border border-violet-100 rounded-xl flex items-center gap-2">
                      <Hash className="w-3.5 h-3.5 text-violet-500"/>
                      <span className="text-[11px] font-bold text-violet-700">위치: {r.line}</span>
                    </div>
                  )}
                  {/* 온톨로지 속성 매칭 — 팩이 attrs를 공급할 때만 (제조 도면 등 구조화 지식) */}
                  {r.attrs?.length>0&&(
                    <div className="mb-3">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Network className="w-3 h-3"/>온톨로지 속성 매칭
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {r.attrs.map((a,ai)=>(
                          <div key={ai} className={cn('px-2.5 py-1.5 rounded-lg border text-[10px]',
                            a.match?'bg-emerald-50 border-emerald-200':'bg-slate-50 border-slate-200')}>
                            <div className="text-slate-400 font-medium">{a.label}</div>
                            <div className={cn('font-black flex items-center gap-1 mt-0.5',a.match?'text-emerald-700':'text-slate-600')}>
                              {a.match&&<CheckCircle className="w-2.5 h-2.5 shrink-0"/>}
                              <span className="truncate">{a.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* 유사도 바 */}
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] text-slate-400 w-16 shrink-0">유사도</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-violet-500 transition-all" style={{width:`${r.score}%`}}/>
                    </div>
                    <span className="text-[11px] font-black text-violet-600 w-12 text-right">{r.score.toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 온톨로지 산출물 — 설계 아웃라인 (팩이 outline을 공급할 때만 노출) */}
        {C.outline&&(
          <div className="bg-white border-2 border-violet-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 bg-violet-50/70 border-b border-violet-100 flex items-center gap-2 flex-wrap">
              <Sparkles className="w-4 h-4 text-violet-600 shrink-0"/>
              <span className="text-[13px] font-bold text-slate-800">{C.outline.title}</span>
              {C.outline.badge&&(
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-violet-600 text-white font-semibold shrink-0">{C.outline.badge}</span>
              )}
              {C.outline.subtitle&&(
                <span className="ml-auto text-[10px] text-slate-500 font-medium truncate">{C.outline.subtitle}</span>
              )}
            </div>

            {/* 도면 스케치 + 자동 산출 제원 */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4">
              {C.outline.shape&&(
                <div className="lg:col-span-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">자동 생성 아웃라인 (개념도)</div>
                  <svg viewBox={C.outline.shape.viewBox} className="w-full h-44" role="img" aria-label="자동 생성된 설계 아웃라인 개념도">
                    {C.outline.shape.paths.map((p,pi)=>(
                      <path key={pi} d={p.d} fill={p.fill||'none'} stroke={p.stroke||'#7c3aed'} strokeWidth={p.width||1.5}
                        strokeDasharray={p.dash||undefined} strokeLinejoin="round"/>
                    ))}
                    {(C.outline.shape.labels||[]).map((l,li)=>(
                      <text key={li} x={l.x} y={l.y} fontSize={l.size||9} fill={l.color||'#64748b'} textAnchor={l.anchor||'middle'}>{l.text}</text>
                    ))}
                  </svg>
                </div>
              )}
              {C.outline.specs?.length>0&&(
                <div className="lg:col-span-2 space-y-1.5">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">자동 산출 제원</div>
                  {C.outline.specs.map((s,si)=>(
                    <div key={si} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white">
                      <span className="text-[11px] text-slate-500 font-medium shrink-0 w-20 truncate">{s.label}</span>
                      <span className="text-[12px] font-bold text-slate-800 font-mono tabular-nums flex-1 min-w-0 truncate">{s.value}</span>
                      {s.from&&<span className="text-[9px] text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded shrink-0">{s.from}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 자동 검증 (간섭·공차 등) */}
            {C.outline.checks?.length>0&&(
              <div className="px-4 pb-4">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">설계 자동 검증</div>
                <div className="space-y-1.5">
                  {C.outline.checks.map((c,ci)=>{
                    const tone=c.status==='ok'?{bg:'bg-emerald-50 border-emerald-200',t:'text-emerald-700',Icon:CheckCircle}
                      :c.status==='warn'?{bg:'bg-amber-50 border-amber-200',t:'text-amber-700',Icon:Shield}
                      :{bg:'bg-rose-50 border-rose-200',t:'text-rose-700',Icon:Shield};
                    const TIcon=tone.Icon;
                    return(
                      <div key={ci} className={cn('flex items-start gap-2 px-3 py-2 rounded-lg border',tone.bg)}>
                        <TIcon className={cn('w-3.5 h-3.5 shrink-0 mt-px',tone.t)}/>
                        <div className="min-w-0 flex-1">
                          <span className={cn('text-[11px] font-bold',tone.t)}>{c.label}</span>
                          {c.detail&&<span className="text-[11px] text-slate-500 ml-1.5">{c.detail}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 기대 효과 + 안내 */}
            {(C.outline.effect||C.outline.note)&&(
              <div className="px-4 pb-4 space-y-2">
                {C.outline.effect&&(
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900">
                    <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0"/>
                    <span className="text-[11px] text-slate-300 font-medium shrink-0">{C.outline.effect.label}</span>
                    <span className="ml-auto flex items-center gap-2 shrink-0">
                      <span className="text-[12px] text-slate-500 line-through font-mono tabular-nums">{C.outline.effect.before}</span>
                      <ChevronRight className="w-3 h-3 text-slate-600"/>
                      <span className="text-[15px] font-black text-white font-mono tabular-nums">{C.outline.effect.after}</span>
                      {C.outline.effect.delta&&(
                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full">{C.outline.effect.delta}</span>
                      )}
                    </span>
                  </div>
                )}
                {C.outline.note&&(
                  <p className="text-[10px] text-slate-400 leading-relaxed flex items-start gap-1.5">
                    <Lock className="w-3 h-3 shrink-0 mt-0.5"/>{C.outline.note}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* 유사 문서 추천 */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-slate-500"/>
            <span className="text-[13px] font-black text-slate-700">유사 문서 추천</span>
            <span className="ml-auto text-[10px] text-slate-400">관련성 기반 자동 추천</span>
          </div>
          <div className="divide-y divide-slate-100">
            {C.similarDocs.map((doc,i)=>(
              <div key={i} className="px-5 py-3.5 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-violet-50 border border-violet-200 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-violet-500"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold text-slate-700 leading-snug">{doc.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{doc.source}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-[13px] font-black text-violet-600">{doc.relevance}%</div>
                  <div className="text-[9px] text-slate-400">관련성</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0"/>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center py-2">
          <button onClick={reset} className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-[13px] font-black hover:bg-violet-700 transition-colors shadow-md shadow-violet-100">
            <RotateCcw className="w-4 h-4"/>새 검색
          </button>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeAgent;
