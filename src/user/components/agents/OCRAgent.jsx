import React, { useState, useRef } from "react";
import {
  ScanText, Image, Layers, AlignLeft, Table, BarChart2, Radio, Loader2,
  CheckCircle, ChevronRight, Network, Play, RotateCcw, Copy, Download,
  FileText, X, UploadCloud, ArrowLeft, ShieldCheck, EyeOff
} from "lucide-react";
import AgentWorkflowPanel from "./AgentWorkflowPanel.jsx";
import { AGENT_TEAMS } from "../../data/constants.js";
import { useAgentSimulation } from "../../hooks/useAgentSimulation.js";
import { cn, downloadTextFile, buildDocHtml } from "../../utils.jsx";


const MOCK_FILES = [
  {name:'현장조사_보고서_스캔.pdf', size:'2.3MB', pages:3, type:'pdf'},
  {name:'측량_성과도.jpg', size:'1.1MB', pages:1, type:'img'},
];

const AGENTS = [
  {icon:Image,    label:'이미지 정규화기',    sub:'기울기 보정·해상도 최적화 중',        color:'bg-teal-600',    ms:1800},
  {icon:ScanText, label:'OCR 추출 에이전트',  sub:'Vision OCR 엔진 문자 인식 중',        color:'bg-cyan-600',    ms:3500},
  {icon:Layers,   label:'문서 구조화기',      sub:'단락·표·목록 구조 재구성 중',         color:'bg-emerald-600', ms:2000},
];

const OCR_LANGUAGE_OPTIONS = ['한국어(기본)','한국어+영어','영어만'];
const RESULT_FORMAT_OPTIONS = ['일반 텍스트','마크다운','JSON 구조화'];
const DOC_MODE_OPTIONS = [
  {value:'standard', label:'표준 모드', desc:'범용 문서 인식'},
  {value:'compensation', label:'보상평가서 특화', desc:'토지보상법 양식 최적화'},
];

const MASKED_TEXT = `현장조사 보고서

문서번호: 부동산공시처-2026-조사-0047
작성일자: 2026년 3월 5일
담당자: ■■■ 과장 (부동산공시처 공시조사부)

1. 조사 개요

본 보고서는 2026년 표준지공시지가 산정을 위한 현장조사 결과를 기록한 문서입니다. 조사 대상 표준지는 서울특별시 강남구 ■■동 일원 총 12필지이며, 조사 기간은 2026년 2월 28일부터 3월 5일까지 5일간 실시되었습니다.

2. 조사 대상 현황

조사 대상 필지는 상업용지 8필지, 주거용지 4필지로 구성되어 있으며, 도로 접면 및 형상은 아래 첨부 성과도를 참조합니다.

3. 주요 조사 결과

(1) 지가 변동 요인 분석
- 교통 여건: 2호선 ■■역 250m 반경 내 위치로 접근성 우수
- 상권 변화: ■■대로 광역복합환승센터 개발 예정으로 지가 상승 압력 증가
- 공법상 제한: 상업지역 (일반상업) / 용적률 800% 이하

(2) 인근 거래 사례
- ■■동 ○○○-○번지: 3.3㎡당 35,500,000원 (2026.01.15 매매)
- ■■동 ○○○-○번지: 3.3㎡당 34,200,000원 (2025.11.22 매매)

4. 조사 의견

인근 표준지 및 실거래가 분석 결과, 전년 대비 약 4.2% 상승이 적정한 것으로 판단됩니다.

5. 첨부 자료

붙임 1. 표준지 현황 및 위치도
붙임 2. 측량 성과도 (별지)
붙임 3. 인근 거래사례 조서`;

const MASK_LOG = [
  {type:'성명',  original:'김민준',   masked:'■■■',   pos:'담당자 필드'},
  {type:'지명',  original:'삼성동',   masked:'■■동',  pos:'조사 개요 · 거래사례'},
  {type:'도로명',original:'영동대로', masked:'■■대로', pos:'지가 변동 요인'},
  {type:'역명',  original:'삼성역',   masked:'■■역',   pos:'교통 여건'},
];

