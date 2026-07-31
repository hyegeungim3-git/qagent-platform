import React, { useState, useRef } from "react";
import {
  FileSearch, Upload, CheckSquare, Square, ShieldCheck, Radio, Loader2,
  CheckCircle, ChevronRight, Network, RotateCcw, FileCheck, ExternalLink,
  Clock, AlertTriangle, AlertCircle, Info, Eye, Edit3, X, BookOpen, Highlighter
} from "lucide-react";
import ApprovalModal from "../ApprovalModal.jsx";
import AgentWorkflowPanel from "./AgentWorkflowPanel.jsx";
import { AGENT_TEAMS } from "../../data/constants.js";
import { REB_LOGO } from "../../data/logos.js";
import { useAgentSimulation } from "../../hooks/useAgentSimulation.js";
import { cn, agentHeader } from "../../utils.jsx";


const APV_LINE=[
  {name:'김민준',dept:'부동산공시처',title:'과장',role:'작성자'},
  {name:'박지현',dept:'부동산공시처',title:'공시관리부장',role:'검토자'},
  {name:'이상호',dept:'부동산공시처',title:'처장',role:'승인자'},
];

const AGENTS=[
  {icon:ShieldCheck,label:'DRM 해제 에이전트',sub:'DRM 해제 및 텍스트 추출 중',color:'bg-slate-600',ms:1800},
  {icon:Eye,label:'OCR 처리 에이전트',sub:'이미지/표 영역 OCR 처리 중',color:'bg-blue-600',ms:2200},
  {icon:BookOpen,label:'규정 검색 에이전트',sub:'사내 지식망 시맨틱 검색 중',color:'bg-indigo-600',ms:3000},
  {icon:FileSearch,label:'위반사항 검토 에이전트',sub:'사규와 대조하여 위반 소지 분석 중',color:'bg-violet-600',ms:2500},
];

const RAG_DOCS=[
  '취업규칙 제23조 (출장 여비 기준)',
  '복무규정 제11조 (외부 겸직 제한)',
  '업무처리지침 제7조 (공시지가 산정 절차)',
  '보안정책 제15조 (개인정보 처리 기준)',
  '개인정보처리방침 제3조 (제3자 제공)',
  '취업규칙 제18조 (근무시간 및 초과근무)',
  '업무처리지침 제14조 (감정평가 보고서 작성)',
];

const VIOLATIONS=[
  {
    clause:'취업규칙 제23조 제2항',
    type:'출장 여비 과다 청구',
    severity:'high',
    content:'공무 출장 시 실비 초과 지급 조항 위반 소지. 공시지가 현장조사 출장비가 기준액(일 60,000원) 대비 23% 초과 계상.',
    action:'출장 여비 정산 내역 재검토 및 증빙서류 첨부 후 재상신 요망.',
  },
  {
    clause:'업무처리지침 제7조 제1항',
    type:'공시지가 산정 절차 누락',
    severity:'medium',
    content:'표준지공시지가 산정 보고서 내 현장 조사 체크리스트 첨부 누락. 지침상 의무 첨부 서류 미포함.',
    action:'현장조사 체크리스트(별지 제7호 서식) 첨부 후 재제출.',
  },
  {
    clause:'보안정책 제15조 제3항',
    type:'개인정보 처리 미고지',
    severity:'low',
    content:'감정평가 의뢰인 연락처 수집 시 개인정보 수집·이용 동의서 미첨부. 경미한 절차적 하자.',
    action:'개인정보 동의서(별지 제15호) 사후 징구 및 파일 첨부.',
  },
];

const REGS=[
  {id:'r1',label:'취업규칙·복무규정'},
  {id:'r2',label:'업무처리지침'},
  {id:'r3',label:'보안정책'},
  {id:'r4',label:'개인정보처리방침'},
  {id:'r5',label:'감정평가 관련 규정'},
];

const SEVERITY={
  high:{label:'높음',cls:'bg-red-100 text-red-700 border-red-200'},
  medium:{label:'중간',cls:'bg-amber-100 text-amber-700 border-amber-200'},
  low:{label:'낮음',cls:'bg-blue-100 text-blue-700 border-blue-200'},
};

const HIGHLIGHT_SEGS=[
  {text:'표준지공시지가 현장조사 출장비 정산 보고서\n\n조사 기간: 2026. 03. 01. ~ 2026. 03. 15. (15일)\n조사 지역: 서울 노원구 · 도봉구 일대\n조사 책임자: 김민준 과장 (부동산공시처)\n\n━━ 출장비 내역 ━━\n교통비: 일 15,000원 × 15일 = 225,000원\n식  비: 일 20,000원 × 15일 = 300,000원\n',type:null},
  {text:'숙박비: 일 40,000원 × 5박 = 200,000원\n합  계: 일 74,000원 — 기준 60,000원 대비 23% 초과 계상',type:'high'},
  {text:'\n\n━━ 첨부 서류 ━━\n✔ 출장 확인서 (별지 제1호)\n✔ 교통비 영수증\n✔ 식비 영수증\n',type:null},
  {text:'✘ 현장조사 체크리스트 (별지 제7호) — 미첨부',type:'medium'},
  {text:'\n\n━━ 의뢰인 정보 ━━\n성  명: 홍 길 동\n주  소: 서울 노원구 중계동 123번지\n',type:null},
  {text:'연락처: 010-1234-5678 (개인정보 수집·이용 동의서 미첨부)',type:'low'},
  {text:'\n\n━━ 보 고 ━━\n위와 같이 현장조사 출장비를 정산하여 보고합니다.\n\n2026년 3월 16일\n부동산공시처 김민준 과장 (인)',type:null},
];

/* 도메인 이관: REB 기본 콘텐츠 — 도메인 팩 agentContent["agent-review"]로 키 단위 오버라이드 */
export const CONTENT_DEFAULTS={
  headerTitle:'사규 기반 문서 사전 검토 에이전트',      // string — 미제공 시 허브 카탈로그 이름 승계
  headerDesc:'문서 업로드 → 멀티 에이전트 분석 → 위반 소지 검토 보고서 생성',// string — 헤더 설명(작업 흐름)
  apvLine: APV_LINE,             // {name,dept,title,role}[3] — 결재선(작성자→검토자→승인자 순서 고정). 배열 통째 교체
  ragDocs: RAG_DOCS,             // string[7] — RAG 검색 티커에 노출되는 규정 조항명. 배열 통째 교체
  violations: VIOLATIONS,        // {clause,type,severity:'high'|'medium'|'low',content,action}[3] — 위반 소지 3건(심각도별 1건씩, highlightSegs와 순서 대응). 배열 통째 교체
  regs: REGS,                    // {id:'r1'~'r5',label}[5] — 검토 대상 규정 선택지. id는 r1~r5 유지(초기 체크 상태가 id 기준). 배열 통째 교체
  highlightSegs: HIGHLIGHT_SEGS, // {text,type:null|'high'|'medium'|'low'}[7] — 하이라이트 뷰 문서 본문 분절. type은 violations[0..2]의 severity와 대응. 배열 통째 교체
  highlightLegendLabels:{high:'높음 — 여비 초과',medium:'중간 — 서류 누락',low:'낮음 — 절차 미비'}, // {high,medium,low} — 하이라이트 범례 문구
  highlightDocTitle:'표준지공시지가 현장조사 출장비 정산 보고서', // string — 하이라이트 뷰 검토 대상 문서명
  reviewNum:'검토-2026-031',              // string — 검토 관리번호(툴바·하이라이트·원본 편집에 노출)
  dept:'부동산공시처',                     // string — 보고서 헤더 담당부서
  docNum:'KREA-부동산공시처-2026-031',    // string — 보고서 헤더 문서번호
  apvDocNum:'KREA-부동산공시처-2026-034', // string — 결재 상신 모달 문서번호
  logoSrc: REB_LOGO,                      // string(data URI) — 보고서 헤더 로고 이미지
  logoAlt:'REB 한국부동산원',              // string — 로고 대체 텍스트
};