const EXTRACTED_TEXT = `현장조사 보고서

문서번호: 부동산공시처-2026-조사-0047
작성일자: 2026년 3월 5일
담당자: 김민준 과장 (부동산공시처 공시조사부)

1. 조사 개요

본 보고서는 2026년 표준지공시지가 산정을 위한 현장조사 결과를 기록한 문서입니다. 조사 대상 표준지는 서울특별시 강남구 삼성동 일원 총 12필지이며, 조사 기간은 2026년 2월 28일부터 3월 5일까지 5일간 실시되었습니다.

2. 조사 대상 현황

조사 대상 필지는 상업용지 8필지, 주거용지 4필지로 구성되어 있으며, 도로 접면 및 형상은 아래 첨부 성과도를 참조합니다.

3. 주요 조사 결과

(1) 지가 변동 요인 분석
- 교통 여건: 2호선 삼성역 250m 반경 내 위치로 접근성 우수
- 상권 변화: 영동대로 광역복합환승센터 개발 예정으로 지가 상승 압력 증가
- 공법상 제한: 상업지역 (일반상업) / 용적률 800% 이하

(2) 인근 거래 사례
- 삼성동 ○○○-○번지: 3.3㎡당 35,500,000원 (2026.01.15 매매)
- 삼성동 ○○○-○번지: 3.3㎡당 34,200,000원 (2025.11.22 매매)

4. 조사 의견

인근 표준지 및 실거래가 분석 결과, 전년 대비 약 4.2% 상승이 적정한 것으로 판단됩니다. 개발 사업 진행 경과에 따라 추가 상승 가능성이 있으므로 분기별 모니터링이 필요합니다.

5. 첨부 자료

붙임 1. 표준지 현황 및 위치도
붙임 2. 측량 성과도 (별지)
붙임 3. 인근 거래사례 조서`;

const TABLE_DATA = {
  headers:['기호','소재지','지목','면적(㎡)','공법상 제한','현황 이용 상황'],
  rows:[
    ['①','강남구 삼성동 123','대','412.0','일반상업/용적률 800%','상업용 (사무소)'],
    ['②','강남구 삼성동 124-1','대','297.5','일반상업/용적률 800%','상업용 (판매시설)'],
    ['③','강남구 삼성동 98','대','685.2','일반상업/용적률 800%','상업용 (업무시설)'],
    ['④','강남구 삼성동 56-3','대','203.8','제3종일반주거','주거용 (공동주택)'],
    ['⑤','강남구 삼성동 77','대','318.6','제3종일반주거','주거용 (단독주택)'],
  ],
};

const CONFIDENCE_MAP = [
  {line:'현장조사 보고서',            score:99.8, level:'high'},
  {line:'문서번호: 부동산공시처-2026-조사-0047', score:99.1, level:'high'},
  {line:'작성일자: 2026년 3월 5일',    score:98.7, level:'high'},
  {line:'담당자: 김민준 과장',          score:99.2, level:'high'},
  {line:'1. 조사 개요',                score:99.5, level:'high'},
  {line:'표준지는 서울특별시 강남구 삼성동 일원', score:97.8, level:'high'},
  {line:'2. 조사 대상 현황',           score:99.3, level:'high'},
  {line:'교통 여건: 2호선 삼성역 250m', score:96.4, level:'high'},
  {line:'3.3㎡당 35,500,000원',        score:94.2, level:'med'},
  {line:'붙임 1. 표준지 현황 및 위치도', score:98.6, level:'high'},
];