const DocReviewAgent=({onBack,domain})=>{
  const C={...CONTENT_DEFAULTS,...(domain?.agentContent?.["agent-review"]||{})};
  const H=agentHeader(domain,'agent-review',C,AGENT_TEAMS);
  const compScore=(()=>{
    const h=C.violations.filter(v=>v.severity==='high').length;
    const m=C.violations.filter(v=>v.severity==='medium').length;
    const l=C.violations.filter(v=>v.severity==='low').length;
    return Math.max(0,100-h*20-m*10-l*5);
  })();
  const {step,setStep,agentIdx,doneIdx,start:startSim,resetSim}=useAgentSimulation(AGENTS,{
    // RAG 검색 단계(i=2)의 문서 스캔 티커 + 각 단계 종료 시 RAG 패널 비활성화
    onStepStart:(i,prev,ag)=>{
      setTimeout(()=>setRagActive(false),prev+ag.ms);
      if(i===2){
        setTimeout(()=>setRagActive(true),prev+400);
        let rd=prev+400;
        C.ragDocs.forEach((_,ri)=>{
          rd+=360;
          setTimeout(()=>setRagIdx(ri),rd);
        });
      }
    },
  });
  const [files,setFiles]=useState([]);
  const [drag,setDrag]=useState(false);
  const [checkedRegs,setCheckedRegs]=useState({r1:true,r2:true,r3:false,r4:false,r5:false});
  const [ragActive,setRagActive]=useState(false);
  const [ragIdx,setRagIdx]=useState(0);
  const [viewMode,setViewMode]=useState('doc');
  const [apvState,setApvState]=useState(null);
  const [apvMsg,setApvMsg]=useState('사규 검토 결과 검토 요청드립니다.');
  const fileRef=useRef(null);

  const toggleReg=id=>setCheckedRegs(p=>({...p,[id]:!p[id]}));

  const addFiles=newFiles=>{
    const allowed=newFiles.filter(f=>files.length<3);
    setFiles(p=>[...p,...allowed].slice(0,3));
  };

  const removeFile=i=>setFiles(p=>p.filter((_,j)=>j!==i));

  const startProcess=()=>{setRagActive(false);setRagIdx(0);startSim();};

  const reset=()=>{resetSim();setFiles([]);setApvState(null);setApvMsg('사규 검토 결과 검토 요청드립니다.');};
  const submitApv=()=>{setApvState('submitting');setTimeout(()=>setApvState('done'),1600);};

  // STEP 1
  if(step===1)return(
    <div className="flex-1 overflow-y-auto px-6 py-8 bg-white">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-2">
          {onBack&&<button onClick={onBack} aria-label="뒤로 가기" className="text-slate-400 hover:text-indigo-600 transition-colors mr-1"><ChevronRight className="w-4 h-4 rotate-180"/></button>}
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md"><FileSearch className="w-5 h-5 text-white"/></div>
          <div>
            <div className="text-[15px] font-black text-slate-800">{H.title}</div>
            <div className="text-xs text-slate-400">{H.desc}</div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">1 · 검토 문서 업로드 (최대 3개)</label>
          <div
            onDragOver={e=>{e.preventDefault();setDrag(true);}}
            onDragLeave={()=>setDrag(false)}
            onDrop={e=>{e.preventDefault();setDrag(false);addFiles(Array.from(e.dataTransfer.files));}}
            onClick={()=>files.length<3&&fileRef.current?.click()}
            className={cn('border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-8 transition-all',
              drag?'border-indigo-400 bg-indigo-50':'border-slate-200 hover:border-indigo-300 hover:bg-slate-50',
              files.length>=3&&'opacity-50 cursor-not-allowed',files.length<3&&'cursor-pointer')}>
            <input ref={fileRef} type="file" multiple accept=".pdf,.doc,.docx,.hwp" className="hidden"
              onChange={e=>addFiles(Array.from(e.target.files))}/>
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center mb-3"><Upload className="w-5 h-5 text-slate-400"/></div>
            <div className="font-bold text-slate-500 text-sm">파일을 드래그하거나 클릭하여 업로드</div>
            <div className="text-xs text-slate-400 mt-1">PDF · DOC · DOCX · HWP — 최대 3개</div>
          </div>
          {files.length>0&&(
            <div className="space-y-2 mt-2">
              {files.map((f,i)=>(
                <div key={i} className="flex items-center gap-2.5 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0"><FileSearch className="w-3.5 h-3.5 text-white"/></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-bold text-slate-700 truncate">{f.name}</div>
                    <div className="text-[10px] text-slate-400">{(f.size/1024).toFixed(0)} KB</div>
                  </div>
                  <button onClick={()=>removeFile(i)} aria-label="파일 제거" className="text-slate-300 hover:text-red-400 transition-colors"><X className="w-3.5 h-3.5"/></button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">2 · 검토 대상 규정 선택</label>
          <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
            {C.regs.map(r=>(
              <label key={r.id} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors">
                <div onClick={()=>toggleReg(r.id)} className="shrink-0">
                  {checkedRegs[r.id]
                    ?<CheckSquare className="w-4.5 h-4.5 text-indigo-600"/>
                    :<Square className="w-4.5 h-4.5 text-slate-300"/>}
                </div>
                <span className={cn('text-[13px] font-medium transition-colors',checkedRegs[r.id]?'text-slate-800':'text-slate-400')}>{r.label}</span>
                {checkedRegs[r.id]&&<span className="ml-auto text-[9px] font-black text-indigo-500 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">검토 대상</span>}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={startProcess}
          disabled={files.length===0}
          className="w-full py-3.5 bg-indigo-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 text-[15px] disabled:opacity-40 disabled:cursor-not-allowed">
          <Radio className="w-4 h-4"/> 사전 검토 시작
        </button>
        {files.length===0&&<p className="text-center text-[11px] text-slate-400">검토할 문서를 1개 이상 업로드해 주세요.</p>}
      </div>
    </div>
  );

  // STEP 2
  if(step===2)return(
    <div className="flex-1 flex min-h-0 overflow-hidden">
      <div className="flex-1 min-w-0 flex flex-col items-center justify-center overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-xl px-6">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
              <Radio className="w-7 h-7 text-white animate-pulse"/>
            </div>
            <div className="text-[18px] font-black text-slate-800">사규 검토 에이전트 처리 중</div>
            <div className="text-sm text-slate-400 mt-1">AI 에이전트들이 순차적으로 문서를 분석합니다</div>
          </div>
          <div className="space-y-3">
            {AGENTS.map((ag,i)=>{
              const isDone=doneIdx.includes(i);
              const isActive=agentIdx===i;
              const AgIcon=ag.icon;
              const showRag=isActive&&i===2&&ragActive;
              return(
                <div key={i}>
                  <div className={cn('rounded-2xl border-2 p-4 transition-all duration-500',
                    isDone?'border-emerald-200 bg-emerald-50/60':isActive?'border-indigo-300 bg-indigo-50 shadow-md shadow-indigo-100':'border-slate-100 bg-white opacity-50')}>
                    <div className="flex items-center gap-3">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all',isDone?'bg-emerald-500':isActive?ag.color:'bg-slate-200')}>
                        {isDone?<CheckCircle className="w-5 h-5 text-white"/>:<AgIcon className={cn('w-5 h-5',isActive?'text-white animate-pulse':'text-slate-400')}/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn('font-black text-sm',isDone?'text-emerald-700':isActive?'text-indigo-700':'text-slate-400')}>{ag.label}</div>
                        <div className={cn('text-xs mt-0.5',isDone?'text-emerald-500':isActive?'text-indigo-500':'text-slate-300')}>
                          {isActive?`처리 중 — ${ag.sub}`:isDone?`완료 — ${ag.sub}`:ag.sub}
                        </div>
                      </div>
                      {isActive&&<Loader2 className="w-4 h-4 text-indigo-500 animate-spin shrink-0"/>}
                      {isDone&&<span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">완료</span>}
                    </div>
                    {isActive&&!showRag&&(
                      <div className="mt-3"><div className="h-1 bg-indigo-100 rounded-full overflow-hidden"><div className="h-1 bg-indigo-500 rounded-full animate-pulse" style={{width:'65%'}}/></div></div>
                    )}
                    {showRag&&(
                      <div className="mt-3 space-y-1">
                        {C.ragDocs.slice(0,ragIdx+1).map((d,ri)=>(
                          <div key={ri} className={cn('flex items-center gap-2 text-[11px] rounded-lg px-2 py-1 transition-all',ri===ragIdx?'bg-indigo-100 text-indigo-700 font-bold':'text-slate-400 bg-transparent')}>
                            {ri===ragIdx?<Loader2 className="w-3 h-3 animate-spin shrink-0"/>:<CheckCircle className="w-3 h-3 text-emerald-400 shrink-0"/>}
                            {d}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {i<AGENTS.length-1&&<div className="flex justify-center my-1"><ChevronRight className="w-4 h-4 text-slate-300 rotate-90"/></div>}
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center text-xs text-slate-400">
            <Network className="w-3.5 h-3.5 inline mr-1 text-indigo-400"/>
            멀티 에이전트 파이프라인 — DRM 해제부터 위반 분석까지 자동 처리
          </div>
        </div>
      </div>
      <div className="hidden lg:flex w-80 shrink-0 border-l border-slate-100 bg-gradient-to-b from-slate-50 to-white p-4 overflow-y-auto custom-scrollbar flex-col">
        <AgentWorkflowPanel agentId="agent-review" activeStep={agentIdx} doneSteps={doneIdx} />
      </div>
    </div>
  );

  // STEP 3
  return(
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-100">
      {/* toolbar */}
      <div className="shrink-0 bg-white border-b px-5 py-2.5 flex items-center gap-2 flex-wrap shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0"><CheckCircle className="w-3.5 h-3.5 text-white"/></div>
          <div className="min-w-0">
            <div className="text-[13px] font-black text-slate-800 truncate">검토 완료 — 위반 소지 {C.violations.length}건 발견</div>
            <div className="text-[10px] text-slate-400">문서 {files.length}개 · {C.reviewNum}</div>
          </div>
        </div>
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 gap-0.5">
          {[['doc','문서 보기'],['highlight','위반 하이라이트'],['edit','원본 편집']].map(([m,l])=>(
            <button key={m} onClick={()=>setViewMode(m)}
              className={cn('px-3 py-1.5 rounded-md text-[11px] font-bold transition-all',viewMode===m?'bg-white text-indigo-700 shadow-sm':'text-slate-500 hover:text-slate-700')}>{l}</button>
          ))}
        </div>
        <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-[11px] font-bold text-slate-500 hover:bg-slate-50 transition-colors"><RotateCcw className="w-3 h-3"/>새 검토</button>
        {apvState!=='done'
          ?<button onClick={()=>setApvState('modal')} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[11px] font-bold hover:bg-indigo-700 transition-colors shadow-sm"><FileCheck className="w-3 h-3"/>결재 상신</button>
          :<span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold"><CheckCircle className="w-3 h-3"/>결재 진행 중</span>
        }
      </div>

      {/* apv status bar */}
      {apvState==='done'&&(
        <div className="shrink-0 bg-indigo-50 border-b border-indigo-100 px-5 py-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"/>
              <span className="text-[11px] font-black text-slate-700">결재 현황</span>
              <span className="text-[9px] font-bold text-white bg-indigo-600 px-1.5 py-0.5 rounded">WorksOn</span>
            </div>
            <div className="flex items-center gap-1 flex-1 min-w-0">
              {C.apvLine.map((p,i)=>(
                <React.Fragment key={i}>
                  <div className={cn('flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] border whitespace-nowrap',
                    i===0?'bg-emerald-50 border-emerald-200':i===1?'bg-blue-50 border-blue-200 shadow-sm':'bg-white border-slate-200')}>
                    {i===0?<CheckCircle className="w-3 h-3 text-emerald-500 shrink-0"/>:i===1?<Loader2 className="w-3 h-3 text-blue-500 animate-spin shrink-0"/>:<Clock className="w-3 h-3 text-slate-300 shrink-0"/>}
                    <span className="font-bold text-slate-700">{p.name}</span>
                    <span className={cn('font-black text-[9px]',i===0?'text-emerald-500':i===1?'text-blue-500':'text-slate-300')}>{i===0?'서명 완료':i===1?'검토 중':'대기'}</span>
                  </div>
                  {i<C.apvLine.length-1&&<ChevronRight className="w-3 h-3 text-slate-300 shrink-0"/>}
                </React.Fragment>
              ))}
            </div>
            <a href="#" onClick={e=>e.preventDefault()} className="text-[10px] font-bold text-indigo-500 hover:underline flex items-center gap-0.5 shrink-0">WorksOn에서 보기<ExternalLink className="w-2.5 h-2.5"/></a>
          </div>
        </div>
      )}

      {/* modal */}
      {(apvState==='modal'||apvState==='submitting')&&(
        <ApprovalModal
          docTitle="사규 기반 문서 검토 보고서"
          docNum={C.apvDocNum}
          apvLine={C.apvLine}
          apvMsg={apvMsg} setApvMsg={setApvMsg}
          onClose={()=>setApvState(null)}
          onSubmit={submitApv}
          submitting={apvState==='submitting'}
          accentBg="bg-indigo-600"
          accentBtn="bg-indigo-600 hover:bg-indigo-700"
        />
      )}

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {viewMode==='edit'?(
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border shadow-sm overflow-hidden">
            <textarea
              defaultValue={`사규 기반 문서 사전 검토 보고서\n문서번호: ${C.reviewNum}\n\n[검토 결과 요약]\n총 검토 문서: ${files.length}개\n위반 소지 건수: ${C.violations.length}건 (높음 ${C.violations.filter(v=>v.severity==='high').length}, 중간 ${C.violations.filter(v=>v.severity==='medium').length}, 낮음 ${C.violations.filter(v=>v.severity==='low').length})\n보완 필요: 2건\n적합 판정: ${files.length-1}개\n\n[위반 사항 상세]\n${C.violations.map((v,i)=>`${i+1}. ${v.clause}\n   유형: ${v.type}\n   내용: ${v.content}\n   조치: ${v.action}`).join('\n\n')}`}
              className="w-full p-6 font-mono text-[13px] text-slate-700 leading-relaxed resize-none outline-none"
              style={{minHeight:600}}/>
          </div>
        ):viewMode==='highlight'?(
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-white rounded-xl border shadow-sm px-5 py-3 flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-500"><Highlighter className="w-3.5 h-3.5"/>위반 하이라이트 범례:</div>
              {[{type:'high',label:C.highlightLegendLabels.high,bg:'bg-red-200 border-b-2 border-red-400'},{type:'medium',label:C.highlightLegendLabels.medium,bg:'bg-amber-200 border-b-2 border-amber-400'},{type:'low',label:C.highlightLegendLabels.low,bg:'bg-blue-200 border-b-2 border-blue-400'}].map(({type,label,bg})=>(
                <div key={type} className="flex items-center gap-1.5">
                  <span className={cn('px-1.5 py-0.5 text-[10px] font-bold rounded-sm',bg)}>{label}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl border shadow-sm">
              <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between">
                <div className="text-[13px] font-black text-slate-700">{C.highlightDocTitle}</div>
                <div className="text-[10px] font-mono text-slate-400">{C.reviewNum}</div>
              </div>
              <div className="px-8 py-6">
                <div className="font-mono text-[12.5px] leading-[2] text-slate-700 whitespace-pre-wrap">
                  {C.highlightSegs.map((seg,i)=>{
                    if(!seg.type)return<span key={i}>{seg.text}</span>;
                    const hcls=seg.type==='high'?'bg-red-200 text-red-900 border-b-2 border-red-400':seg.type==='medium'?'bg-amber-200 text-amber-900 border-b-2 border-amber-400':'bg-blue-200 text-blue-900 border-b-2 border-blue-400';
                    const v=seg.type==='high'?C.violations[0]:seg.type==='medium'?C.violations[1]:C.violations[2];
                    return<span key={i} title={`${v.clause}: ${v.type}`} className={cn('px-0.5 rounded-sm cursor-help',hcls)}>{seg.text}</span>;
                  })}
                </div>
              </div>
              <div className="px-6 pb-5 space-y-2">
                <div className="text-[10px] font-black text-slate-400 mb-3 uppercase tracking-wider">위반 소지 항목 요약</div>
                {C.violations.map((v,i)=>{
                  const s=SEVERITY[v.severity];
                  const SIcon=v.severity==='high'?AlertTriangle:v.severity==='medium'?AlertCircle:Info;
                  const bg=v.severity==='high'?'bg-red-50 border-red-200':v.severity==='medium'?'bg-amber-50 border-amber-200':'bg-blue-50 border-blue-200';
                  const ic=v.severity==='high'?'text-red-500':v.severity==='medium'?'text-amber-500':'text-blue-500';
                  return(
                    <div key={i} className={cn('border rounded-xl px-4 py-3',bg)}>
                      <div className="flex items-center gap-2 mb-1">
                        <SIcon className={cn('w-3.5 h-3.5 shrink-0',ic)}/>
                        <span className="text-[11px] font-black text-slate-700">{v.clause}</span>
                        <span className={cn('ml-auto text-[9px] font-black border px-1.5 py-0.5 rounded-full shrink-0',s.cls)}>{s.label}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{v.action}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ):(
          <div className="max-w-3xl mx-auto shadow-2xl rounded-lg overflow-hidden"
            style={{fontFamily:"'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif",lineHeight:1.85,wordBreak:'keep-all',letterSpacing:'-0.01em'}}>
            {/* 표준 REB 문서 헤더 */}
            <div style={{border:'1px solid #091D58',display:'grid',gridTemplateColumns:'170px 1fr',gridTemplateRows:'auto auto'}}>
              <div style={{gridColumn:'1',gridRow:'1/3',display:'flex',alignItems:'center',justifyContent:'center',padding:'16px 14px',background:'#fff',borderRight:'1px solid #091D58'}}>
                <img src={C.logoSrc} alt={C.logoAlt} style={{width:'130px',height:'auto'}}/>
              </div>
              <div style={{gridColumn:'2',gridRow:'1',display:'flex',alignItems:'center',justifyContent:'center',padding:'18px 14px',background:'#e6e6e6',borderBottom:'1px solid #091D58',overflow:'hidden'}}>
                <div style={{fontSize:'34px',fontWeight:900,letterSpacing:'0.4em',paddingRight:'0.4em',fontFamily:"'HY견고딕','돋움','맑은 고딕',sans-serif",color:'#041E54',lineHeight:1.2,whiteSpace:'nowrap'}}>
                  문서검토보고서
                </div>
              </div>
              <div style={{gridColumn:'2',gridRow:'2',display:'grid',gridTemplateColumns:'72px 1fr 72px 1fr'}}>
                <div style={{padding:'7px 10px',background:'#dfeaf5',borderRight:'1px solid #091D58',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <span style={{fontSize:'12px',fontWeight:700,color:'#091D58'}}>담당부서</span>
                </div>
                <div style={{padding:'7px 12px',borderRight:'1px solid #091D58',display:'flex',alignItems:'center'}}>
                  <span style={{fontSize:'13px',color:'#1a202c',fontWeight:600}}>{C.dept}</span>
                </div>
                <div style={{padding:'7px 10px',background:'#dfeaf5',borderRight:'1px solid #091D58',display:'flex',alignItems:'center',justifyContent:'center'}}>
                  <span style={{fontSize:'12px',fontWeight:700,color:'#091D58'}}>문서번호</span>
                </div>
                <div style={{padding:'7px 12px',display:'flex',flexDirection:'column',justifyContent:'center',gap:'2px'}}>
                  <span style={{fontSize:'12px',fontFamily:'monospace',fontWeight:700,color:'#1a202c'}}>{C.docNum}</span>
                  <span style={{fontSize:'10px',color:'#6b7280'}}>수신: 내부결재</span>
                </div>
              </div>
            </div>

            <div className="bg-white px-10 py-8 space-y-7">
              {/* compliance gauge */}
              {(()=>{
                const R=38,C=2*Math.PI*R;
                const offset=C*(1-compScore/100);
                const gc=compScore>=80?'#10b981':compScore>=60?'#f59e0b':'#ef4444';
                const gtc=compScore>=80?'text-emerald-600':compScore>=60?'text-amber-600':'text-red-600';
                const glabel=compScore>=80?'양호':compScore>=60?'개선 필요':'위험';
                return(
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-5 flex items-center gap-6">
                    <div className="relative w-24 h-24 shrink-0">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        <circle cx="50" cy="50" r={R} fill="none" stroke="#e2e8f0" strokeWidth="10"/>
                        <circle cx="50" cy="50" r={R} fill="none" stroke={gc} strokeWidth="10"
                          strokeDasharray={`${C}`} strokeDashoffset={`${offset}`} strokeLinecap="round"/>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className={cn('text-[20px] font-black leading-none',gtc)}>{compScore}%</div>
                        <div className="text-[9px] text-slate-400 mt-0.5">준수율</div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-[14px] font-black text-slate-800">사규 준수 점수</div>
                      <div className={cn('text-[12px] font-black mt-0.5',gtc)}>{glabel}</div>
                      <div className="mt-2 w-full bg-white/60 rounded-full h-2 overflow-hidden">
                        <div className="h-2 rounded-full transition-all" style={{width:`${compScore}%`,background:gc}}/>
                      </div>
                      <div className="mt-2 flex gap-3 text-[10px]">
                        <span className="text-red-500 font-bold">높음 -{C.violations.filter(v=>v.severity==='high').length*20}pt</span>
                        <span className="text-amber-500 font-bold">중간 -{C.violations.filter(v=>v.severity==='medium').length*10}pt</span>
                        <span className="text-blue-500 font-bold">낮음 -{C.violations.filter(v=>v.severity==='low').length*5}pt</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* summary box */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
                <div className="text-[12px] font-black text-indigo-700 mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5"/>검토 완료 통계
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {label:'총 검토 문서',val:`${files.length}개`,cls:'text-slate-700'},
                    {label:'위반 소지 건수',val:`${C.violations.length}건`,cls:'text-red-600'},
                    {label:'보완 필요',val:'2건',cls:'text-amber-600'},
                    {label:'적합 판정',val:`${files.length-1}개`,cls:'text-emerald-600'},
                  ].map((s,i)=>(
                    <div key={i} className="bg-white rounded-xl border border-indigo-100 p-3 text-center">
                      <div className={cn('text-[22px] font-black',s.cls)}>{s.val}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* violations table */}
              <section>
                <h3 className="flex items-center gap-2 text-[14px] font-black text-slate-800 mb-4">
                  <span className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black shrink-0">!</span>
                  위반 소지 사항 상세
                </h3>
                <div className="space-y-3">
                  {C.violations.map((v,i)=>{
                    const s=SEVERITY[v.severity];
                    const SIcon=v.severity==='high'?AlertTriangle:v.severity==='medium'?AlertCircle:Info;
                    return(
                      <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                        <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                          <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">{v.clause}</span>
                          <span className={cn('flex items-center gap-1 text-[10px] font-black border px-2 py-0.5 rounded-full',s.cls)}>
                            <SIcon className="w-3 h-3"/>심각도: {s.label}
                          </span>
                          <span className="ml-auto text-[12px] font-bold text-slate-600">{v.type}</span>
                        </div>
                        <div className="px-4 py-3 text-[12px] text-slate-600 leading-relaxed space-y-2">
                          <p>{v.content}</p>
                          <div className="flex items-start gap-1.5 pt-1 border-t border-dashed border-slate-200">
                            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 shrink-0 mt-0.5">권고 조치</span>
                            <span className="text-[11px] text-slate-500">{v.action}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* signature */}
              <div className="pt-4" style={{borderTop:'2px solid #091D58'}}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {C.apvLine.map((p,i)=>(
                    <div key={i} className="border border-slate-300 rounded-lg overflow-hidden">
                      <div className="py-1.5 text-center text-[11px] font-bold text-white" style={{background:'#091D58'}}>{p.role}</div>
                      <div className="px-3 py-2 text-center text-[11px] text-slate-500 border-b border-slate-100">{p.name} · {p.title}</div>
                      <div className="h-10"/>
                    </div>
                  ))}
                </div>
                <p className="text-center text-[10px] text-slate-400 mt-4">
                  본 보고서는 GENOS AI 문서검토 에이전트 v1.0에 의해 자동 생성되었으며, 담당자 검토 후 확정됩니다.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocReviewAgent;