/* 도메인 이관: REB 기본 콘텐츠 — 도메인 팩 agentContent["agent-ocr"]로 키 단위 오버라이드 */
export const CONTENT_DEFAULTS = {
  sampleFiles: MOCK_FILES,           // {name,size,pages,type:'pdf'|'img'}[2] — 초기 업로드 샘플
  docModeOptions: DOC_MODE_OPTIONS,  // {value,label,desc}[2] — value는 'standard'|'compensation' 고정('compensation'=도메인 특화 모드 슬롯)
  specialModeKeyword:'토지보상법',   // string — 특화 모드 안내의 강조 키워드
  specialModeDesc:'기준 양식 자동 적용 · 보상 평가 항목 구조화 · 공시지가 연동', // string — 특화 모드 안내 본문
  specialModeBadge:'보상평가서 모드', // string — 결과 화면 특화 모드 뱃지 문구
  extractedText: EXTRACTED_TEXT,     // string(멀티라인) — OCR 추출 원문
  maskedText: MASKED_TEXT,           // string(멀티라인) — 마스킹 적용본(extractedText와 대응)
  maskLog: MASK_LOG,                 // {type,original,masked,pos}[4] — PII 마스킹 로그
  tableData: TABLE_DATA,             // {headers:string[6],rows:string[6][5]} — 감지된 표
  tableCaption:'감지된 표 — 표준지 현황', // string — 표 탭 캡션
  confidenceMap: CONFIDENCE_MAP,     // {line,score,level:'high'|'med'|'low'}[10] — 라인별 인식 신뢰도
};

const OCRAgent = ({ onBack, domain }) => {
  const C = {...CONTENT_DEFAULTS, ...(domain?.agentContent?.["agent-ocr"]||{})};
  const {step, setStep, agentIdx, doneIdx, start: startSim, resetSim} = useAgentSimulation(AGENTS, {
    // Vision OCR 단계(i=1) 동안 페이지 진행 티커
    onStepStart: (i, prev, ag) => {
      if (i === 1) {
        for (let p = 1; p <= totalPages; p++) {
          setTimeout(() => setOcrPage(p), prev + (ag.ms / totalPages) * p);
        }
      }
    },
  });
  const [files, setFiles] = useState(C.sampleFiles);
  const [fileDrag, setFileDrag] = useState(false);
  const [ocrLang, setOcrLang] = useState('한국어(기본)');
  const [extractTable, setExtractTable] = useState(true);
  const [numericPrecision, setNumericPrecision] = useState(true);
  const [maskPII, setMaskPII] = useState(false);
  const [docMode, setDocMode] = useState('standard');
  const [resultFormat, setResultFormat] = useState('일반 텍스트');
  const [ocrPage, setOcrPage] = useState(0);
  const [activeTab, setActiveTab] = useState('text');
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const fileRef = useRef(null);

  const totalPages = files.reduce((s, f) => s + (f.pages || 1), 0);

  const removeFile = (i) => setFiles(p => p.filter((_, j) => j !== i));

  const handleDrop = (e) => {
    e.preventDefault(); setFileDrag(false);
    Array.from(e.dataTransfer.files).forEach(f => {
      setFiles(p => [...p, {name:f.name, size:`${(f.size/1024/1024).toFixed(1)}MB`, pages:1, type:'upload'}]);
    });
  };

  const startProcess = () => { setOcrPage(0); startSim(); };

  const reset = () => { resetSim(); setOcrPage(0); setFiles(C.sampleFiles); setActiveTab('text'); setCopied(false); };
  const handleCopy = () => { navigator.clipboard?.writeText(C.extractedText).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  /* 화면에 보이는 본문(마스킹 토글 반영)을 워드 문서로 — 마스킹 상태를 파일명에 남긴다 */
  const handleDownloadDoc = () => {
    const masked = maskPII;
    const body = masked ? C.maskedText : C.extractedText;
    downloadTextFile(`OCR_추출본${masked ? '_마스킹' : ''}.doc`,
      buildDocHtml(`OCR 추출 결과${masked ? ' (개인정보 마스킹 적용)' : ''}`, body),
      'application/msword;charset=utf-8');
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const getScoreColor = (level) => level === 'high' ? 'bg-emerald-500' : level === 'med' ? 'bg-yellow-400' : 'bg-red-400';
  const getScoreTextColor = (level) => level === 'high' ? 'text-emerald-600' : level === 'med' ? 'text-yellow-600' : 'text-red-500';

  if (step === 1) return (
    <div className="flex-1 overflow-y-auto px-6 py-8 bg-white">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-2">
          {onBack && (
            <button onClick={onBack} aria-label="뒤로 가기" className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0">
              <ArrowLeft className="w-4 h-4"/>
            </button>
          )}
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-md shrink-0">
            <ScanText className="w-5 h-5 text-white"/>
          </div>
          <div>
            <div className="text-[15px] font-black text-slate-800">OCR 문서 인식 에이전트</div>
            <div className="text-xs text-slate-400">문서 업로드 → Vision OCR 인식 → 구조화 텍스트 출력</div>
          </div>
        </div>

        {/* 파일 업로드 영역 */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">1 · 문서 파일 업로드</label>
          <div
            onDragOver={e=>{e.preventDefault();setFileDrag(true);}}
            onDragLeave={()=>setFileDrag(false)}
            onDrop={handleDrop}
            onClick={()=>fileRef.current?.click()}
            className={cn(
              'border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-8 cursor-pointer transition-all',
              fileDrag ? 'border-teal-400 bg-teal-50' : 'border-slate-200 hover:border-teal-300 hover:bg-slate-50'
            )}
          >
            <input ref={fileRef} type="file" accept=".jpg,.png,.pdf,.tiff" multiple className="hidden"
              onChange={e=>Array.from(e.target.files).forEach(f=>setFiles(p=>[...p,{name:f.name,size:`${(f.size/1024/1024).toFixed(1)}MB`,pages:1,type:'upload'}]))}/>
            <UploadCloud className={cn('w-8 h-8 mb-2', fileDrag ? 'text-teal-500' : 'text-slate-300')}/>
            <div className={cn('font-bold text-sm', fileDrag ? 'text-teal-600' : 'text-slate-400')}>파일을 드래그하거나 클릭하여 업로드</div>
            <div className="text-[11px] text-slate-300 mt-1">JPG · PNG · PDF · TIFF 지원</div>
          </div>
          {/* 업로드된 파일 목록 */}
          {files.length > 0 && (
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2.5 bg-white hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
                    {f.type === 'pdf' ? <FileText className="w-4 h-4 text-teal-600"/> : <Image className="w-4 h-4 text-teal-600"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold text-slate-700 truncate">{f.name}</div>
                    <div className="text-[11px] text-slate-400">{f.size}{f.pages > 1 ? ` · ${f.pages}페이지` : ''}</div>
                  </div>
                  <button onClick={e=>{e.stopPropagation();removeFile(i);}} aria-label="파일 제거" className="text-slate-300 hover:text-red-400 transition-colors shrink-0">
                    <X className="w-3.5 h-3.5"/>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 옵션 패널 */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider">2 · OCR 설정</label>
          <div className="border border-slate-200 rounded-2xl p-4 space-y-4 bg-white">

            {/* OCR 언어 */}
            <div>
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">OCR 언어</div>
              <div className="flex items-center gap-3 flex-wrap">
                {OCR_LANGUAGE_OPTIONS.map(opt => (
                  <label key={opt} className={cn('flex items-center gap-2 px-3.5 py-2 rounded-xl border cursor-pointer transition-all', ocrLang===opt?'border-teal-400 bg-teal-50':'border-slate-200 bg-white hover:border-teal-200')}>
                    <input type="radio" name="ocrLang" value={opt} checked={ocrLang===opt} onChange={()=>setOcrLang(opt)} className="accent-teal-600"/>
                    <span className={cn('text-[12px] font-bold', ocrLang===opt?'text-teal-700':'text-slate-500')}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 체크박스 옵션 */}
            <div className="flex items-center gap-6 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={extractTable} onChange={e=>setExtractTable(e.target.checked)} className="accent-teal-600 w-4 h-4"/>
                <span className={cn('text-[13px] font-bold', extractTable?'text-slate-700':'text-slate-400')}>표 추출</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={numericPrecision} onChange={e=>setNumericPrecision(e.target.checked)} className="accent-teal-600 w-4 h-4"/>
                <span className={cn('text-[13px] font-bold', numericPrecision?'text-slate-700':'text-slate-400')}>수식/숫자 정밀 인식</span>
              </label>
              {/* 개인정보 자동 마스킹 */}
              <label className={cn('flex items-center gap-2 cursor-pointer select-none px-3 py-1.5 rounded-xl border transition-all', maskPII?'border-rose-300 bg-rose-50':'border-slate-200 hover:border-rose-200')}>
                <input type="checkbox" checked={maskPII} onChange={e=>setMaskPII(e.target.checked)} className="accent-rose-600 w-4 h-4"/>
                <ShieldCheck className={cn('w-3.5 h-3.5', maskPII?'text-rose-600':'text-slate-400')}/>
                <span className={cn('text-[13px] font-bold', maskPII?'text-rose-700':'text-slate-400')}>개인정보 자동 마스킹</span>
              </label>
            </div>

            {/* 특화 문서 처리 모드 — 도메인 팩 docModeOptions로 공급 */}
            <div>
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">문서 처리 모드</div>
              <div className="flex items-center gap-3 flex-wrap">
                {C.docModeOptions.map(opt => (
                  <label key={opt.value} className={cn('flex items-center gap-2.5 px-3.5 py-2 rounded-xl border cursor-pointer transition-all', docMode===opt.value?'border-teal-400 bg-teal-50':'border-slate-200 bg-white hover:border-teal-200')}>
                    <input type="radio" name="docMode" value={opt.value} checked={docMode===opt.value} onChange={()=>setDocMode(opt.value)} className="accent-teal-600"/>
                    <div>
                      <div className={cn('text-[12px] font-bold leading-tight', docMode===opt.value?'text-teal-700':'text-slate-500')}>{opt.label}</div>
                      <div className="text-[10px] text-slate-400 leading-tight">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              {docMode==='compensation'&&(
                <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-700 font-medium">
                  <span className="font-black text-amber-600">{C.specialModeKeyword}</span> {C.specialModeDesc}
                </div>
              )}
            </div>

            {/* 결과 형식 */}
            <div>
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">결과 형식</div>
              <div className="flex items-center gap-3 flex-wrap">
                {RESULT_FORMAT_OPTIONS.map(opt => (
                  <label key={opt} className={cn('flex items-center gap-2 px-3.5 py-2 rounded-xl border cursor-pointer transition-all', resultFormat===opt?'border-teal-400 bg-teal-50':'border-slate-200 bg-white hover:border-teal-200')}>
                    <input type="radio" name="resultFormat" value={opt} checked={resultFormat===opt} onChange={()=>setResultFormat(opt)} className="accent-teal-600"/>
                    <span className={cn('text-[12px] font-bold', resultFormat===opt?'text-teal-700':'text-slate-500')}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={startProcess}
          disabled={files.length === 0}
          className="w-full py-3.5 bg-teal-600 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-200 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4 fill-white"/> OCR 인식 시작
        </button>
      </div>
    </div>
  );

  if (step === 2) return (
    <div className="flex-1 flex min-h-0 overflow-hidden">
      <div className="flex-1 min-w-0 flex flex-col items-center justify-center overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-xl px-6">
          <div className="text-center mb-10">
            <div className="w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-200">
              <Radio className="w-7 h-7 text-white animate-pulse"/>
            </div>
            <div className="text-[18px] font-black text-slate-800">멀티 에이전트 처리 중</div>
            <div className="text-sm text-slate-400 mt-1">Vision OCR 엔진으로 문서를 인식하고 구조화합니다</div>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              {label:'총 페이지',  val:`${totalPages}페이지`},
              {label:'인식률',      val:'98.7%'},
              {label:'표 감지',     val:`${extractTable ? '2개' : '0개'}`},
            ].map(({label,val}) => (
              <div key={label} className="bg-teal-50 border border-teal-100 rounded-xl px-3 py-2.5 text-center">
                <div className="text-[11px] text-teal-500 font-bold">{label}</div>
                <div className="text-[14px] font-black text-teal-700 mt-0.5">{val}</div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {AGENTS.map((ag, i) => {
              const isDone = doneIdx.includes(i);
              const isActive = agentIdx === i;
              const AgIcon = ag.icon;
              return (
                <div key={i}>
                  <div className={cn(
                    'rounded-2xl border-2 p-4 transition-all duration-500',
                    isDone ? 'border-emerald-200 bg-emerald-50/60' : isActive ? 'border-teal-300 bg-teal-50 shadow-md shadow-teal-100' : 'border-slate-100 bg-white opacity-50'
                  )}>
                    <div className="flex items-center gap-3">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all', isDone ? 'bg-emerald-500' : isActive ? ag.color : 'bg-slate-200')}>
                        {isDone ? <CheckCircle className="w-5 h-5 text-white"/> : <AgIcon className={cn('w-5 h-5', isActive ? 'text-white animate-pulse' : 'text-slate-400')}/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={cn('font-black text-sm', isDone ? 'text-emerald-700' : isActive ? 'text-teal-700' : 'text-slate-400')}>{ag.label}</div>
                        <div className={cn('text-xs mt-0.5', isDone ? 'text-emerald-500' : isActive ? 'text-teal-500' : 'text-slate-300')}>
                          {isActive ? `처리 중 — ${ag.sub}` : isDone ? `완료 — ${ag.sub}` : ag.sub}
                        </div>
                      </div>
                      {isActive && <Loader2 className="w-4 h-4 text-teal-500 animate-spin shrink-0"/>}
                      {isDone && <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">완료</span>}
                    </div>
                    {isActive && i === 1 && (
                      <div className="mt-3 rounded-xl bg-slate-900 p-3 space-y-2">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"/>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Vision OCR · http://10.10.1.13:8080</span>
                        </div>
                        {Array.from({length: totalPages}, (_, p) => p + 1).map(p => {
                          const chars = [847, 1203, 634, 921][p-1] ?? 750;
                          return (
                            <div key={p} className="space-y-1">
                              <div className="flex items-center gap-2 text-[9px] font-mono">
                                <span className={cn('font-bold w-14 shrink-0', p <= ocrPage ? 'text-teal-400' : 'text-slate-600')}>
                                  p.{p}/{totalPages}
                                </span>
                                <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                  <div className={cn('h-1.5 rounded-full transition-all duration-700',
                                    p < ocrPage ? 'bg-emerald-500' : p === ocrPage ? 'bg-teal-400 animate-pulse' : 'bg-slate-700'
                                  )} style={{width: p < ocrPage ? '100%' : p === ocrPage ? '60%' : '0%'}}/>
                                </div>
                                {p <= ocrPage ? (
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-emerald-400 font-black">완료</span>
                                    <span className="text-slate-600">{chars.toLocaleString()} chars</span>
                                  </div>
                                ) : (
                                  <span className="text-slate-600 shrink-0">대기</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {/* 엔진 메타 */}
                        <div className="pt-2 border-t border-slate-700 flex gap-4 text-[8px] font-mono text-slate-500">
                          <span>DPI: 300</span>
                          <span>lang: kor</span>
                          <span>engine: Vision-OCR-v2</span>
                          <span className="ml-auto text-teal-500">POST /v1/ocr</span>
                        </div>
                      </div>
                    )}
                    {isActive && i !== 1 && (
                      <div className="mt-3">
                        <div className="h-1 bg-teal-100 rounded-full overflow-hidden">
                          <div className="h-1 bg-teal-500 rounded-full animate-pulse" style={{width:'70%'}}/>
                        </div>
                      </div>
                    )}
                  </div>
                  {i < AGENTS.length - 1 && <div className="flex justify-center my-1"><ChevronRight className="w-4 h-4 text-slate-300 rotate-90"/></div>}
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center text-xs text-slate-400">
            <Network className="w-3.5 h-3.5 inline mr-1 text-teal-400"/>
            멀티 에이전트 아키텍처 — Vision OCR 엔진 + 자동 구조 재구성
          </div>
        </div>
      </div>
      <div className="hidden lg:flex w-80 shrink-0 border-l border-slate-100 bg-gradient-to-b from-slate-50 to-white p-4 overflow-y-auto custom-scrollbar flex-col">
        <AgentWorkflowPanel agentId="agent-ocr" activeStep={agentIdx} doneSteps={doneIdx} />
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      {/* 결과 헤더 */}
      <div className="shrink-0 bg-white border-b px-5 py-2.5 flex items-center gap-2 flex-wrap shadow-sm">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center shrink-0"><CheckCircle className="w-3.5 h-3.5 text-white"/></div>
          <div className="min-w-0">
            <div className="text-[13px] font-black text-slate-800 truncate">OCR 인식 완료</div>
            <div className="text-[10px] text-slate-400">{totalPages}페이지 · 인식률 98.7%{maskPII?` · 개인정보 ${C.maskLog.length}건 마스킹`:''}{docMode==='compensation'?` · ${C.specialModeBadge}`:''}</div>
          </div>
        </div>
        {maskPII&&(
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 border border-rose-200 rounded-lg shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600"/>
            <span className="text-[11px] font-bold text-rose-700">PII 마스킹 {C.maskLog.length}건</span>
          </div>
        )}
        <button onClick={reset} className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-[11px] font-bold text-slate-500 hover:bg-slate-50 transition-colors">
          <RotateCcw className="w-3 h-3"/>새 문서
        </button>
        <button onClick={handleCopy} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors border', copied?'bg-emerald-50 border-emerald-200 text-emerald-700':'border-slate-200 text-slate-500 hover:bg-slate-50')}>
          <Copy className="w-3 h-3"/>{copied ? '복사됨' : '텍스트 복사'}
        </button>
        <button onClick={handleDownloadDoc}
          className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors shadow-sm text-white',
            downloaded?'bg-emerald-600 hover:bg-emerald-700':'bg-teal-600 hover:bg-teal-700')}>
          <Download className="w-3 h-3"/>{downloaded?'내려받음':'워드 다운로드'}
        </button>
      </div>

      {/* 통계 바 */}
      <div className="shrink-0 bg-white border-b border-slate-100 px-5 py-2">
        <div className="flex items-center gap-6 flex-wrap">
          {[
            {label:'총 글자 수', val:`${C.extractedText.replace(/\s/g,'').length.toLocaleString()}자`},
            {label:'표 감지',    val:extractTable?'2개':'0개'},
            {label:'페이지 수',  val:`${totalPages}페이지`},
            {label:'처리 상태',   val:'완료'},
          ].map(({label,val}) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{label}</span>
              <span className="text-[12px] font-black text-teal-700">{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {/* 탭 */}
          <div className="flex items-center bg-white border border-slate-200 rounded-2xl p-1 gap-1 mb-4 shadow-sm">
            {[
              {key:'text',  icon:AlignLeft,   label:'추출 텍스트'},
              {key:'table', icon:Table,       label:'감지된 표'},
              {key:'map',   icon:BarChart2,   label:'처리 현황'},
              ...(maskPII ? [{key:'mask', icon:EyeOff, label:'마스킹 현황'}] : []),
            ].map(({key,icon:TabIcon,label}) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold transition-all',
                  activeTab === key ? 'bg-teal-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                )}
              >
                <TabIcon className="w-3.5 h-3.5"/>{label}
              </button>
            ))}
          </div>

          {/* 탭 콘텐츠 */}
          {activeTab === 'text' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">추출된 텍스트 — {resultFormat}</div>
                  {maskPII&&<span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full"><ShieldCheck className="w-2.5 h-2.5"/>개인정보 마스킹 적용</span>}
                  {docMode==='compensation'&&<span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">{C.specialModeBadge}</span>}
                </div>
                <span className="text-[10px] font-bold text-teal-600 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded-full">{files[0]?.name}</span>
              </div>
              <pre className="px-5 py-5 text-[12.5px] text-slate-700 leading-[1.9] font-sans whitespace-pre-wrap overflow-x-auto">
                {maskPII ? C.maskedText : C.extractedText}
              </pre>
            </div>
          )}

          {activeTab === 'mask' && maskPII && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-500"/>
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">개인정보 마스킹 처리 현황</div>
                <span className="ml-auto text-[10px] font-black text-white bg-rose-500 px-2 py-0.5 rounded-full">{C.maskLog.length}건 처리</span>
              </div>
              <div className="px-5 py-4 space-y-2.5">
                {C.maskLog.map((item,i)=>(
                  <div key={i} className="flex items-center gap-3 p-2.5 bg-rose-50 border border-rose-100 rounded-xl">
                    <div className="w-16 shrink-0">
                      <span className="text-[10px] font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded">{item.type}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1 min-w-0 text-[12px]">
                      <span className="font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded">{item.original}</span>
                      <span className="text-slate-400">→</span>
                      <span className="font-black text-rose-700 tracking-widest bg-rose-100 px-2 py-0.5 rounded border border-rose-200">{item.masked}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 shrink-0 truncate max-w-[140px]">{item.pos}</div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 bg-slate-50 border-t text-[10px] text-slate-400">
                개인정보보호법 · 행정안전부 고시 기준 마스킹 적용 | 원본 데이터는 암호화 보관
              </div>
            </div>
          )}

          {activeTab === 'table' && extractTable && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-0.5">{C.tableCaption}</div>
                <div className="text-[10px] text-slate-300">페이지 2 · 표 자동 감지</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[12px]">
                  <thead>
                    <tr className="bg-teal-600">
                      {C.tableData.headers.map(h => (
                        <th key={h} className="text-white font-bold py-2.5 px-3 text-left whitespace-nowrap border-r border-teal-500 last:border-0">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {C.tableData.rows.map((row, i) => (
                      <tr key={i} className={cn('border-b border-slate-100', i%2===0?'bg-white':'bg-slate-50/50')}>
                        {row.map((cell, j) => (
                          <td key={j} className={cn('py-2.5 px-3 text-slate-700 border-r border-slate-100 last:border-0 whitespace-nowrap', j===0?'font-black text-center text-teal-700':'')}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-2.5 bg-slate-50 border-t text-[10px] text-slate-400">
                총 {C.tableData.rows.length}행 · OCR 자동 감지 · 수동 검토 권장
              </div>
            </div>
          )}

          {activeTab === 'table' && !extractTable && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
              <Table className="w-10 h-10 text-slate-200 mx-auto mb-3"/>
              <div className="text-sm font-bold text-slate-400">표 추출 옵션이 비활성화되어 있습니다</div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider">라인별 OCR 처리 결과</div>
              </div>
              <div className="px-5 py-4 space-y-2.5">
                {C.confidenceMap.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 text-[12px] text-slate-600 truncate">{item.line}</div>
                    <span className={cn('text-[10px] font-black px-2 py-0.5 rounded-full shrink-0',
                      item.level==='high'?'bg-emerald-100 text-emerald-700':'item.level==="med"'?'bg-amber-100 text-amber-700':'bg-red-100 text-red-700',
                      item.level==='med'&&'bg-amber-100 text-amber-700'
                    )}>
                      {item.level==='high'?'정상 인식':item.level==='med'?'검토 권장':'재처리 필요'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-4 text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"/>정상 인식</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"/>검토 권장</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block"/>재처리 필요</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OCRAgent;
